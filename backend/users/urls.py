from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterUserView,
    UserProfileViewSet,
    TokenObtainCookieView,
    TokenRefreshCookieView,
    TokenLogoutView,
    MeView,
)

router = DefaultRouter()
router.include_format_suffixes = False
router.register(r"profiles", UserProfileViewSet, basename="user-profile")

urlpatterns = [
    path("register/", RegisterUserView.as_view(), name="register"),
    path("token/", TokenObtainCookieView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshCookieView.as_view(), name="token_refresh"),
    path("token/logout/", TokenLogoutView.as_view(), name="token_logout"),
    path("me/", MeView.as_view(), name="me"),
] + router.urls
