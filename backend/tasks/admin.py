from django.contrib import admin
from .models import Task
from .models import SharedAccess
from .models import Invitation

# Register your models here.
admin.site.register(Task)
admin.site.register(SharedAccess)
admin.site.register(Invitation)
