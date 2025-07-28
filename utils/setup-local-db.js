#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Setting up local Supabase development environment...");

try {
  // Check if Docker is running
  try {
    execSync("docker info", { stdio: "ignore" });
  } catch (error) {
    console.error(
      "❌ Docker is not running. Please start Docker Desktop and try again."
    );
    process.exit(1);
  }

  // Start Supabase services
  console.log("📦 Starting Supabase services...");
  execSync("npx supabase start", { stdio: "inherit" });

  // Apply migrations
  console.log("🔄 Applying database migrations...");
  execSync("npx supabase db reset", { stdio: "inherit" });

  console.log("✅ Local Supabase environment is ready!");
  console.log("📋 Next steps:");
  console.log(
    "1. Copy the connection details from above to your .env.local file"
  );
  console.log("2. Your local Supabase dashboard: http://localhost:54323");
  console.log('3. Use "npm run supabase:stop" to stop the services when done');
} catch (error) {
  console.error("❌ Setup failed:", error.message);
  process.exit(1);
}
