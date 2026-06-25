# V2 Product Iteration (UX/UI & Feature Enhancements)

## 1. Overview
Based on the feedback for the MVP, this second iteration focuses on improving the "Quality of Life" (QoL) for the user, enhancing the UI/UX, and introducing highly requested product features without breaking the core architecture.

## 2. New Features (The "Product" Value)
* **Sub-tasks Support:** Added the ability to break down complex tasks into smaller steps. Implemented via a self-referential Foreign Key (`parent_task`) to keep the database schema flat and efficient.
* **Leave Shared Group:** Users can now remove themselves from task lists shared with them, fixing a critical UX dead-end in the MVP.
* **Task Scheduling:** Users can now explicitly set and modify the `due_at` date and time during task creation and editing.

## 3. UX/UI Improvements
* **Unified Authentication:** Merged the Login and Registration screens into a single, seamless component to reduce user friction.
* **Keyboard Navigation:** Added `Enter` key support for rapid task creation.
* **Visual Deadlines:** Tasks with `due_at` dates now feature dynamic color indicators (e.g., highlighting overdue tasks in red) to help users prioritize effectively.
* **Empty States & Feedback:** Added visually appealing empty states for empty lists and toast notifications for user actions (e.g., "Task created", "Successfully left the group").
* **Client-Side Filtering:** Added intuitive tab controls (e.g., All, Active, Completed, Expired) to filter tasks on the client side without additional API calls.

## 4. Technical Changes (Backend Contract Update)
* **Database:** Updated the `Task` model to include `parent_task = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='subtasks')`.
* **API:** Added a `DELETE /api/invites/leave/` (or similar) endpoint to allow users to remove their `SharedAccess` records.