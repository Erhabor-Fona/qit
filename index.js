#!/usr/bin/env node

console.log("Program started");
const fs = require("fs");
const path = require("path");

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

const config = getConfig();
const commitMessage = getCommitMessage();

if (!commitMessage) {
  console.log("Error: Please provide a commit message");
  console.log("Usage: qit <commit message>");
  process.exit(1); // Exit with error code
}

console.log(`Pushing "${commitMessage}" to ${config.branch}`);
