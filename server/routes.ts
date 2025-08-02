import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // This application uses frontend-only architecture with Supabase
  // All authentication and database operations are handled client-side
  // No backend routes needed for core functionality
  
  const httpServer = createServer(app);
  return httpServer;
}
