# Implementation Plan & AI Prompts

## Step 0: Dev Infrastructure Setup
**Prompt:**
"Act as a DevOps Engineer. Setup the project infrastructure for local development:
1. Generate `Dockerfile.dev` (Backend: I use python:3.14.3 and dependencies specified in backend/requirements.txt, Frontend: I use node:22.19.0 and dependencies specified in frontend/package.json). Use optimal small images that are sufficient.
2. Generate `docker-compose.dev.yml` (orchestrates backend, frontend, and PostgreSQL). Create .dev.env.example and .dev.env with required pairs.
3. Ensure the backend waits for the database to be ready before starting."

## Step 1: Backend Core (Models & Services)
**Prompt:**
"Act as a Senior Django Developer. Read `01_product_requirements.md` and `02_system_architecture.md`.
1. Generate `models.py`, `serializers.py`, and `services.py`.
2. Requirement: Organize tests into `backend/todo/tests/` package (with `__init__.py`).
3. Requirement: Add `test_models.py` and `test_services.py` for invitation logic and model constraints."

## Step 2: Backend API & Integration Testing
**Prompt:**
"Read `03_api_contract.md`.
1. Generate `views.py` and `urls.py`.
2. Ensure logic uses `services.py`.
3. Add `test_api.py` for endpoint validation (status codes, sharing permissions)."

## Step 3: Frontend Foundation
**Prompt:**
"Read `04_frontend_components.md`.
Write boilerplate: `src/api/axios.js` (with JWT), `src/context/AuthContext.jsx`, and `src/App.jsx`."

## Step 4: Frontend UI Features
**Prompt:**
"Generate `Dashboard.jsx`, `TaskList.jsx`, and `ShareModal.jsx` using Tailwind CSS. Connect them to the API."

---
## Post-MVP: Quality & Automation
* **CI/CD:** Generate `.github/workflows/main.yml` (automated tests on push).
* **Production:** Add `Dockerfile.prod` and `docker-compose.prod.yml` for cloud deployment.