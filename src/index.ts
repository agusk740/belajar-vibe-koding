import { Elysia } from "elysia";
import { db } from "./db";
import { users } from "./db/schema";

const app = new Elysia()
  // Health check endpoint
  .get("/", () => ({
    status: "ok",
    message: "ElysiaJS + Drizzle + MySQL server is running!",
  }))

  // Get all users from MySQL using Drizzle
  .get("/users", async () => {
    try {
      const allUsers = await db.select().from(users);
      return {
        success: true,
        data: allUsers,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch users (make sure your MySQL database is running and configured correctly in .env)",
      };
    }
  })

  // Create a new user (for testing purposes)
  .post("/users", async ({ body }) => {
    try {
      const { name, email } = body as { name: string; email: string };
      if (!name || !email) {
        return { success: false, error: "Name and email are required" };
      }
      await db.insert(users).values({ name, email });
      return {
        success: true,
        message: "User created successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to create user",
      };
    }
  })

  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
