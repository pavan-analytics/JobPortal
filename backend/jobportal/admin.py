from django.contrib import admin
from .models import (
    User,
    CandidateProfile,
    Job,
    Application,
)


admin.site.register(User)
admin.site.register(CandidateProfile)
admin.site.register(Job)
admin.site.register(Application)