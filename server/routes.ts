import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { MENU_ITEMS, MENU_CATEGORIES } from "../client/src/lib/constants";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize sample data
  await initializeData();

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
      
      res.status(201).json({ 
        message: "Order placed successfully", 
        orderId: newOrder.id 
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
  
  // Get all orders with their items (for admin)
  app.get("/api/orders", async (req, res) => {
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
  
  // Update order status
  app.put("/api/orders/:id/status", async (req, res) => {
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
        price: item.price,
        image: item.image,
        categoryId: item.categoryId,
        featured: item.featured,
        tags: item.tags
      });
    }
    
    console.log("Sample data initialized");
  }
}
