# Product Requirements Document (PRD)

## 1. Project Overview
A web-based Task Management application (To-Do List) that allows users to create, track, and share tasks. The core feature is the ability to securely share task lists with other users via email invitations containing a unique link.

## 2. User Stories
* **Authentication:** As a user, I can register and log in so that my tasks remain private.
* **Task Management:** As a user, I can create new tasks and toggle their completion status. 
* **Sharing (Sender):** As a user, I can enter a friend's email to send them a unique invitation link to view/edit my tasks.
* **Sharing (Recipient):** As a friend, I can click the invitation link, register/login, and gain access to the shared task list.

## 3. Out of Scope (For this MVP)
* Pagination (all tasks are returned in a single list).
* Sub-tasks or nested tasks.
* Real-time WebSockets (polling or page refresh on the frontend is sufficient).
* Complex role management — currently, shared access grants full edit rights to the specific list.