from rest_framework import serializers

from .models import User, Job, CandidateProfile, Application


class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            "email",
            "password",
            "role",
        ]

        extra_kwargs = {
            "password": {
                "write_only": True
            }
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )

        return value

    def create(self, validated_data):
        email = validated_data["email"]
        password = validated_data["password"]
        role = validated_data["role"]

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            role=role,
        )

        return user


class JobSerializer(serializers.ModelSerializer):

    class Meta:
        model = Job
        fields = [
            "id",
            "recruiter",
            "title",
            "company",
            "location",
            "salary",
            "type",
            "experience",
            "skills",
            "description",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "recruiter",
            "created_at",
        ]

class CandidateProfileSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(
        source="user.email",
        read_only=True
    )

    class Meta:
        model = CandidateProfile

        fields = [
            "id",
            "email",
            "phone",
            "skills",
            "experience",
            "location",
        ]

        read_only_fields = [
            "id",
            "email",
        ]

class ApplicationSerializer(serializers.ModelSerializer):

    job_title = serializers.CharField(
        source="job.title",
        read_only=True
    )

    company = serializers.CharField(
        source="job.company",
        read_only=True
    )

    candidate_email = serializers.CharField(
        source="candidate.email",
        read_only=True
    )

    class Meta:
        model = Application

        fields = [
            "id",
            "job",
            "job_title",
            "company",
            "candidate_email",
            "status",
            "applied_at",
        ]

        read_only_fields = [
            "id",
            "candidate_email",
            "job_title",
            "company",
            "status",
            "applied_at",
        ]