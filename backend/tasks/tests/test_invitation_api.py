from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from ..models import SharedAccess, Invitation


class InvitationAPITests(APITestCase):
    """Тести для API запрошень."""

    def setUp(self):
        self.client = APIClient()

        self.user1 = User.objects.create_user(
            username="user1", email="user1@example.com", password="pass123"
        )
        self.user2 = User.objects.create_user(
            username="user2", email="user2@example.com", password="pass123"
        )

        token_response1 = self.client.post(
            "/api/auth/token/", {"username": "user1", "password": "pass123"}
        )
        token_response2 = self.client.post(
            "/api/auth/token/", {"username": "user2", "password": "pass123"}
        )

        self.token1 = token_response1.data["access"]
        self.token2 = token_response2.data["access"]

    def test_create_invitation_success(self):
        """Успішне створення запрошення."""

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token1}")

        data = {"recipient_email": "user2@example.com"}

        response = self.client.post("/api/invites/", data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["recipient_email"], "user2@example.com")
        self.assertFalse(response.data["is_accepted"])
        self.assertEqual(Invitation.objects.count(), 1)

    def test_create_invitation_without_email(self):
        """Помилка при відсутності email."""

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token1}")

        data = {}

        response = self.client.post("/api/invites/", data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_invitation_without_auth(self):
        """Помилка при створенні запрошення без авторизації."""

        data = {"recipient_email": "user2@example.com"}

        response = self.client.post("/api/invites/", data, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_accept_invitation_success(self):
        """Успішне прийняття запрошення."""

        invitation = Invitation.objects.create(
            recipient_email="user2@example.com", sender=self.user1
        )

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token2}")

        response = self.client.post(f"/api/invites/accept/{invitation.token}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        invitation.refresh_from_db()

        self.assertTrue(invitation.is_accepted)
        self.assertEqual(SharedAccess.objects.count(), 1)

    def test_accept_invitation_email_mismatch(self):
        """Помилка при невідповідності email."""

        User.objects.create_user(
            username="user3", email="user3@example.com", password="pass123"
        )

        token_response = self.client.post(
            "/api/auth/token/", {"username": "user3", "password": "pass123"}
        )
        token3 = token_response.data["access"]

        invitation = Invitation.objects.create(
            recipient_email="user2@example.com", sender=self.user1
        )

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token3}")

        response = self.client.post(f"/api/invites/accept/{invitation.token}/")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_accept_invitation_twice(self):
        """Помилка при двократному прийнятті запрошення."""

        invitation = Invitation.objects.create(
            recipient_email="user2@example.com", sender=self.user1, is_accepted=True
        )

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token2}")

        response = self.client.post(f"/api/invites/accept/{invitation.token}/")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_accept_nonexistent_invitation(self):
        """Помилка при прийнятті неіснуючого запрошення."""

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token2}")

        response = self.client.post(
            "/api/invites/accept/00000000-0000-0000-0000-000000000000/"
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_accept_invitation_without_auth(self):
        """Помилка при прийнятті запрошення без авторизації."""

        invitation = Invitation.objects.create(
            recipient_email="user2@example.com", sender=self.user1
        )

        response = self.client.post(f"/api/invites/accept/{invitation.token}/")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
