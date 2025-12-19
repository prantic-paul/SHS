# ADR-001: Use a Monorepo for Backend and Frontend

## Status
Accepted

## Context
The project includes multiple tightly-coupled components such as a backend API, frontend application, and an ML module. These components are developed by the same team and evolve together. Managing them across separate repositories would increase coordination overhead and version compatibility issues.

## Decision
We will use a monorepo to store backend, frontend, and ML components in a single repository.

## Alternatives Considered
- Multiple repositories (one per service)
- Backend-only repository with separate frontend repo

## Consequences

### Positive
- Easier code sharing and refactoring across components
- Single source of truth for project versions
- Simplified CI/CD and dependency management
- Better visibility of system-wide changes

### Negative
- Repository size may grow over time
- Requires discipline in folder structure and access control
- CI pipelines may become slower if not optimized
