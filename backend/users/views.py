from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from .models import UserProfile
from .serializers import UserSerializer, RegisterSerializer, UserProfileSerializer
from .services import create_user


class RegisterUserView(APIView):
    """Представлення для реєстрації нового користувача."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        user = create_user(
            username=data["username"],
            email=data.get("email", ""),
            password=data["password"],
        )

        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairView(TokenObtainPairView):
    """Видання для отримання JWT токенів."""

    permission_classes = [AllowAny]


class UserProfileViewSet(viewsets.ReadOnlyModelViewSet):
    """Набір представлень для профіля користувача."""

    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Повертає профіль тільки поточного користувача."""
        return UserProfile.objects.filter(user=self.request.user)
