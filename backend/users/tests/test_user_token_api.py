from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status


class UserTokenAPITests(APITestCase):
    """Тести для отримання JWT токенів."""

    def setUp(self):
        self.token_url = "/api/auth/token/"
        self.refresh_url = "/api/auth/token/refresh/"
        self.logout_url = "/api/auth/token/logout/"
        self.me_url = "/api/auth/me/"

        self.client = APIClient()

        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )

    def test_get_token_success(self):
        """Успішне отримання токену."""

        data = {"username": "testuser", "password": "testpass123"}

        response = self.client.post(self.token_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.cookies)

    def test_get_token_invalid_credentials(self):
        """Помилка при невірних облікових даних."""

        data = {"username": "testuser", "password": "wrongpass"}

        response = self.client.post(self.token_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_success(self):
        """Успішне отримання інформації про користувача."""

        data = {"username": "testuser", "password": "testpass123"}

        token_response = self.client.post(self.token_url, data, format="json")
        access_token = token_response.data["access"]

        me_response = self.client.get(
            self.me_url, HTTP_AUTHORIZATION=f"Bearer {access_token}"
        )

        self.assertEqual(me_response.status_code, status.HTTP_200_OK)
        self.assertEqual(me_response.data["username"], "testuser")

    def test_me_unauthorized(self):
        """Помилка при відсутності токену."""

        response = self.client.get(self.me_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_token_nonexistent_user(self):
        """Помилка при несуществуючому користувачу."""

        data = {"username": "nonexistent", "password": "testpass123"}

        response = self.client.post(self.token_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_success(self):
        """Успішне оновлення токену."""

        data = {"username": "testuser", "password": "testpass123"}

        token_response = self.client.post(self.token_url, data, format="json")

        token = token_response.data["access"]
        refresh_token = self.client.cookies.get("refresh").value

        token_response = self.client.post(self.refresh_url)

        new_token = token_response.data["access"]
        new_refresh_token = self.client.cookies.get("refresh").value

        self.assertNotEqual(token, new_token)
        self.assertNotEqual(refresh_token, new_refresh_token)

    def test_refresh_missing_cookie(self):
        """Помилка при відсутності cookie з refresh токеном."""

        response = self.client.post(self.refresh_url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logout_success(self):
        """Успішний вихід з системи."""

        data = {"username": "testuser", "password": "testpass123"}

        self.client.post(self.token_url, data, format="json")

        refresh_token = self.client.cookies.get("refresh").value

        response = self.client.post(self.logout_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(refresh_token, "")
        self.assertEqual(self.client.cookies.get("refresh").value, "")
