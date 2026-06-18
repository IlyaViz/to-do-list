# API Contract

All endpoints (except auth) require `Authorization: Bearer <token>`.

## Auth & Users
* `POST /api/auth/register/` - Create a new user.
* `POST /api/auth/token/` - Get JWT tokens (using SimpleJWT).

## Tasks
* `GET /api/tasks/` - Returns tasks owned by the user + tasks shared with the user (via SharedAccess). No pagination needed.
* `POST /api/tasks/` - Create a task.
* `PATCH /api/tasks/{id}/` - Update task including status (must verify ownership or shared access).
* `DELETE /api/tasks/{id}/` - Delete a task (must verify ownership or shared access).

## Sharing & Invitations
* `POST /api/invites/` 
  * Request: `{"email": "test@example.com"}`
  * Action: Creates an Invitation record and sends an email with the token link using `django.core.mail`.
* `POST /api/invites/accept/{token}/`
  * Action: Validates token, creates `SharedAccess` record, marks token as accepted.