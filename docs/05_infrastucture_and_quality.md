# Infrastructure, Testing & CI/CD Strategy

## 1. Environment Configuration
* **Dev Environment:** * `Dockerfile.dev` (optimized for fast hot-reloading).
    * `docker-compose.dev.yml` (orchestrates backend, frontend, and PostgreSQL).
* **Prod Strategy (Future):**
    * Multi-stage Docker builds, Nginx + Gunicorn, automated deployment pipeline.

## 2. Testing Strategy
We follow a "test-first" mindset.
* **Core Tests:** Validate models, services, and API endpoints.
* **Dynamic Scope:** AI is empowered to identify and implement any additional relevant tests (e.g., edge cases, error handling, permission scenarios) that are essential for the system's robustness.
* **Execution:** All tests must run via `docker-compose run backend python manage.py test`.

## 3. CI/CD Pipeline
* **GitHub Actions (`.github/workflows/main.yml`):**
    * Workflow: Build containers -> Run all tests -> Fail if any tests fail -> (Future: SSH Deploy).