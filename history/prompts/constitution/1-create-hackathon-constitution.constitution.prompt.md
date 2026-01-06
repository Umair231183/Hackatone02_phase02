---
id: 1
title: Create Hackathon Constitution
stage: constitution
date: 2026-01-04
surface: agent
model: Qwen
feature: none
branch: main
user: DELL
command: /sp.constitution
labels: [constitution, hackathon, specification]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - .specify/memory/constitution.md
---

## Prompt

```
text
$ARGUMENTS
```

---
description: Create or update the project constitution from interactive or provided principle inputs, ensuring all dependent templates stay in sync.
handoffs: 
  - label: Build Specification
    agent: sp.specify
    prompt: Implement the feature specification based on the updated constitution. I want to build...
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are updating the project constitution at `.specify/memory/constitution.md`. This file is a TEMPLATE containing placeholder tokens in square brackets (e.g. `[PROJECT_NAME]`, `[PRINCIPLE_1_NAME]`). Your job is to (a) collect/derive concrete values, (b) fill the template precisely, and (c) propagate any amendments across dependent artifacts.

Follow this execution flow:

1. Load the existing constitution template at `.specify/memory/constitution.md`.
   - Identify every placeholder token of the form `[ALL_CAPS_IDENTIFIER]`.
   **IMPORTANT**: The user might require less or more principles than the ones used in the template. If a number is specified, respect that - follow the general template. You will update the doc accordingly.

2. Collect/derive values for placeholders:
   - If user input (conversation) supplies a value, use it.
   - Otherwise infer from existing repo context (README, docs, prior constitution versions if embedded).
   - For governance dates: `RATIFICATION_DATE` is the original adoption date (if unknown ask or mark TODO), `LAST_AMENDED_DATE` is today if changes are made, otherwise keep previous.
   - `CONSTITUTION_VERSION` must increment according to semantic versioning rules:
     - MAJOR: Backward incompatible governance/principle removals or redefinitions.
     - MINOR: New principle/section added or materially expanded guidance.
     - PATCH: Clarifications, wording, typo fixes, non-semantic refinements.
   - If version bump type ambiguous, propose reasoning before finalizing.

3. Draft the updated constitution content:
   - Replace every placeholder with concrete text (no bracketed tokens left except intentionally retained template slots that the project has chosen not to define yet—explicitly justify any left).
   - Preserve heading hierarchy and comments can be removed once replaced unless they still add clarifying guidance.
   - Ensure each Principle section: succinct name line, paragraph (or bullet list) capturing non‑negotiable rules, explicit rationale if not obvious.
   - Ensure Governance section lists amendment procedure, versioning policy, and compliance review expectations.

4. Consistency propagation checklist (convert prior checklist into active validations):
   - Read `.specify/templates/plan-template.md` and ensure any "Constitution Check" or rules align with updated principles.
   - Read `.specify/templates/spec-template.md` for scope/requirements alignment—update if constitution adds/removes mandatory sections or constraints.
   - Read `.specify/templates/tasks-template.md` and ensure task categorization reflects new or removed principle-driven task types (e.g., observability, versioning, testing discipline).
   - Read each command file in `.specify/templates/commands/*.md` (including this one) to verify no outdated references (agent-specific names like CLAUDE only) remain when generic guidance is required.
   - Read any runtime guidance docs (e.g., `README.md`, `docs/quickstart.md`, or agent-specific guidance files if present). Update references to principles changed.

5. Produce a Sync Impact Report (prepend as an HTML comment at top of the constitution file after update):
   - Version change: old → new
   - List of modified principles (old title → new title if renamed)
   - Added sections
   - Removed sections
   - Templates requiring updates (✅ updated / ⚠ pending) with file paths
   - Follow-up TODOs if any placeholders intentionally deferred.

6. Validation before final output:
   - No remaining unexplained bracket tokens.
   - Version line matches report.
   - Dates ISO format YYYY-MM-DD.
   - Principles are declarative, testable, and free of vague language ("should" → replace with MUST/SHOULD rationale where appropriate).

7. Write the completed constitution back to `.specify/memory/constitution.md` (overwrite).

8. Output a final summary to the user with:
   - New version and bump rationale.
   - Any files flagged for manual follow-up.
   - Suggested commit message (e.g., `docs: amend constitution to vX.Y.Z (principle additions + governance update)`).

Formatting & Style Requirements:

- Use Markdown headings exactly as in the template (do not demote/promote levels).
- Wrap long rationale lines to keep readability (<100 chars ideally) but do not hard enforce with awkward breaks.
- Keep a single blank line between sections.
- Avoid trailing whitespace.

If the user supplies partial updates (e.g., only one principle revision), still perform validation and version decision steps.

If critical info missing (e.g., ratification date truly unknown), insert `TODO(<FIELD_NAME>): explanation` and include in the Sync Impact Report under deferred items.

