#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execa } from "execa";
import { fileURLToPath } from "url";
import chalk from "chalk";

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
    console.log(chalk.blue("📦 Staging changes..."));
    await execa("git", ["add", "."]);

    // Commit with message
    console.log(
      chalk.yellow("💾 Committing:"),
      chalk.white.bold(commitMessage)
    );
    await execa("git", ["commit", "-m", commitMessage]);

    // Push to remote
    console.log(
      chalk.magenta("🚀 Pushing to:"),
      chalk.white.bold(`origin/${branch}`)
    );
    await execa("git", ["push", "origin", branch]);

    console.log(chalk.green("✅ Successfully pushed to remote!"));

    // Show success summary
    console.log("\n" + chalk.bgGreen.black(" SUMMARY "));
    console.log(chalk.green("• Branch:"), chalk.white.bold(branch));
    console.log(chalk.green("• Commit:"), chalk.white.bold(commitMessage));
  } catch (error) {
    console.error("\n" + chalk.bgRed.white(" ERROR "));
    console.error(
      chalk.red("❌ Git operation failed:"),
      chalk.white.bold(error.message)
    );
    process.exit(1);
  }
}

// Main execution
const config = getConfig();
const commitMessage = getCommitMessage();

if (!commitMessage) {
  console.error(chalk.red("❌ Error: Please provide a commit message"));
  console.log(chalk.yellow("Usage:"), chalk.white.bold("qit <commit message>"));
  process.exit(1); // Exit with error code
}

// Since we're using async/await, we need to wrap our execution
gitPush(commitMessage, config.branch).catch((error) => {
  console.error(chalk.red("❌ Unexpected error:"), chalk.white.bold(error));
  process.exit(1);
});
