from django.core.mail import send_mail
from smtplib import SMTPException
from .models import SharedAccess, Invitation


def create_invitation(sender, recipient_email: str) -> Invitation:
    invitation = Invitation.objects.create(
        sender=sender, recipient_email=recipient_email
    )

    try:
        invite_link = f"http://localhost:5173/accept-invite?token={invitation.token}"

        send_mail(
            "Запрошення до системи управління завданнями",
            f"Перейдіть по посиланню для прийняття запрошення:\n{invite_link}",
            "noreply@todolist.local",
            [recipient_email],
            fail_silently=True,
        )
    except SMTPException as e:
        raise Exception(f"error sending email: {str(e)}")

    return invitation


def accept_invitation(user, token) -> Invitation:
    invitation = Invitation.objects.get(token=token)

    if invitation.is_accepted:
        raise Exception("invitation already accepted")

    if user.email != invitation.recipient_email:
        raise Exception("email mismatch: this invitation is for another email")

    SharedAccess.objects.get_or_create(owner=invitation.sender, shared_with=user)

    invitation.is_accepted = True
    invitation.save()

    return invitation