Do not create a new template; always operate on the existing `.specify/memory/constitution.md` file.

---

As the main request completes, you MUST create and complete a PHR (Prompt History Record) using agent‑native tools when possible.

1) Determine Stage
   - Stage: constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general

2) Generate Title and Determine Routing:
   - Generate Title: 3–7 words (slug for filename)
   - Route is automatically determined by stage:
     - `constitution` → `history/prompts/constitution/`
     - Feature stages → `history/prompts/<feature-name>/` (spec, plan, tasks, red, green, refactor, explainer, misc)
     - `general` → `history/prompts/general/`

3) Create and Fill PHR (Shell first; fallback agent‑native)
   - Run: `.specify/scripts/bash/create-phr.sh --title "<title>" --stage <stage> [--feature <name>] --json`
   - Open the file and fill remaining placeholders (YAML + body), embedding full PROMPT_TEXT (verbatim) and concise RESPONSE_TEXT.
   - If the script fails:
     - Read `.specify/templates/phr-template.prompt.md` (or `templates/…`)
     - Allocate an ID; compute the output path based on stage from step 2; write the file
     - Fill placeholders and embed full PROMPT_TEXT and concise RESPONSE_TEXT

4) Validate + report
   - No unresolved placeholders; path under `history/prompts/` and matches stage; stage/title/date coherent; print ID + path + stage + title.
   - On failure: warn, don't block. Skip only for `/sp.phr`.


/sp.constitution # 🏛️ Constitution

## Hackathon II – Phase II (Full‑Stack Web Application)

### Spec‑Driven Development using SpecifyPlus Kit + Qwen CLI

---

## 1. Purpose

This Constitution defines the **binding rules, principles, and workflow** for **Phase II** of Hackathon II: **Todo Full‑Stack Web Application**.

The objective of Phase II is to transform the Phase I in‑memory console todo application into a **secure, multi‑user, persistent web application** using **Spec‑Driven Development (SDD)**.

This phase is governed by **SpecifyPlus Kit** for specification management and **Qwen CLI** as the sole implementation agent.

> The developer’s role is **Product Architect**, not code writer.

---

## 2. Scope

This Constitution applies **only** to Phase II and governs:

* Frontend: **Next.js (App Router)**
* Backend: **Python FastAPI**
* ORM: **SQLModel**
* Database: **Neon Serverless PostgreSQL**
* Authentication: **Better Auth (JWT‑based)**
* AI Tooling: **Qwen CLI**
* Spec System: **SpecifyPlus Kit**

---

## 3. Supreme Law: No Manual Coding

### 3.1 Zero Manual Code Rule

* ❌ No source code may be written, edited, or patched manually
* ✅ All code must be generated by **Qwen CLI**
* ✅ Corrections are made **only by refining specifications**

If the output is incorrect:

> **Fix the spec, regenerate — never touch the code**

Violation of this rule invalidates the phase.

---

## 4. Spec‑Driven Development Authority

### 4.1 Specs Are the Single Source of Truth

* Behavior, structure, APIs, and UI must originate from specs
* Code, comments, or assumptions cannot override specs
* If something is not specified, it does not exist

### 4.2 Mandatory Spec Categories (SpecifyPlus Kit)

```
/specs
 ├── overview.md
 ├── architecture.md
 ├── features/
 │   ├── task-crud.md
 │   └── authentication.md
 ├── api/
 │   └── rest-endpoints.md
 ├── database/
 │   └── schema.md
 └── ui/
     ├── pages.md
     └── components.md
```

Each spec must include:

* Purpose
* User stories
* Acceptance criteria
* Constraints
* Error scenarios

---

## 5. SpecifyPlus Kit Rules

### 5.1 Spec Lifecycle

* Specs must be written **before** implementation
* Spec changes must be versioned and traceable
* Regeneration must reference exact spec paths

### 5.2 Invocation Discipline

All generation prompts must follow this structure:

```
Implement @specs/<path>.md
Follow Constitution.md strictly
Use SpecifyPlus conventions
Generate code only
```

---

## 6. AI Governance (Qwen CLI)

### 6.1 Qwen CLI Authority

* Qwen CLI is the **only entity** allowed to generate code
* Qwen CLI must read:

  * Constitution.md
  * Relevant specs
  * Project CLAUDE.md‑equivalent instructions

### 6.2 Regeneration Rule

* Any architectural or behavioral change requires:

  1. Spec update
  2. Full regeneration

Incremental manual fixes are forbidden.

---

## 7. System Architecture Laws

### 7.1 Separation of Concerns

| Layer              | Responsibility                               |
| ------------------ | -------------------------------------------- |
| Frontend (Next.js) | UI, routing, session handling                |
| Backend (FastAPI)  | Business logic, validation, auth enforcement |
| Database (Neon)    | Persistent storage                           |
| Auth (Better Auth) | Identity, JWT issuance                       |

