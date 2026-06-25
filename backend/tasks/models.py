import uuid
from django.contrib.auth.models import User
from django.db import models


class Task(models.Model):
    """Завдання користувача."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, null=False, blank=False)
    is_completed = models.BooleanField(default=False)
    due_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tasks")
    parent_task = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="subtasks"
    )

    class Meta:
        ordering = ["is_completed", "due_at", "-created_at"]

    def __str__(self):
        return self.title

    @property
    def is_overdue(self):
        """Повертає True якщо дедлайн в минулому та завдання не виконане."""
        if self.due_at is None or self.is_completed:
            return False
        from django.utils import timezone

        return self.due_at < timezone.now()


class SharedAccess(models.Model):
    """Доступ до завдань іншого користувача."""

    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="shared_lists"
    )
    shared_with = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="received_lists"
    )

    class Meta:
        unique_together = ("owner", "shared_with")

    def __str__(self):
        return f"{self.owner.username} -> {self.shared_with.username}"


class Invitation(models.Model):
    """Запрошення для ділення завдань."""

    token = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient_email = models.EmailField(null=False, blank=False)
    is_accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sent_invitations"
    )

    def __str__(self):
        return f"Запрошення для {self.recipient_email} від {self.sender.username}"
