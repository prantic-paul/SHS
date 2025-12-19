# 01 - Agile & SDLC Basics

**Status:** ✅ Completed  
**Time Required:** 2-3 hours  
**Phase:** Phase 0 - Foundation

---

## 🎯 Learning Objectives

By the end of this topic, you should understand:
1. What is Software Development Life Cycle (SDLC)
2. What is Agile methodology
3. How Agile differs from Waterfall
4. Sprint-based development process
5. Why we use Agile for this project

---

## 📚 What is SDLC?

**Software Development Life Cycle (SDLC)** is the complete process of building software from start to finish.

### Traditional SDLC Phases:

```
1. Planning → 2. Analysis → 3. Design → 4. Implementation → 5. Testing → 6. Deployment → 7. Maintenance
```

**Example (Building a House):**
1. **Planning:** "We need a 3-bedroom house"
2. **Analysis:** Study land, budget, requirements
3. **Design:** Create blueprints, architecture
4. **Implementation:** Build the house
5. **Testing:** Check if everything works
6. **Deployment:** Move in
7. **Maintenance:** Fix issues, renovations

---

## 🔄 Agile Methodology

### What is Agile?

Agile is an **incremental, iterative** approach to software development where you:
- Build in **small pieces** (called sprints)
- Get **feedback quickly**
- **Adapt** based on feedback
- Deliver **working software** regularly

### Waterfall vs Agile

| Waterfall | Agile |
|-----------|-------|
| Do everything at once | Do small pieces at a time |
| Complete design first, then code | Design and code together |
| See final product at the end | See working features every sprint |
| Hard to change | Easy to adapt |
| Like building a house | Like writing a book chapter by chapter |

**Example:**

**Waterfall:** Design entire house → Build entire house → Show at end (6 months later)

**Agile:** 
- Sprint 1: Build bedroom → Show → Get feedback
- Sprint 2: Build kitchen → Show → Get feedback  
- Sprint 3: Build bathroom → Show → Get feedback

---

## 🏃 Sprint-Based Development

### What is a Sprint?

A **sprint** is a **2-4 week period** where you:
1. Plan what to build
2. Build it
3. Test it
4. Show it
5. Get feedback

### Sprint Phases:

```
Sprint Planning → Daily Work → Testing → Review → Retrospective → Next Sprint
```

### Our Project Sprints:

**Sprint 0 (Phase 0):** Setup and architecture  
**Sprint 1:** User authentication  
**Sprint 2:** Doctor profiles  
**Sprint 3:** Appointments  
**Sprint 4:** AI integration  
**Sprint 5:** Blog system  
**Sprint 6:** Polish & testing

---

## 🎯 Agile Principles We Follow

### 1. **Incremental Development**
❌ Don't create all Django apps at once  
✅ Create one app per sprint as needed

### 2. **Working Software**
❌ Don't design for 6 months then code  
✅ Build working features every 2 weeks

### 3. **User Stories**
❌ Don't write 100-page requirements  
✅ Write simple user stories: "As a doctor, I want to..."

### 4. **Adapt to Change**
❌ Don't stick to original plan if it's wrong  
✅ Adjust based on what we learn

### 5. **Collaboration**
❌ Don't work in isolation  
✅ Review, discuss, and improve together

---

## 📖 Key Agile Terms

| Term | Meaning | Example |
|------|---------|---------|
| **Sprint** | 2-4 week development cycle | Sprint 1: Authentication |
| **User Story** | Feature from user's perspective | "As a patient, I want to book appointments" |
| **Backlog** | List of things to build | All features we plan to add |
| **Sprint Planning** | Decide what to build in sprint | Choose authentication for Sprint 1 |
| **Daily Standup** | Quick daily check-in | "Yesterday I did X, today I'll do Y" |
| **Sprint Review** | Show what was built | Demo login feature to stakeholders |
| **Retrospective** | Reflect and improve | "What went well? What to improve?" |

---

## ✅ What We Applied

### In Our Project (Smart Health Synchronizer):

1. **Sprint 0 (Foundation):**
   - Set up project structure
   - Write ADRs (Architecture Decision Records)
   - Create documentation
   - **NOT** building all features at once

2. **Phase 1 (Current):**
   - Finalize architecture (high-level only)
   - Design database schema (blueprint only)
   - **NOT** detailed implementation yet

3. **Sprint 1 (Next):**
   - Build ONLY authentication
   - **NOT** doctor profiles, appointments, etc.

### Mistakes We Avoided:

❌ **Initial Mistake:** Created all Django apps at once  
✅ **Correction:** Removed them, will create incrementally

❌ **Initial Mistake:** Wrote detailed designs for all features  
✅ **Correction:** Keep high-level, detail per sprint

---

## 🎓 Quiz Yourself

1. What is the main difference between Waterfall and Agile?
2. How long is a typical sprint?
3. Why don't we create all Django apps at the beginning?
4. What is a user story?
5. What happens in Sprint Planning?

**Answers:**
1. Waterfall builds everything at once; Agile builds incrementally
2. 2-4 weeks
3. Because Agile = incremental development (build what you need when you need it)
4. A feature described from user's perspective
5. Decide which features to build in the upcoming sprint

---

## 📚 Further Reading

- [Agile Manifesto](https://agilemanifesto.org/)
- [What is Scrum?](https://www.scrum.org/resources/what-is-scrum)
- [User Stories Guide](https://www.atlassian.com/agile/project-management/user-stories)

---

## ✅ Completion Checklist

- [ ] Understand what SDLC is
- [ ] Know the difference between Waterfall and Agile
- [ ] Understand sprint-based development
- [ ] Can explain why we don't build everything at once
- [ ] Ready to write user stories

---

**Next Topic:** [02 - Git & GitHub Workflow](./02-git-github-workflow.md)
