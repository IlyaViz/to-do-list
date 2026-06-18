from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status


class UserTokenAPITests(APITestCase):
    """Тести для отримання JWT токенів."""

    def setUp(self):
        self.client = APIClient()
        self.token_url = "/api/auth/token/"
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )

    def test_get_token_success(self):
        """Успішне отримання токену."""

        data = {"username": "testuser", "password": "testpass123"}

        response = self.client.post(self.token_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_get_token_invalid_credentials(self):
        """Помилка при невірних облікових даних."""

        data = {"username": "testuser", "password": "wrongpass"}

        response = self.client.post(self.token_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_token_nonexistent_user(self):
        """Помилка при несуществуючому користувачу."""

        data = {"username": "nonexistent", "password": "testpass123"}

        response = self.client.post(self.token_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
