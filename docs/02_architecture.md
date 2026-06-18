# System Architecture & Database Design

## 1. Tech Stack
* **Backend:** Python 3.11+, Django, Django REST Framework.
* **Frontend:** React 18 (Vite template), Tailwind CSS.
* **Database:** PostgreSQL.
* **Infrastructure:** Docker & Docker Compose.
* **CI/CD:** GitHub Actions (Run tests on push, automated deploy).

## 2. Database Schema
The system uses the built-in Django `User` model and three custom models.

### Model: Task
Stores the actual to-do item. Linked to the creator.
* **Crucial Rule:** Must have `ordering = ['is_completed', 'due_at', '-created_at']`.
* `id` (UUID, Primary Key)
* `title` (String, max_length=255, null=False, blank=False)
* `is_completed` (Boolean, default=False)
* `due_at` (DateTime, null=True, blank=True) - Optional deadline.
* `created_at` (DateTime, auto_now_add=True)
* `owner` (ForeignKey to User, on_delete=CASCADE)
* **Computed Property:** `@property def is_overdue(self)` -> Returns True if `due_at` is strictly in the past AND `is_completed` is False.

### Model: SharedAccess
A mapping table that grants a `User` access to another `User`'s tasks.
* `id` (Integer, Primary Key)
* `owner` (ForeignKey to User, related_name='shared_lists') - The person who owns the tasks.
* `shared_with` (ForeignKey to User, related_name='received_lists') - The person who receives access.

### Model: Invitation
Stores the unique UUID token generated when a user invites an email address.
* `token` (UUID, Primary Key, default=uuid4)
* `recipient_email` (EmailField, null=False, blank=False)
* `is_accepted` (Boolean, default=False)
* `created_at` (DateTime, auto_now_add=True)
* `sender` (ForeignKey to User, on_delete=CASCADE)