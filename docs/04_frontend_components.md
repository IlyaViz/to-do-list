# Frontend Structure

## 1. Global Setup
* **Routing:** `react-router-dom` (v6).
* **State/API:** Context API for Auth state, `axios` interceptors for injecting the JWT token.
* **Styling:** Tailwind CSS (Mobile-first approach is mandatory).

## 2. Component Tree
* `App` (Router & AuthProvider)
  * `LoginPage` & `RegisterPage`
  * `Dashboard` (Protected Route)
    * `TaskForm` (Input for new tasks)
    * `TaskList` (Renders tasks sequentially as provided by backend)
      * `TaskItem` (Checkbox + Title + Delete button)
    * `ShareModal` (Input for email to trigger `/api/invites/`)
  * `AcceptInvitePage` (Route: `/accept-invite?token=...`) - Handles the token validation on mount and redirects to Dashboard.