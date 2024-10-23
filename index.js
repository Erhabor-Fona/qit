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

const config = getConfig();
console.log(`Current branch: ${config.branch}`);
