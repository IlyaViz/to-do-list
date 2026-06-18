from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):
    """Розширення користувача (якщо потрібно)."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Профіль {self.user.username}"
