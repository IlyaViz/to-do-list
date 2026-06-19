from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from .models import Task, Invitation
from .serializers import TaskSerializer, InvitationSerializer
from .services import create_invitation, accept_invitation


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

    def perform_create(self, serializer):
        """Встановлює власника завдання при створенні."""

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
