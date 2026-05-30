---

name: backend-development-workflow

description: Provide a structured workflow for backend development tasks by analyzing the existing backend architecture, understanding the technical stack, tracing data flow, identifying dependencies, and implementing changes incrementally through collaborative planning. Use this skill to avoid premature implementation, reduce architectural mistakes, and ensure backend modifications align with the existing system design.

---

# When to Use

Use this skill when the user requests any backend-related task, including:

* Adding new backend features
* Editing existing APIs or services
* Refactoring backend logic
* Fixing backend bugs
* Debugging stack traces
* Modifying database logic
* Updating authentication or authorization flows
* Integrating third-party services
* Creating new endpoints
* Improving backend performance
* Understanding backend architecture
* Tracing request/response flow
* Investigating backend failures

Example triggers:

* "Add pagination to the users API"
* "Fix this backend error"
* "Implement JWT refresh token flow"
* "Refactor this service layer"
* "Add Redis caching"
* "Understand this backend codebase"
* "Create a new endpoint"
* "Why is this API failing?"
* "Update the backend validation logic"

---

# Core Workflow

Follow the workflow strictly in sequence.

Do not skip analysis and planning steps.

Do not directly implement tasks without clarification and approval.

---

# Step 1 — Analyze the Backend Codebase

Before making changes, analyze the backend structure thoroughly.

## Understand the Tech Stack

Identify:

* Backend framework
* Programming language
* ORM or database layer
* Authentication mechanism
* API architecture
* Dependency injection patterns
* Middleware structure
* Environment configuration system
* Background jobs or queues
* Caching systems
* Logging and monitoring setup

Document important architectural patterns before implementation.

---

# Step 2 — Understand Existing Flow

Trace the complete execution flow related to the requested feature or bug.

Analyze:

* Entry points
* Controllers/routes
* Services
* Business logic
* Repositories or database access
* External integrations
* Validation flow
* Error handling
* Response formatting

Understand:

* How data moves through the system
* Existing abstractions
* Reusable utilities
* Dependency relationships

Avoid assumptions.

Use existing patterns consistently.

---

# Step 3 — Analyze Stack Traces and Errors

When debugging:

* Read the complete stack trace
* Identify the root cause instead of patching symptoms
* Trace upstream and downstream dependencies
* Verify whether the issue is architectural, logical, or environmental
* Identify affected modules and side effects

Prioritize understanding over quick fixes.

---

# Step 4 — Collaboratively Plan the Implementation

Before coding:

1. Summarize findings
2. Explain the current system behavior
3. Identify implementation options
4. Discuss tradeoffs
5. Break work into smaller tasks
6. Present the execution plan

Collaboratively think through the implementation with the user.

Do not proceed directly into coding.

---

# Step 5 — Ask Clarification Questions

Before implementation, ask clarification questions whenever requirements are ambiguous.

Examples:

* Expected behavior
* API response format
* Validation requirements
* Error handling expectations
* Database constraints
* Performance considerations
* Backward compatibility requirements
* Security implications
* Edge cases

Proceed only after receiving approval or clarification.

---

# Step 6 — Create Implementation Tasks

Convert the implementation into structured tasks.

Example structure:

1. Update database schema
2. Add repository methods
3. Implement service logic
4. Add controller endpoints
5. Add validation
6. Add tests
7. Update documentation

Keep tasks incremental and reviewable.

---

# Step 7 — Implement Incrementally

Implement one task at a time.

For each task:

1. Explain the goal
2. Modify the relevant files
3. Maintain consistency with existing architecture
4. Avoid unnecessary refactors
5. Keep changes scoped
6. Verify correctness before moving forward

Avoid introducing unrelated changes.

---

# Step 8 — Validate the Implementation

After implementation:

* Verify data flow
* Validate edge cases
* Check backward compatibility
* Ensure error handling consistency
* Verify logging behavior
* Validate API contracts
* Review database interactions
* Run tests where applicable

Ensure the implementation integrates cleanly with the existing system.

---

# Behavioral Rules

## Collaborative Development

Prefer collaborative thinking over autonomous implementation.

Explain reasoning clearly before major architectural decisions.

---

## Avoid Premature Coding

Do not immediately generate code after receiving a request.

Prioritize understanding and planning first.

---

## Respect Existing Architecture

Follow existing:

* Folder structure
* Naming conventions
* Design patterns
* Dependency management
* Error handling standards
* Validation patterns

Avoid introducing conflicting architectural styles.

---

## Prefer Root Cause Fixes

Fix underlying causes instead of applying superficial patches.

Avoid temporary workarounds unless explicitly requested.

---

## Keep Changes Focused

Avoid unnecessary refactors unrelated to the requested task.

Minimize implementation scope creep.

# Expected Output Style

Structure responses clearly:

1. Analysis
2. Findings
3. Questions
4. Plan
5. Tasks
6. Implementation
7. Validation

Keep implementation reasoning concise but technically clear.

Avoid hidden assumptions.
