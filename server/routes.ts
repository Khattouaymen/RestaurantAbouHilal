import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertOrderSchema, 
  insertOrderItemSchema, 
  insertUserSchema,
  updateMenuItemSchema
} from "@shared/schema";
import { MENU_ITEMS, MENU_CATEGORIES } from "../client/src/lib/constants";
import { z } from "zod";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// Extend express-session with our custom data
declare module 'express-session' {
  interface SessionData {
    userId: number;
    username: string;
    ssoState?: string;
  }
}

const scryptAsync = promisify(scrypt);

// Hash and verification functions for passwords
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Middleware to check if user is authenticated
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session middleware
  app.use(session({
    secret: "ABOU-HILAL-SECRET-KEY",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
  
  // Initialize sample data
  await initializeData();
  
  // Ensure admin user exists
  await ensureAdminUser();

  // API endpoints
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  // Menu items
  app.get("/api/menu-items", async (req, res) => {
    try {
      const menuItems = await storage.getAllMenuItems();
      res.json(menuItems);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ message: "Error fetching menu items" });
    }
  });
  
  // Get a single menu item by ID
  app.get("/api/menu-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid menu item ID" });
      }
      
      const menuItem = await storage.getMenuItem(id);
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      
      res.json(menuItem);
    } catch (error) {
      console.error("Error fetching menu item:", error);
      res.status(500).json({ message: "Error fetching menu item" });
    }
  });

  // Create a new menu item (protected by auth)
  app.post("/api/menu-items", isAuthenticated, async (req, res) => {
    try {
      const newMenuItem = req.body;
      
      // Validation basique (à améliorer avec Zod)
      if (!newMenuItem.name || !newMenuItem.price || !newMenuItem.categoryId) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const menuItem = await storage.createMenuItem(newMenuItem);
      res.status(201).json(menuItem);
    } catch (error) {
      console.error("Error creating menu item:", error);
      res.status(500).json({ message: "Error creating menu item" });
    }
  });
  
  // Update an existing menu item (protected by auth)
  app.put("/api/menu-items/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid menu item ID" });
      }
      
      // Valider les données avec Zod
      const updatedMenuItemData = updateMenuItemSchema.parse(req.body);
      
      // Vérifier si le plat existe
      const existingMenuItem = await storage.getMenuItem(id);
      if (!existingMenuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      
      // Mettre à jour le plat
      const menuItem = await storage.updateMenuItem(id, updatedMenuItemData);
      res.json(menuItem);
    } catch (error) {
      console.error("Error updating menu item:", error);
      
      // Vérifier si c'est une erreur de validation Zod
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Error updating menu item" });
    }
  });
  
  // Delete a menu item (protected by auth)
  app.delete("/api/menu-items/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid menu item ID" });
      }
      
      // Vérifier si le plat existe
      const existingMenuItem = await storage.getMenuItem(id);
      if (!existingMenuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      
      // Supprimer le plat
      await storage.deleteMenuItem(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting menu item:", error);
      res.status(500).json({ message: "Error deleting menu item" });
    }
  });

  // Menu items by category
  app.get("/api/menu-items/category/:categoryId", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const menuItems = await storage.getMenuItemsByCategory(categoryId);
      res.json(menuItems);
    } catch (error) {
      console.error("Error fetching menu items by category:", error);
      res.status(500).json({ message: "Error fetching menu items by category" });
    }
  });

  // Place order
  app.post("/api/orders", async (req, res) => {
    try {
      // Validate order data
      const { order, items } = req.body;
      
      const parsedOrder = insertOrderSchema.parse(order);
      
      // Create order
      const newOrder = await storage.createOrder(parsedOrder);
      
      // Add order items
      for (const item of items) {
        const orderItem = {
          orderId: newOrder.id,
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        };
        
        const parsedOrderItem = insertOrderItemSchema.parse(orderItem);
        await storage.addOrderItem(parsedOrderItem);
      }
      
      // Get the order with items to confirm everything was saved correctly
      const orderWithItems = await storage.getOrder(newOrder.id);
      const orderItems = await storage.getOrderItems(newOrder.id);
      
      res.status(201).json({ 
        message: "Order placed successfully", 
        id: newOrder.id,
        order: orderWithItems,
        items: orderItems
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Error creating order" });
    }
  });

  // Get order by ID
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      if (isNaN(orderId)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const orderItems = await storage.getOrderItems(orderId);
      
      res.json({
        order,
        items: orderItems
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Error fetching order" });
    }
  });
  
  // Get all orders with their items (for admin, protected by auth)
  app.get("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      
      // Enrichir chaque commande avec ses articles
      const enrichedOrders = await Promise.all(orders.map(async (order) => {
        const items = await storage.getOrderItems(order.id);
        return {
          ...order,
          items
        };
      }));
      
      res.json(enrichedOrders);
    } catch (error) {
      console.error("Error fetching all orders:", error);
      res.status(500).json({ message: "Error fetching orders" });
    }
  });
  
  // Update order status (protected by auth)
  app.put("/api/orders/:id/status", isAuthenticated, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      if (isNaN(orderId)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      // Vérifier si la commande existe
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Mettre à jour le statut
      const updatedOrder = await storage.updateOrderStatus(orderId, status);
      
      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Error updating order status" });
    }
  });
  
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isPasswordValid = await comparePasswords(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set session data
      req.session.userId = user.id;
      req.session.username = user.username;
      
      res.json({ 
        id: user.id, 
        username: user.username 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Error during login" });
    }
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error during logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  
  app.get("/api/auth/status", async (req, res) => {
    if (req.session && req.session.userId) {
      // Récupérer les informations de l'utilisateur
      const user = await storage.getUser(req.session.userId);
      if (user) {
        return res.json({ 
          isAuthenticated: true, 
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          } 
        });
      }
      return res.json({ isAuthenticated: true });
    }
    res.json({ isAuthenticated: false });
  });
  
  // Route de redirection SSO
  app.get("/api/auth/sso", (req, res) => {
    // Dans un vrai système SSO, cette route redirigerait vers le service d'authentification
    // Les paramètres importants seraient :
    // - client_id : identifiant de votre application auprès du service SSO
    // - redirect_uri : URL de callback pour revenir à votre application après authentification
    // - response_type : généralement "code" pour une authentification via code d'autorisation
    // - scope : les permissions demandées (ex: "openid profile email")
    // - state : un jeton aléatoire pour prévenir les attaques CSRF
    
    // Exemple de redirection SSO (simulée)
    const clientId = process.env.SSO_CLIENT_ID || 'abou-hilal-client';
    const redirectUri = encodeURIComponent(`${req.protocol}://${req.get('host')}/api/auth/sso/callback`);
    const state = Math.random().toString(36).substring(2);
    // Stocker le state dans la session pour vérification ultérieure
    req.session.ssoState = state;
    
    // Dans une implémentation réelle, rediriger vers le service SSO
    // res.redirect(`https://sso-provider.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid profile email&state=${state}`);
    
    // Pour la simulation, on va simplement rediriger vers la page de callback avec un code simulé
    res.redirect(`/api/auth/sso/callback?code=demo_sso_code&state=${state}`);
  });
  
  // Route de callback SSO
  app.get("/api/auth/sso/callback", async (req, res) => {
    const { code, state } = req.query;
    
    // Vérifier le state pour prévenir les attaques CSRF
    if (!state || state !== req.session.ssoState) {
      return res.status(400).send('État invalide, possible tentative d\'attaque CSRF');
    }
    
    try {
      // Dans un vrai système SSO, échanger le code d'autorisation contre un token
      // const tokenResponse = await fetch('https://sso-provider.com/token', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      //   body: new URLSearchParams({
      //     grant_type: 'authorization_code',
      //     code: code as string,
      //     redirect_uri: `${req.protocol}://${req.get('host')}/api/auth/sso/callback`,
      //     client_id: process.env.SSO_CLIENT_ID,
      //     client_secret: process.env.SSO_CLIENT_SECRET
      //   })
      // });
      // const tokenData = await tokenResponse.json();
      
      // Puis récupérer les infos utilisateur avec le token d'accès
      // const userResponse = await fetch('https://sso-provider.com/userinfo', {
      //   headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
      // });
      // const userData = await userResponse.json();
      
      // Pour la démonstration, on va simuler les données utilisateur
      const userData = {
        sub: 'sso_123',
        email: 'sso_user@example.com',
        name: 'SSO User'
      };
      
      // Vérifier si l'utilisateur existe déjà
      let user = await storage.getUserByUsername(userData.sub);
      
      if (!user) {
        // Créer l'utilisateur s'il n'existe pas
        user = await storage.createUser({
          username: userData.sub,
          email: userData.email,
          password: await hashPassword(Math.random().toString(36)) // Mot de passe aléatoire non utilisé en SSO
        });
      }
      
      // Établir la session
      req.session.userId = user.id;
      req.session.username = user.username;
      
      // Rediriger vers la page précédente ou la page d'accueil
      const redirectTo = '/'; // Page par défaut
      res.redirect(redirectTo);
      
    } catch (error) {
      console.error('Erreur lors de l\'authentification SSO:', error);
      res.status(500).send('Erreur lors de l\'authentification SSO');
    }
  });
  


  const httpServer = createServer(app);
  return httpServer;
}

// Initialize sample data in storage
async function initializeData() {
  // Check if we already have menu categories and items
  const existingCategories = await storage.getAllCategories();
  
  if (existingCategories.length === 0) {
    // Add categories
    for (const category of MENU_CATEGORIES) {
      if (category.slug !== 'all') {  // Skip the "All" category as it's just for UI filtering
        await storage.createCategory({
          name: category.name,
          slug: category.slug
        });
      }
    }
    
    // Add menu items
    for (const item of MENU_ITEMS) {
      await storage.createMenuItem({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        image: item.image,
        categoryId: item.categoryId,
        featured: item.featured,
        tags: item.tags
      });
    }
    
    console.log("Sample data initialized");
  }
}

// Ensure admin user exists
async function ensureAdminUser() {
  try {
    // Check if admin user already exists
    const adminUser = await storage.getUserByUsername("admin");
    
    if (!adminUser) {
      // Create admin user if not exists
      const hashedPassword = await hashPassword("admin123");
      
      await storage.createUser({
        username: "admin",
        password: hashedPassword,
        email: "admin@abou-hilal.ma"
      });
      
      console.log("Admin user created");
    }
  } catch (error) {
    console.error("Error ensuring admin user:", error);
  }
}
