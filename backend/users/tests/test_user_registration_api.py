from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status


class UserRegistrationAPITests(APITestCase):
    """Тести для реєстрації користувачів."""

    def setUp(self):
        self.client = APIClient()
        self.register_url = "/api/auth/register/"

    def test_register_user_success(self):
        """Успішна реєстрація користувача."""

        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
            "password_confirm": "testpass123",
        }

        response = self.client.post(self.register_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["username"], "testuser")
        self.assertEqual(User.objects.count(), 1)

    def test_register_user_with_existing_email(self):
        """Помилка при спробі зареєструвати користувача з існуючим email."""

        data = {
            "username": "testuser1",
            "email": "test@example.com",
            "password": "testpass123",
            "password_confirm": "testpass123",
        }

        self.client.post(self.register_url, data, format="json")

        data = {
            "username": "testuser2",
            "email": "test@example.com",
            "password": "testpass123",
            "password_confirm": "testpass123",
        }

        response = self.client.post(self.register_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_password_mismatch(self):
        """Помилка при невідповідності паролів."""

        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
            "password_confirm": "wrongpass123",
        }

        response = self.client.post(self.register_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_register_user_duplicate_username(self):
        """Помилка при дублюванні імені користувача."""

        User.objects.create_user(
            username="testuser", email="test1@example.com", password="pass123"
        )

        data = {
            "username": "testuser",
            "email": "test2@example.com",
            "password": "testpass123",
            "password_confirm": "testpass123",
        }

        response = self.client.post(self.register_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_missing_email(self):
        """Помилка при відсутності email."""

        data = {
            "username": "testuser",
            "password": "testpass123",
            "password_confirm": "testpass123",
        }

        response = self.client.post(self.register_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_short_password(self):
        """Помилка при коротких паролях."""

        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "short",
            "password_confirm": "short",
        }

        response = self.client.post(self.register_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
