from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, BasePermission

from .models import Job, CandidateProfile, Application
from .serializers import JobSerializer, RegisterSerializer, CandidateProfileSerializer,ApplicationSerializer

class IsRecruiter(BasePermission):

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "recruiter"
        )

class RegisterAPIView(APIView):

    def post(self, request):
        serializer = RegisterSerializer(
            data=request.data
        )

        if serializer.is_valid():
            user = serializer.save()

            return Response(
                {
                    "message": "User registered successfully",
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "role": user.role,
                    }
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class JobListAPIView(APIView):

    def get(self, request):
        jobs = Job.objects.all()

        serializer = JobSerializer(
            jobs,
            many=True
        )

        return Response(serializer.data)

    def post(self, request):
        if request.user.role != "recruiter":
            return Response(
                {
                    "detail": "Only recruiters can create jobs."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = JobSerializer(
            data=request.data
        )

        if serializer.is_valid():
            job = serializer.save(
                recruiter=request.user
            )

            return Response(
                JobSerializer(job).data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class MyJobsAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "recruiter":
            return Response(
                {
                    "detail": "Only recruiters can access their jobs."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        jobs = Job.objects.filter(
            recruiter=request.user
        ).order_by("-created_at")

        serializer = JobSerializer(
            jobs,
            many=True
        )

        return Response(serializer.data)

class JobDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get_job(self, job_id, user=None):
        try:
            if user is None:
                return Job.objects.get(
                    id=job_id
                )

            return Job.objects.get(
                id=job_id,
                recruiter=user
            )

        except Job.DoesNotExist:
            return None

    def get(self, request, job_id):
        job = self.get_job(job_id)

        if not job:
            return Response(
                {
                    "detail": "Job not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = JobSerializer(job)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def put(self, request, job_id):
        if request.user.role != "recruiter":
            return Response(
                {
                    "detail": "Only recruiters can edit jobs."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        job = self.get_job(
            job_id,
            request.user
        )

        if not job:
            return Response(
                {
                    "detail": "Job not found or you do not own this job."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = JobSerializer(
            job,
            data=request.data
        )

        if serializer.is_valid():
            updated_job = serializer.save()

            return Response(
                JobSerializer(updated_job).data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, job_id):
        if request.user.role != "recruiter":
            return Response(
                {
                    "detail": "Only recruiters can delete jobs."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        job = self.get_job(
            job_id,
            request.user
        )

        if not job:
            return Response(
                {
                    "detail": "Job not found or you do not own this job."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        job.delete()

        return Response(
            {
                "message": "Job deleted successfully."
            },
            status=status.HTTP_200_OK
        )

class ProfileAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "candidate":
            return Response(
                {
                    "detail": "Only candidates can access their profile."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        profile, created = CandidateProfile.objects.get_or_create(
            user=request.user
        )

        serializer = CandidateProfileSerializer(profile)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def put(self, request):
        if request.user.role != "candidate":
            return Response(
                {
                    "detail": "Only candidates can update their profile."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        profile, created = CandidateProfile.objects.get_or_create(
            user=request.user
        )

        serializer = CandidateProfileSerializer(
            profile,
            data=request.data
        )

        if serializer.is_valid():
            updated_profile = serializer.save()

            return Response(
                CandidateProfileSerializer(
                    updated_profile
                ).data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class ApplicationAPIView(APIView):

    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role != "candidate":
            return Response(
                {
                    "detail": "Only candidates can view their applications."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        applications = Application.objects.filter(
            candidate=request.user
        ).order_by("-applied_at")

        serializer = ApplicationSerializer(
            applications,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )      

    def post(self, request):
        if request.user.role != "candidate":
            return Response(
                {
                    "detail": "Only candidates can apply for jobs."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        job_id = request.data.get("job")

        if not job_id:
            return Response(
                {
                    "detail": "Job ID is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            job = Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            return Response(
                {
                    "detail": "Job not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if Application.objects.filter(
            candidate=request.user,
            job=job
        ).exists():
            return Response(
                {
                    "detail": "You have already applied for this job."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        application = Application.objects.create(
            candidate=request.user,
            job=job
        )

        serializer = ApplicationSerializer(
            application
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

class RecruiterApplicationsAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "recruiter":
            return Response(
                {
                    "detail": "Only recruiters can view applicants."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        applications = Application.objects.filter(
            job__recruiter=request.user
        ).order_by("-applied_at")

        serializer = ApplicationSerializer(
            applications,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

class ApplicationDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def put(self, request, application_id):

        if request.user.role != "recruiter":
            return Response(
                {
                    "detail": "Only recruiters can update application status."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            application = Application.objects.get(
                id=application_id,
                job__recruiter=request.user
            )
        except Application.DoesNotExist:
            return Response(
                {
                    "detail": "Application not found or you do not own this job."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        new_status = request.data.get("status")

        valid_statuses = [
            "Applied",
            "Under Review",
            "Shortlisted",
            "Rejected",
            "Selected",
        ]

        if new_status not in valid_statuses:
            return Response(
                {
                    "detail": "Invalid application status."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        application.status = new_status
        application.save()

        serializer = ApplicationSerializer(
            application
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

class CurrentUserAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "id": request.user.id,
                "email": request.user.email,
                "role": request.user.role,
            },
            status=status.HTTP_200_OK
        )