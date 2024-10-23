#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execa } from "execa";
import { fileURLToPath } from "url";

// Get current directory (needed for ESM)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getConfig() {
  try {
    // Try to read config file from current working directory
    const configPath = path.join(process.cwd(), "qit.config.json");
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    return {
      branch: config.branch || "main", // Use 'main' if branch is not specified in config
    };
  } catch (error) {
    // Return default config if file doesn't exist or has errors
    return {
      branch: "main",
    };
  }
}

// Get the commit message from command line arguments
function getCommitMessage() {
  // process.argv is an array containing command line arguments
  // [0] = node executable path
  // [1] = script path
  // [2] and onwards = actual arguments we want
  const args = process.argv.slice(2);

  // Join all arguments into a single message
  // This allows messages with spaces like "fixed screen size"
  return args.join(" ");
}

// New function to handle git operations
async function gitPush(commitMessage, branch) {
  try {
    // Stage changes
    console.log("📦 Staging changes...");
    await execa("git", ["add", "."]);

    // Commit with message
    console.log("💾 Committing changes...");
    await execa("git", ["commit", "-m", commitMessage]);

    // Push to remote
    console.log("🚀 Pushing to remote...");
    await execa("git", ["push", "origin", branch]);

    console.log("✅ All done");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

// Main execution
const config = getConfig();
const commitMessage = getCommitMessage();

if (!commitMessage) {
  console.log("Error: Please provide a commit message");
  console.log("Usage: qit <commit message>");
  process.exit(1); // Exit with error code
}

// Since we're using async/await, we need to wrap our execution
gitPush(commitMessage, config.branch).catch((error) => {
  console.error("❌ Unexpected error:", error);
  process.exit(1);
});
