from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from .models import Task, Invitation, SharedAccess
from .serializers import TaskSerializer, InvitationSerializer
from .services import create_invitation, accept_invitation, validate_task_depth


class TaskViewSet(viewsets.ModelViewSet):
    """Набір представлень для завдань."""

    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_queryset(self):
        """Повертає завдання користувача та спільні завдання."""

        user = self.request.user

        return (
            Task.objects.filter(
                Q(owner=user) | Q(owner__shared_lists__shared_with=user)
            )
            .distinct()
            .order_by("is_completed", "due_at", "-created_at")
        )

    def create(self, request, *args, **kwargs):
        """Створює нове завдання."""

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        parent_task = serializer.validated_data.get("parent_task")

        try:
            validate_task_depth(parent_task)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)

        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def update(self, request, *args, **kwargs):
        """Оновлює існуюче завдання."""

        partial = kwargs.pop("partial", False)

        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=partial)

        serializer.is_valid(raise_exception=True)

        if "parent_task" in serializer.validated_data:
            parent_task = serializer.validated_data.get("parent_task")

            try:
                validate_task_depth(parent_task, current_task_id=instance.id)
            except Exception as e:
                return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        self.perform_update(serializer)

        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class CreateInvitationView(APIView):
    """Представлення для створення запрошення."""

    def post(self, request):
        """Створює запрошення для завдання."""

        serializer = InvitationSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        receipient_email = serializer.validated_data["recipient_email"]

        try:
            invitation = create_invitation(
                sender=request.user, recipient_email=receipient_email
            )

            return Response(
                InvitationSerializer(invitation).data, status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AcceptInvitationView(APIView):
    """Представлення для прийняття запрошення."""

    def post(self, request, token):
        """Приймає запрошення та створює спільний доступ."""

        try:
            accept_invitation(user=request.user, token=token)

            return Response(
                {"detail": "invitation accepted"}, status=status.HTTP_200_OK
            )
        except Invitation.DoesNotExist:
            raise NotFound("invitation not found")
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DeleteSharedAccessDestroyAPIView(APIView):
    """Представлення для видалення спільного доступу."""

    def delete(self, request, owner_id):
        """Видаляє спільний доступ."""

        shared_access = get_object_or_404(
            SharedAccess, owner_id=owner_id, shared_with=request.user
        )

        shared_access.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
