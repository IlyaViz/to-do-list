from django.core.mail import send_mail
from django.conf import settings
from smtplib import SMTPException
from .models import SharedAccess, Invitation, Task


# def create_task(validated_data, owner):
#     parent_task = validated_data.get("parent_task")

#     if parent_task:
#         depth = 1
#         current = parent_task

#         while current:
#             depth += 1
#             current = current.parent_task

#             if depth > 3:
#                 raise Exception(
#                     "maximum task depth exceeded: tasks can only be nested up to 2 levels"
#                 )

#     return Task.objects.create(**validated_data, owner=owner)


def validate_task_depth(parent_task, current_task_id=None):
    if not parent_task:
        return

    if current_task_id and parent_task.id == current_task_id:
        raise Exception("task cannot be its own parent")

    depth = 1
    current = parent_task

    while current:
        depth += 1
        current = current.parent_task

        if current_task_id and current and current.id == current_task_id:
            raise Exception("circular dependency detected")

        if depth > 3:
            raise Exception(
                "maximum task depth exceeded: tasks can only be nested up to 2 levels"
            )


def create_invitation(sender, recipient_email: str) -> Invitation:
    invitation = Invitation.objects.create(
        sender=sender, recipient_email=recipient_email
    )

    try:
        invite_link = (
            f"{settings.FRONTEND_ORIGIN}/accept-invite?token={invitation.token}"
        )

        send_mail(
            "Запрошення до системи управління завданнями",
            f"Перейдіть по посиланню для прийняття запрошення:\n{invite_link}",
            settings.EMAIL_HOST_USER,
            [recipient_email],
            fail_silently=False,
        )
    except SMTPException as e:
        raise Exception(f"error sending email: {str(e)}")

    return invitation


def accept_invitation(user, token) -> Invitation:
    invitation = Invitation.objects.get(token=token)

    if invitation.is_accepted:
        raise Exception("invitation already accepted")

    if user.email.strip().lower() != invitation.recipient_email.strip().lower():
        raise Exception("email mismatch: this invitation is for another email")

    SharedAccess.objects.get_or_create(owner=invitation.sender, shared_with=user)

    invitation.is_accepted = True
    invitation.save()

    return invitation
