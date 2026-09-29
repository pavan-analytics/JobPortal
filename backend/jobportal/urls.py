from django.urls import path

from .views import (
    JobListAPIView,
    RegisterAPIView,
    MyJobsAPIView,
    JobDetailAPIView,
    ProfileAPIView,
    ApplicationAPIView,
    RecruiterApplicationsAPIView,
    ApplicationDetailAPIView,
    CurrentUserAPIView,
)

urlpatterns = [

    path(
        "register/",
        RegisterAPIView.as_view()
    ),

    path(
        "jobs/",
        JobListAPIView.as_view()
    ),

    path(
        "my-jobs/",
        MyJobsAPIView.as_view()
    ),

    path(
        "jobs/<int:job_id>/",
        JobDetailAPIView.as_view()
    ),

    path(
        "profile/",
        ProfileAPIView.as_view()
    ),

    path(
        "applications/",
        ApplicationAPIView.as_view()
    ),

    path(
        "applications/<int:application_id>/",
        ApplicationDetailAPIView.as_view()
    ),

    path(
        "recruiter-applications/",
        RecruiterApplicationsAPIView.as_view()
    ),

    path(
        "me/",
        CurrentUserAPIView.as_view()
    ),

]