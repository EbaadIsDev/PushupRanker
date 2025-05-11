import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { PushupSubmission, pushupSubmissionSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Get anonymous user data template
  app.get("/api/anonymous-template", (_req: Request, res: Response) => {
    const template = storage.getAnonymousUserDataTemplate();
    return res.status(200).json(template);
  });
  
  // Submit pushup record (without login)
  app.post("/api/pushups", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const submissionData = pushupSubmissionSchema.parse(req.body);
      
      // Create a new pushup record without userId (for anonymous users)
      const record = await storage.createPushupRecord({
        count: submissionData.count,
        difficultyLevel: submissionData.difficultyLevel,
      });
      
      return res.status(201).json({
        success: true,
        message: "Pushup record created successfully",
        record
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: validationError.message
        });
      }
      
      console.error("Error creating pushup record:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Calculate rank from pushup count (utility endpoint)
  app.get("/api/calculate-rank", (req: Request, res: Response) => {
    const count = parseInt(req.query.count as string);
    
    if (isNaN(count) || count < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid pushup count. Please provide a positive number."
      });
    }
    
    // Basic rank calculation logic
    let tier = "bronze";
    let level = 1;
    let progress = 0;
    let nextThreshold = 0;
    
    if (count < 10) {
      // Beginner: 0-9 pushups
      tier = "bronze";
      level = 1;
      progress = count * 10; // 0-90% within Bronze level 1
      nextThreshold = 10;
    } else if (count < 25) {
      // Bronze level 2: 10-24 pushups
      tier = "bronze";
      level = 2;
      progress = (count - 10) * (100 / 15); // Convert to percentage within this level
      nextThreshold = 25;
    } else if (count < 50) {
      // Bronze level 3: 25-49 pushups
      tier = "bronze";
      level = 3;
      progress = (count - 25) * (100 / 25);
      nextThreshold = 50;
    } else if (count < 75) {
      // Silver level 1: 50-74 pushups
      tier = "silver";
      level = 1;
      progress = (count - 50) * (100 / 25);
      nextThreshold = 75;
    } else if (count < 100) {
      // Silver level 2: 75-99 pushups
      tier = "silver";
      level = 2;
      progress = (count - 75) * (100 / 25);
      nextThreshold = 100;
    } else if (count < 150) {
      // Gold level 1: 100-149 pushups
      tier = "gold";
      level = 1;
      progress = (count - 100) * (100 / 50);
      nextThreshold = 150;
    } else if (count < 200) {
      // Gold level 2: 150-199 pushups
      tier = "gold";
      level = 2;
      progress = (count - 150) * (100 / 50);
      nextThreshold = 200;
    } else if (count < 250) {
      // Platinum level 1: 200-249 pushups
      tier = "platinum";
      level = 1;
      progress = (count - 200) * (100 / 50);
      nextThreshold = 250;
    } else if (count < 300) {
      // Platinum level 2: 250-299 pushups
      tier = "platinum";
      level = 2;
      progress = (count - 250) * (100 / 50);
      nextThreshold = 300;
    } else {
      // Diamond tier: 300+ pushups
      tier = "diamond";
      level = Math.min(5, 1 + Math.floor((count - 300) / 100));
      progress = ((count - 300) % 100) * (100 / 100);
      nextThreshold = 300 + (level * 100);
      
      // Cap at Diamond level 5
      if (level === 5) {
        progress = 100;
        nextThreshold = null;
      }
    }
    
    return res.status(200).json({
      tier,
      level,
      progress: Math.min(100, Math.floor(progress)),
      nextThreshold
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
