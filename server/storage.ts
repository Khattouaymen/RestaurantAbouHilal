import {
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  menuItems, type MenuItem, type InsertMenuItem,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem
} from "@shared/schema";

// Define interface with all CRUD methods needed
export interface IStorage {
  // User operations (existing)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  getAllCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // MenuItem operations
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  getAllMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  
  // Order operations
  getOrder(id: number): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  
  // OrderItem operations
  getOrderItem(id: number): Promise<OrderItem | undefined>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categoryMap: Map<number, Category>;
  private menuItemMap: Map<number, MenuItem>;
  private orderMap: Map<number, Order>;
  private orderItemMap: Map<number, OrderItem>;
  
  private currentUserId: number;
  private currentCategoryId: number;
  private currentMenuItemId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;

  constructor() {
    this.users = new Map();
    this.categoryMap = new Map();
    this.menuItemMap = new Map();
    this.orderMap = new Map();
    this.orderItemMap = new Map();
    
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentMenuItemId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
  }

  // User operations (existing)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Category operations
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categoryMap.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categoryMap.values()).find(
      (category) => category.slug === slug,
    );
  }
  
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categoryMap.values());
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categoryMap.set(id, category);
    return category;
  }
  
  // MenuItem operations
  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItemMap.get(id);
  }
  
  async getAllMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItemMap.values());
  }
  
  async getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
    return Array.from(this.menuItemMap.values()).filter(
      (menuItem) => menuItem.categoryId === categoryId,
    );
  }
  
  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentMenuItemId++;
    const menuItem: MenuItem = { ...insertMenuItem, id };
    this.menuItemMap.set(id, menuItem);
    return menuItem;
  }
  
  // Order operations
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orderMap.get(id);
  }
  
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orderMap.values());
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id, 
      createdAt: new Date() 
    };
    this.orderMap.set(id, order);
    return order;
  }
  
  // OrderItem operations
  async getOrderItem(id: number): Promise<OrderItem | undefined> {
    return this.orderItemMap.get(id);
  }
  
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItemMap.values()).filter(
      (orderItem) => orderItem.orderId === orderId,
    );
  }
  
  async addOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const orderItem: OrderItem = { ...insertOrderItem, id };
    this.orderItemMap.set(id, orderItem);
    return orderItem;
  }
}

export const storage = new MemStorage();