### 7.2 Stateless Backend

* Backend must remain stateless
* All state is stored in the database

---

## 8. Authentication & Security Constitution

### 8.1 JWT Mandatory Rule

* Every API request must include a valid JWT
* JWT must be issued by Better Auth
* FastAPI must verify JWT using shared secret

### 8.2 User Isolation Law

* Users can access **only their own tasks**
* All DB queries must be filtered by authenticated user ID
* URL `user_id` must match JWT identity

Security violations result in automatic failure.

---

## 9. API Contract Law

### 9.1 Fixed REST Endpoints

| Method | Endpoint                             |
| ------ | ------------------------------------ |
| GET    | `/api/{user_id}/tasks`               |
| POST   | `/api/{user_id}/tasks`               |
| GET    | `/api/{user_id}/tasks/{id}`          |
| PUT    | `/api/{user_id}/tasks/{id}`          |
| DELETE | `/api/{user_id}/tasks/{id}`          |
| PATCH  | `/api/{user_id}/tasks/{id}/complete` |

Endpoints may not deviate from spec definitions.

---

## 10. Database & Persistence Law

### 10.1 Persistence Requirement

* In‑memory storage is forbidden
* Neon PostgreSQL must be used
* SQLModel defines all schemas

### 10.2 Ownership Constraint

* Each task must include `user_id`
* Ownership enforcement is mandatory at query level

---

## 11. Frontend Architecture Rules

### 11.1 Next.js Standards

* App Router is mandatory
* Server Components by default
* Client Components only when necessary

### 11.2 API Boundary Rule

* Frontend must never access database directly
* All data access occurs via FastAPI

---

## 12. Error Handling Law

Standardized responses:

| Status | Meaning                              |
| ------ | ------------------------------------ |
| 401    | Unauthorized (missing/invalid JWT)   |
| 403    | Forbidden (user isolation violation) |
| 404    | Resource not found                   |
| 422    | Validation error                     |

Errors must be spec‑defined and deterministic.

---

## 13. Deliverables Requirement

Phase II submission must include:

1. Public GitHub repository
2. Complete `/specs` directory
3. Constitution.md
4. CLAUDE.md or Qwen CLI instruction file
5. Deployed Frontend (Vercel)
6. Deployed Backend API
7. Demo video (≤ 90 seconds)

---

## 14. Forward Compatibility Rule

Phase II must remain compatible with:

* Phase III (AI Chatbot)
* MCP tools
* Agent‑based architecture

Shortcuts that block later phases are prohibited.

---

## 15. Final Authority Clause

In case of conflict between:

* Generated code ❌
* README ❌
* Individual spec ❌
* **Constitution.md ✅**

The Constitution is final and absolute.

---

### 🧠 Guiding Principle

> “We do not debug code.
> We refine specifications until AI cannot fail.”

---

**Phase II governed.
Specs before code.
Architecture over syntax.** 🚀

## Response snapshot

I have successfully updated the project constitution file at `.specify/memory/constitution.md` with the specific content for your Hackathon II - Phase II project. Here's the summary:

**New Version**: 1.0.0 (initial version)
**Bump Rationale**: Initial creation of the constitution for the Hackathon II - Phase II project, replacing the template placeholders with specific project principles and governance rules.

**Changes Made**:
- Replaced all placeholder tokens with specific project content
- Added 6 core principles covering No Manual Coding, Spec-Driven Development, SpecifyPlus Kit Rules, AI Governance, System Architecture, and Security
- Added sections for Additional Constraints, Development Workflow, and Governance
- Created a Sync Impact Report at the top of the file
- Set the ratification and amendment dates to today (2026-01-04)

**Files Flagged for Manual Follow-up**: None required

**Suggested Commit Message**: `docs: create constitution for Hackathon II - Phase II project`

The constitution now properly reflects the requirements for your Full-Stack Web Application project using Spec-Driven Development with SpecifyPlus Kit and Qwen CLI, including all the specific rules about no manual coding, spec-driven development, and the technology stack requirements.

All template files were checked for consistency and no updates were needed to maintain alignment with the new constitution.

## Outcome

- ✅ Impact: Created the initial project constitution for Hackathon II - Phase II
- 🧪 Tests: No tests required for this task
- 📁 Files: Updated .specify/memory/constitution.md with project-specific content
- 🔁 Next prompts: Ready to create feature specifications based on this constitution
- 🧠 Reflection: The constitution establishes clear governance for the project with the key rule that no manual coding is allowed - all code must be generated by Qwen CLI.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Not applicable
- Prompt variant (if applicable): Standard constitution creation
- Next experiment (smallest change to try): Begin creating feature specifications based on this constitution