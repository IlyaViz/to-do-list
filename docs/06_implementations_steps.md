# Implementation Plan & AI Prompts

## Step 0: Dev Infrastructure Setup
**Prompt:**
"Act as a DevOps Engineer. Setup the project infrastructure:
1. Generate `Dockerfile.dev` (Backend: python:3.14.3, Frontend: node:22.19.0).
2. Generate `docker-compose.dev.yml` (orchestrates backend, frontend, PostgreSQL).
3. Ensure backend waits for DB readiness."

## Step 1: Backend Core (Models & Services)
**Prompt:**
"Act as a Senior Django Developer. Read the docs.
1. Generate `models.py`, `serializers.py` (for users/tasks), and `services.py`.
2. Requirement: Organize tests into `users/tests/` and `tasks/tests/` packages.
3. Instruction: Beyond the basic tests, identify and implement any other critical unit tests (e.g., invalid input validation, edge cases) for these modules."

## Step 2: Backend API & Integration Testing
**Prompt:**
"Read `03_api_contract.md`.
1. Generate `views.py` and `urls.py` (for users/tasks).
2. Instruction: Implement API tests (`test_api.py`) for all endpoints. Include positive cases and relevant error cases (401 Unauthorized, 403 Forbidden, 404 Not Found) to ensure security."

## Step 3: Frontend Foundation
**Prompt:**
"Acts as a Senior React Devloper. Read `04_frontend_components.md`. 
Write boilerplate: `src/api/axios.js` (with JWT hybrid approach: refresh token in cookies, get a new token when needed via response body of /refresh), `src/context/AuthContext.jsx`, `src/App.jsx`."

## Step 4: Frontend UI Features
**Prompt:**
"Generate `Dashboard.jsx`, `TaskList.jsx`, `ShareModal.jsx` (Tailwind). Connect them to the API."

---
## Post-MVP: Quality & Automation
* **CI/CD:** Generate `.github/workflows/main.yml` (automated tests on push).
* **Production:** Add `Dockerfile.prod` and `docker-compose.prod.yml`.