from rest_framework import serializers
from .models import Task, Invitation


class TaskSerializer(serializers.ModelSerializer):
    """Серіалізатор для завдання."""

    is_overdue = serializers.ReadOnlyField()
    owner = serializers.StringRelatedField(read_only=True)
    owner_id = serializers.ReadOnlyField(source="owner.id")

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "is_completed",
            "due_at",
            "created_at",
            "owner",
            "owner_id",
            "is_overdue",
        ]
        read_only_fields = ["id", "created_at", "owner", "is_overdue"]


class InvitationSerializer(serializers.ModelSerializer):
    """Серіалізатор для запрошення."""

    sender_username = serializers.CharField(source="sender.username", read_only=True)

    class Meta:
        model = Invitation
        fields = [
            "token",
            "recipient_email",
            "is_accepted",
            "created_at",
            "sender_username",
        ]
        read_only_fields = ["token", "created_at", "is_accepted", "sender_username"]
