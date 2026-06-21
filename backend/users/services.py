from django.contrib.auth.models import User
from django.db import transaction
from .models import UserProfile


def create_user(username: str, email: str, password: str) -> User:
    """Create a new user and its profile inside a transaction."""
    with transaction.atomic():
        if User.objects.filter(email=email).exists():
            raise Exception("email already exists")

        user = User.objects.create_user(
            username=username, email=email, password=password
        )
        UserProfile.objects.create(user=user)

    return user


def get_user_by_username(username: str):
    return User.objects.filter(username=username).first()
