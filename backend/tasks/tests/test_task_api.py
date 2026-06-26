from rest_framework.test import APITestCase
from rest_framework import status
from datetime import timedelta
from django.utils import timezone
from .utils import setup_two_users
from ..models import Task, SharedAccess


class TaskAPITests(APITestCase):
    """Тести для API завдань."""

    def setUp(self):
        self.token_url = "/api/auth/token/"
        self.tasks_url = "/api/tasks/"

        self.client1, self.client2, self.user1, self.user2 = setup_two_users(
            self.token_url
        )

    def test_create_task_success(self):
        """Успішне створення завдання."""

        client = self.client1

        data = {
            "title": "Нове завдання",
            "is_completed": False,
            "due_at": (timezone.now() + timedelta(days=1)).isoformat(),
        }

        response = client.post(self.tasks_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "Нове завдання")
        self.assertEqual(response.data["owner"], "user1")
        self.assertEqual(Task.objects.count(), 1)

    def test_create_task_without_auth(self):
        """Помилка при створенні завдання без авторизації."""

        data = {"title": "Нове завдання"}

        response = self.client.post(self.tasks_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_task_missing_title(self):
        """Помилка при відсутності назви завдання."""

        response = self.client1.post(
            self.tasks_url, {"is_completed": False}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_own_tasks(self):
        """Отримання власних завдань."""

        Task.objects.create(title="Завдання 1", owner=self.user1)
        Task.objects.create(title="Завдання 2", owner=self.user1)
        Task.objects.create(title="Завдання 3", owner=self.user2)

        response = self.client1.get(self.tasks_url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_shared_tasks(self):
        """Отримання спільних завдань."""

        Task.objects.create(title="Спільне завдання", owner=self.user1)

        SharedAccess.objects.create(owner=self.user1, shared_with=self.user2)

        response = self.client2.get(self.tasks_url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Спільне завдання")

    def test_update_own_task(self):
        """Успішне оновлення власного завдання."""

        task = Task.objects.create(title="Завдання", owner=self.user1)

        response = self.client1.patch(
            f"{self.tasks_url}{task.id}/",
            {"title": "Оновлене завдання", "is_completed": True},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Оновлене завдання")
        self.assertTrue(response.data["is_completed"])

    def test_update_shared_task(self):
        """Успішне оновлення спільного завдання."""

        task = Task.objects.create(title="Завдання", owner=self.user1)

        SharedAccess.objects.create(owner=self.user1, shared_with=self.user2)

        response = self.client2.patch(
            f"{self.tasks_url}{task.id}/", {"is_completed": True}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_own_task(self):
        """Успішне видалення власного завдання."""

        task = Task.objects.create(title="Завдання", owner=self.user1)

        response = self.client1.delete(f"{self.tasks_url}{task.id}/")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Task.objects.count(), 0)

    def test_get_nonexistent_task(self):
        """Помилка при отриманні неіснуючого завдання."""

        response = self.client1.get(
            f"{self.tasks_url}00000000-0000-0000-0000-000000000000/"
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_task_is_overdue_property(self):
        """Тест властивості is_overdue."""

        past_time = timezone.now() - timedelta(days=1)
        future_time = timezone.now() + timedelta(days=1)

        task_overdue = Task.objects.create(
            title="Прострочене", owner=self.user1, due_at=past_time, is_completed=False
        )
        self.assertTrue(task_overdue.is_overdue)

        task_completed = Task.objects.create(
            title="Виконане", owner=self.user1, due_at=past_time, is_completed=True
        )
        self.assertFalse(task_completed.is_overdue)

        task_future = Task.objects.create(
            title="Майбутнє", owner=self.user1, due_at=future_time, is_completed=False
        )
        self.assertFalse(task_future.is_overdue)

    def test_create_task_depth_limit_exceeded(self):
        """Тест обмеження глибини вкладеності завдань."""

        root_task = Task.objects.create(title="Root Task", owner=self.user1)

        child_task = Task.objects.create(
            title="Child Task", owner=self.user1, parent_task=root_task
        )

        grandchild_task = Task.objects.create(
            title="Grandchild Task", owner=self.user1, parent_task=child_task
        )

        response = self.client1.post(
            self.tasks_url,
            {
                "title": "Great Grandchild Task",
                "owner": self.user1.id,
                "parent_task": grandchild_task.id,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_task_depth_limit_not_exceeded(self):

        root_task = Task.objects.create(title="Root Task", owner=self.user1)

        child_task = Task.objects.create(
            title="Child Task", owner=self.user1, parent_task=root_task
        )

        response = self.client1.post(
            self.tasks_url,
            {
                "title": "Grandchild Task",
                "owner": self.user1.id,
                "parent_task": child_task.id,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_task_depth_limit_exceeded(self):
        """Тест обмеження глибини вкладеності при оновленні завдання."""

        root_task = Task.objects.create(title="Root Task", owner=self.user1)

        child_task = Task.objects.create(
            title="Child Task", owner=self.user1, parent_task=root_task
        )

        grandchild_task = Task.objects.create(
            title="Grandchild Task", owner=self.user1, parent_task=child_task
        )

        response = self.client1.patch(
            f"{self.tasks_url}{grandchild_task.id}/",
            {"parent_task": grandchild_task.id},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_task_depth_limit_not_exceeded(self):

        root_task = Task.objects.create(title="Root Task", owner=self.user1)

        child_task = Task.objects.create(
            title="Child Task", owner=self.user1, parent_task=root_task
        )

        response = self.client1.patch(
            f"{self.tasks_url}{child_task.id}/",
            {"parent_task": root_task.id},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
