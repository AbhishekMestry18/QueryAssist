# Steps to Push Project to GitHub

## Prerequisites
- GitHub account (create one at https://github.com if you don't have one)
- Git installed on your system (check with `git --version`)

## Step-by-Step Instructions

### Step 1: Initialize Git Repository

Open terminal in the project root directory (`E:\QueryAssist`) and run:

```bash
git init
```

### Step 2: Add All Files to Git

```bash
git add .
```

### Step 3: Make Initial Commit

```bash
git commit -m "Initial commit: Query Assist - Audience Query Management System"
```

### Step 4: Create GitHub Repository

1. Go to https://github.com and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `QueryAssist` (or any name you prefer)
   - **Description**: "MERN stack application for managing audience queries with auto-tagging and analytics"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

### Step 5: Add Remote Repository

After creating the repository, GitHub will show you commands. Use the HTTPS URL:

```bash
git remote add origin https://github.com/YOUR_USERNAME/QueryAssist.git
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 6: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

If prompted, enter your GitHub username and password (or use a Personal Access Token).

## Alternative: Using GitHub CLI (if installed)

If you have GitHub CLI installed:

```bash
gh repo create QueryAssist --public --source=. --remote=origin --push
```

## Troubleshooting

### If you get authentication errors:
- Use a Personal Access Token instead of password:
  1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. Generate new token with `repo` permissions
  3. Use the token as password when pushing

### If you need to update .gitignore:
Make sure these are excluded:
- `node_modules/`
- `.env` files
- Build folders
- Log files

## Quick Command Summary

```bash
# Initialize
git init

# Add files
git add .

# Commit
git commit -m "Initial commit: Query Assist - Audience Query Management System"

# Add remote (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/QueryAssist.git

# Push
git branch -M main
git push -u origin main
```

## After Pushing

Your repository will be available at:
`https://github.com/YOUR_USERNAME/QueryAssist`

You can share this URL with others or use it to deploy the application.


