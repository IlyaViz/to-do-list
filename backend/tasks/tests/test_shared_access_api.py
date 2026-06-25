from rest_framework.test import APITestCase
from rest_framework import status
from .utils import setup_two_users
from ..models import SharedAccess


class SharedAccessAPITests(APITestCase):
    """Тести для API спільного доступу."""

    def setUp(self):
        self.token_url = "/api/auth/token/"

        self.client1, self.client2, self.user1, self.user2 = setup_two_users(
            self.token_url
        )

    def test_participant_delete_shared_access_success(self):
        """Успішне видалення спільного доступу учасником."""

        SharedAccess.objects.create(owner=self.user1, shared_with=self.user2)

        response = self.client2.delete(f"/api/shared-access/{self.user1.id}/")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(SharedAccess.objects.count(), 0)

    def test_delete_shared_access_without_auth(self):
        """Помилка при видаленні спільного доступу без авторизації."""

        SharedAccess.objects.create(owner=self.user1, shared_with=self.user2)

        response = self.client.delete(f"/api/shared-access/{self.user1.id}/")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(SharedAccess.objects.count(), 1)
