# 02 - Git & GitHub Workflow

**Status:** ✅ Completed  
**Time Required:** 3-4 hours  
**Phase:** Phase 0 - Foundation

---

## 🎯 Learning Objectives

By the end of this topic, you should understand:
1. What is Git and why we use it
2. Basic Git commands
3. GitFlow branching strategy
4. How to work with GitHub
5. Proper commit message conventions

---

## 📚 What is Git?

**Git** is a **version control system** that tracks changes to your code.

### Why We Need Git:

**Without Git:**
```
project_v1.py
project_v2.py
project_v2_final.py
project_v2_final_REALLY_FINAL.py ← Which one is the real final? 😅
```

**With Git:**
```
git log
- commit 3: "feat: add user authentication"
- commit 2: "fix: resolve login bug"
- commit 1: "initial: project setup"
```

### Benefits:

1. **Track History:** See all changes made
2. **Undo Mistakes:** Go back to previous versions
3. **Collaboration:** Multiple people can work together
4. **Branching:** Work on features without breaking main code
5. **Backup:** Code is safe on GitHub

---

## 🌿 GitFlow Branching Strategy

### Branch Types:

```
main (production-ready code only)
  ↓
develop (integration branch)
  ↓
feature/sprint-X-feature-name (individual features)
```

### Our Branching Structure:

| Branch | Purpose | Example |
|--------|---------|---------|
| `main` | Production-ready, stable code | Final working version |
| `develop` | Integration, testing ground | Merge features here first |
| `feature/*` | Individual features | `feature/sprint-1-auth` |

### Workflow:

```bash
# 1. Start from develop
git checkout develop

# 2. Create feature branch
git checkout -b feature/sprint-1-user-auth

# 3. Work on feature (make commits)
git add .
git commit -m "feat: add user model"

# 4. Push to GitHub
git push origin feature/sprint-1-user-auth

# 5. Create Pull Request (PR) on GitHub
# Review → Approve → Merge to develop

# 6. After testing, merge develop to main
git checkout main
git merge develop
git push origin main
```

---

## 💻 Essential Git Commands

### Setup Commands (One-time)

```bash
# Initialize Git repository
git init

# Set default branch to main
git branch -M main

# Add remote repository
git remote add origin https://github.com/username/repo.git

# Check remote
git remote -v
```

### Daily Commands

```bash
# Check status (what changed?)
git status

# See differences
git diff

# Add files to staging
git add .                    # Add all files
git add filename.py          # Add specific file

# Commit changes
git commit -m "commit message"

# Push to GitHub
git push origin branch-name

# Pull latest changes
git pull origin branch-name

# See commit history
git log --oneline
```

### Branching Commands

```bash
# List all branches
git branch

# Create new branch
git branch branch-name

# Switch to branch
git checkout branch-name

# Create and switch (shortcut)
git checkout -b branch-name

# Delete branch
git branch -d branch-name

# Merge branch
git checkout main
git merge feature-branch
```

---

## 📝 Commit Message Conventions

### Format:

```
type: short description

longer description (optional)
```

### Types:

| Type | When to Use | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: add user registration` |
| `fix` | Bug fix | `fix: resolve login error` |
| `docs` | Documentation | `docs: update README` |
| `style` | Formatting | `style: format code with black` |
| `refactor` | Code restructure | `refactor: simplify user model` |
| `test` | Add tests | `test: add authentication tests` |
| `chore` | Maintenance | `chore: update dependencies` |

### Good vs Bad Commits:

❌ **Bad:**
```
git commit -m "update"
git commit -m "fix stuff"
git commit -m "asdfasdf"
```

✅ **Good:**
```
git commit -m "feat: add JWT authentication to user login"
git commit -m "fix: resolve token expiration bug"
git commit -m "docs: add API documentation for auth endpoints"
```

---

## 🚀 What We Did in Phase 0

### 1. **Initialized Repository**
```bash
cd /home/prantic/SHS
git init
git branch -M main
```

### 2. **Added Remote**
```bash
git remote add origin https://github.com/prantic-paul/SHS.git
```

### 3. **Created Branches**
```bash
git branch develop
git push -u origin main
git push -u origin develop
```

### 4. **Made Commits**
```bash
git add .
git commit -m "chore: initial project setup - Phase 0 complete"
git push origin main
```

---

## 🛠️ Common Git Scenarios

### Scenario 1: Made a Mistake, Want to Undo

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes) ⚠️ CAREFUL!
git reset --hard HEAD~1

# Undo changes in a file
git checkout -- filename.py
```

