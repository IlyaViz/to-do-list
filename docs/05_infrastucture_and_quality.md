# Infrastructure, Testing & CI/CD Strategy

## 1. Environment Configuration
* **Dev Environment:** * `Dockerfile.dev` (optimized for fast hot-reloading).
    * `docker-compose.dev.yml` (orchestrates backend, frontend, and PostgreSQL).
* **Prod Strategy (Future):**
    * Different `.prod` files with other runners like nginx and optimized backend

## 2. Testing Strategy
We focus on critical paths to ensure system reliability.
* **Backend Unit Tests:** * `test_models.py`: Validate `is_overdue` logic and model constraints.
    * `test_services.py`: Validate invitation token generation and access granting.
* **Backend Integration Tests:**
    * `test_api.py`: Verify status codes for critical endpoints (Registration, Task CRUD, Invitation flow).
* **Execution:** All tests must run via `docker-compose run backend python manage.py test`.

## 3. CI/CD Pipeline
* **GitHub Actions (`.github/workflows/main.yml`):**
    * Trigger: Push to `main`.
    * Workflow:
        1. Build containers via `docker-compose`.
        2. Run automated backend tests.
        3. Fail pipeline if tests do not pass. 
        4. Deploy using SSH.