from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile


class UserSerializer(serializers.ModelSerializer):
    """Серіалізатор для користувача."""

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]
        read_only_fields = ["id"]


class RegisterSerializer(serializers.ModelSerializer):
    """Серіалізатор для реєстрації."""

    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "password_confirm"]

    def validate(self, data):
        """Перевіряє, що паролі збігаються."""
        if data.get("password") != data.get("password_confirm"):
            raise serializers.ValidationError({"password": "Паролі не збігаються"})

        return data


class UserProfileSerializer(serializers.ModelSerializer):
    """Серіалізатор для профілю користувача."""

    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ["user", "created_at"]
        read_only_fields = ["created_at"]
