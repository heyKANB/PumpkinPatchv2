import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Privacy policy route
  app.get('/privacy', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'client/public/privacy.html'));
  });

  const httpServer = createServer(app);

  return httpServer;
}
