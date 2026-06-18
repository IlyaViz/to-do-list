from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import RegisterUserView, CustomTokenObtainPairView, UserProfileViewSet

router = DefaultRouter()
router.include_format_suffixes = False
router.register(r"profiles", UserProfileViewSet, basename="user-profile")

urlpatterns = [
    path("register/", RegisterUserView.as_view(), name="register"),
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
] + router.urls
