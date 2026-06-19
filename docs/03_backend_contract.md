# API Contract

All protected endpoints require `Authorization: Bearer <access_token>` in the header. Auth endpoints below have special behavior for obtaining/refreshing tokens.

## Auth & Users
- `POST /api/auth/register/` - Create a new user.
- `POST /api/auth/token/` - Obtain tokens: returns the `access` token in the JSON response body and sets the `refresh` token as an HttpOnly cookie. Frontend should store the `access` token in memory or session and use it in the `Authorization` header for subsequent requests.
- `POST /api/auth/token/refresh/` - Exchange the HttpOnly `refresh` cookie for a new `access` token returned in the response body. The refresh cookie remains HttpOnly and is not exposed to JavaScript.
- `POST /api/auth/token/logout/` - Clear the `refresh` cookie server-side (logs the user out from cookie refresh flow).
- `GET /api/auth/me/` - Returns current user info, requires `Authorization: Bearer <access_token>`.

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