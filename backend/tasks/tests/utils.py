from django.contrib.auth.models import User
from rest_framework.test import APIClient


def setup_two_users(token_url):
    user1 = User.objects.create_user(
        username="user1", email="user1@example.com", password="pass123"
    )
    user2 = User.objects.create_user(
        username="user2", email="user2@example.com", password="pass123"
    )

    client1 = APIClient()
    client2 = APIClient()

    token_response1 = client1.post(
        token_url, {"username": "user1", "password": "pass123"}
    )
    token_response2 = client2.post(
        token_url, {"username": "user2", "password": "pass123"}
    )

    token1 = token_response1.data["access"]
    token2 = token_response2.data["access"]

    client1.credentials(HTTP_AUTHORIZATION=f"Bearer {token1}")
    client2.credentials(HTTP_AUTHORIZATION=f"Bearer {token2}")

    return client1, client2, user1, user2
