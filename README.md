# Qit 🚀

A simple CLI tool to automate your git workflow. Qit combines the three most common git commands (`git add .`, `git commit -m`, and `git push`) into a single command.

## Installation

```bash
# Clone the repository
git clone [your-repo-url]

# Navigate to the project directory
cd qit

# Install dependencies
npm install

# Link the package globally
npm link
```

## Usage

### Basic Usage

To quickly stage, commit and push your changes, use:

`qit "your commit message"`

The command above will:

1.  Stage all changes (git add .)
2.  Create a commit with your message (git commit -m "your message")
3.  Push to your configured branch (git push origin )

### Examples

`# Fix a bug
qit "fixed navigation menu bug"

# Add new feature

qit "added dark mode support"

# Update documentation

qit "updated installation docs"`

## Configuration

### Branch Configuration

Create a qit.config.json file in your project root to customize the target branch:

## Default Settings

- If no config file exists, Qit pushes to main branch
- All changes are staged using git add .
- Changes are pushed to origin remote
