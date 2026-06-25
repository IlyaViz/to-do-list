from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TaskViewSet,
    CreateInvitationView,
    AcceptInvitationView,
    DeleteSharedAccessDestroyAPIView,
)

router = DefaultRouter()
router.include_format_suffixes = False
router.register(r"tasks", TaskViewSet, basename="task")

urlpatterns = [
    path("", include(router.urls)),
    path("invites/", CreateInvitationView.as_view(), name="create-invitation"),
    path(
        "invites/accept/<uuid:token>/",
        AcceptInvitationView.as_view(),
        name="accept-invitation",
    ),
    path(
        "shared-access/<int:owner_id>/",
        DeleteSharedAccessDestroyAPIView.as_view(),
        name="delete-shared-access",
    ),
]
