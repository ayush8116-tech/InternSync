---

name: frontend-development-workflow

description: Provide a structured workflow for frontend development and UI tasks by analyzing the existing component architecture, understanding state management, tracing user flows, identifying reusable UI elements, and implementing changes incrementally. Use this skill to avoid premature implementation, prevent UI inconsistencies, ensure minimal and clean styling, and align frontend modifications with the existing design system.

---

# When to Use

Use this skill when the user requests any frontend or UI-related task, including:

* Building new UI components or pages
* Integrating backend APIs into the frontend
* Refactoring component logic or state management
* Fixing CSS, layout, or responsiveness bugs
* Debugging rendering loops or hydration errors
* Updating frontend routing or navigation
* Adding user interactions or animations
* Improving accessibility (a11y) or performance metrics
* Understanding the frontend component tree

Example triggers:

* "Build a user profile dashboard"
* "Fix the alignment on mobile for this navbar"
* "Integrate the new users API into the table component"
* "Refactor this massive React component"
* "Why is this component re-rendering infinitely?"
* "Create a modal for deleting an account"
* "Add loading states to this form submission"

---

# Core Workflow

Follow the workflow strictly in sequence.

Do not skip analysis and planning steps.

Do not directly implement tasks without clarification and approval.

---

# Step 1 — Analyze the Frontend Codebase

Before making changes, analyze the frontend structure thoroughly.

## Understand the Tech Stack & Design System

Identify:

* Frontend framework (e.g., React, Vue, Next.js)
* Styling solution (e.g., Tailwind, CSS Modules, Styled Components)
* State management approach (e.g., Redux, Zustand, React Context)
* Data fetching libraries (e.g., React Query, Axios)
* Existing component libraries (e.g., Radix, MUI, or custom internal library)
* Routing mechanism
* Asset management (icons, fonts, images)

**CRITICAL:** Identify the existing design tokens (colors, spacing, typography) to ensure any new UI perfectly matches the established design system.

---

# Step 2 — Understand Existing Flow and Component Tree

Trace the user journey and component hierarchy related to the requested feature or bug.

Analyze:

* Parent-child component relationships
* Prop drilling vs. global state usage
* Where data is fetched and how it is passed down
* Event handling and callback flows
* Form validation logic
* Loading, empty, and error states

Avoid assumptions. 

Use existing UI components (Buttons, Inputs, Cards) instead of building new ones from scratch whenever possible.

---

# Step 3 — Analyze UI Bugs and Rendering Errors

When debugging:

* Identify if the bug is visual (CSS/layout), logical (state/props), or related to network requests.
* Trace React/framework rendering cycles to identify unnecessary re-renders.
* Inspect browser console for hydration errors, unique key warnings, or network failures.
* Verify cross-browser or device-specific behavior (e.g., mobile Safari).
* Prioritize understanding the root cause of state mismatch or CSS specificity over adding `!important` or quick patches.

---

# Step 4 — Collaboratively Plan the Implementation

Before coding:

1. Summarize the intended user experience (UX) and visual outcome.
2. Break down the UI into smaller, reusable sub-components.
3. Identify where state should live (local vs. global).
4. Discuss styling approaches, explicitly prioritizing simple, minimal design.
5. Present the execution plan and component tree structure.

Collaboratively think through the UI structure with the user. Do not proceed directly into coding.

---

# Step 5 — Ask Clarification Questions

Before implementation, ask clarification questions to ensure edge cases in the UI are covered.

Examples:

* What should the loading state look like (spinners, skeletons)?
* What happens when the API fails (error boundaries, toast notifications)?
* How should this layout behave on mobile/tablet vs. desktop?
* Are there any accessibility (a11y) requirements (e.g., ARIA labels, keyboard navigation)?
* Is there an existing component for [X] that I should reuse?
* What is the empty state if there is no data to display?

Proceed only after receiving approval or clarification.

---

# Step 6 — Create Implementation Tasks

Convert the implementation into structured, UI-focused tasks.

Example structure:

1. Define TypeScript/Prop interfaces.
2. Create dummy/presentational sub-components with minimal styling.
3. Implement state management and hooks.
4. Integrate API fetching and connect state to components.
5. Add loading, error, and empty states.
6. Refine responsive styling.
7. Add interactions and validation.

Keep tasks incremental and reviewable.

---

# Step 7 — Implement Incrementally

Implement one task at a time.

For each task:

1. Explain the goal of the component.
2. Modify the relevant files.
3. **Enforce UI Consistency:** Strictly reuse existing design tokens, typography, and base components.
4. **Enforce Minimal Styling:** Avoid overly complex CSS. Keep aesthetics clean, functional, and minimal. Do not over-engineer animations or layouts.
5. Verify component behavior before moving to the parent/state integration.

Avoid introducing unrelated UI tweaks.

---

# Step 8 — Validate the Implementation

After implementation:

* Verify visual consistency with the rest of the application.
* Test responsiveness across mobile, tablet, and desktop viewports.
* Check behavior under different states (loading, success, error, empty).
* Ensure forms handle validation and submission correctly.
* Validate console cleanliness (no key warnings, no hydration errors).
* Verify keyboard accessibility and focus management.

---

# Behavioral Rules

## Collaborative UI Design

Prefer collaborative thinking over autonomous implementation. Explain your component breakdown and state management reasoning before writing code.

## Strict UI Consistency

Never introduce new colors, fonts, or primary button styles unless explicitly asked. Always search the context for existing variables (e.g., `var(--primary-color)` or Tailwind classes like `text-slate-800`) and reuse them. 

## Keep Styling Simple and Minimal

Prioritize clean, breathable, and minimalist interfaces. Avoid visual clutter, excessive borders, heavy drop shadows, or overly complex CSS unless it matches the existing system. Less is more.

## Avoid Premature Coding

Do not immediately generate component code after receiving a request. Prioritize understanding the component tree and user flow first.

## Respect Existing Architecture

Follow existing:

* File and folder structure (e.g., `/components`, `/hooks`, `/pages`)
* Naming conventions (PascalCase for components, camelCase for functions)
* State management paradigms

# Expected Output Style

Structure responses clearly:

1. Analysis (UI & State)
2. Findings
3. Questions (Edge cases, responsive behavior, states)
4. Plan (Component breakdown)
5. Tasks
6. Implementation
7. Validation

Keep implementation reasoning concise but technically clear. Avoid hidden assumptions about user behavior or screen sizes.
frontend-development-workflow.md
Displaying frontend-development-workflow.md.