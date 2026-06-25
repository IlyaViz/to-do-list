from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework import generics
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

        try:
            user = create_user(
                username=data["username"],
                email=data.get("email", ""),
                password=data["password"],
            )

            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class TokenObtainCookieView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = TokenObtainPairSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        tokens = serializer.validated_data

        access = tokens.get("access")
        refresh = tokens.get("refresh")

        response = Response({"access": access}, status=status.HTTP_200_OK)

        response.set_cookie("refresh", refresh, httponly=True, samesite="Lax")

        return response


class TokenRefreshCookieView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh = request.COOKIES.get("refresh")

        serializer = TokenRefreshSerializer(data={"refresh": refresh})

        serializer.is_valid(raise_exception=True)

        access = serializer.validated_data.get("access")
        new_refresh = serializer.validated_data.get("refresh")

        response = Response({"access": access}, status=status.HTTP_200_OK)

        response.set_cookie("refresh", new_refresh, httponly=True, samesite="Lax")

        return response


class TokenLogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        response = Response({"detail": "logged out"}, status=status.HTTP_200_OK)

        response.delete_cookie("refresh")

        return response


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserProfileViewSet(viewsets.ReadOnlyModelViewSet):
    """Набір представлень для профіля користувача."""

    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def get_queryset(self):
        """Повертає профіль тільки поточного користувача."""

        return UserProfile.objects.filter(user=self.request.user)