### Scenario 2: Want to See What Changed

```bash
# See unstaged changes
git diff

# See staged changes
git diff --cached

# See changes in specific file
git diff filename.py
```

### Scenario 3: Forgot to Add Files to Last Commit

```bash
# Add forgotten files
git add forgotten_file.py

# Amend last commit
git commit --amend --no-edit
```

### Scenario 4: Need to Switch Branches but Have Uncommitted Changes

```bash
# Save changes temporarily
git stash

# Switch branch
git checkout other-branch

# Come back and restore changes
git checkout original-branch
git stash pop
```

---

## 📁 .gitignore File

**Purpose:** Tell Git which files to IGNORE (don't track)

**Our .gitignore includes:**
```
# Virtual environments (too big, can be recreated)
venv/
.venv/
backend/venv/
ai-service/venv/

# Environment variables (sensitive data)
.env
*.env

# Python bytecode (generated files)
__pycache__/
*.pyc

# Node modules (too big)
node_modules/

# Database (local data)
*.sqlite3
db.sqlite3

# IDE files
.vscode/
.idea/
```

**Why?**
- Don't track large files (venv, node_modules)
- Don't track sensitive data (.env files)
- Don't track generated files (can be recreated)

---

## ✅ Best Practices We Follow

1. **Never commit to main directly**
   - Always use feature branches
   - Merge through develop first

2. **Write meaningful commit messages**
   - Use conventional commit format
   - Be specific about what changed

3. **Commit frequently**
   - Small, focused commits
   - Easier to track and undo

4. **Pull before push**
   - Always get latest changes first
   - Avoid merge conflicts

5. **Use .gitignore**
   - Don't commit virtual environments
   - Don't commit sensitive data

---

## 🎓 Quiz Yourself

1. What's the difference between `git add` and `git commit`?
2. When do we use `main` branch vs `develop` branch?
3. What type should you use for commit message when adding a new feature?
4. Why don't we commit `venv/` folder?
5. How do you create a new branch and switch to it?

**Answers:**
1. `git add` stages files; `git commit` saves them to history
2. `main` for production-ready code; `develop` for integration/testing
3. `feat:`
4. Too large, can be recreated with `python -m venv venv`
5. `git checkout -b branch-name`

---

## 🔗 GitHub Features We Use

### 1. **Repository**
- Central place to store code
- Link: https://github.com/prantic-paul/SHS

### 2. **Branches**
- View all branches
- See branch protection rules

### 3. **Pull Requests (PR)**
- Request to merge code
- Code review before merging
- Discussions and feedback

### 4. **Issues**
- Track bugs and features
- Assign to team members

### 5. **Actions** (Future)
- Automated testing
- Continuous Integration (CI)

---

## 📚 Further Reading

- [Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [GitFlow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

---

## ✅ Completion Checklist

- [ ] Understand what Git is and why we use it
- [ ] Know basic Git commands (add, commit, push, pull)
- [ ] Understand branching (main, develop, feature branches)
- [ ] Can write proper commit messages
- [ ] Know what goes in .gitignore

---

**Previous Topic:** [01 - Agile & SDLC Basics](./01-agile-sdlc-basics.md)  
**Next Topic:** [03 - Project Structure & Monorepo](./03-project-structure-monorepo.md)
