from django.http import JsonResponse


def server_error(request):
    return JsonResponse(
        {
            "error": "Internal server error.",
            "message": "Something went wrong on the server."
        },
        status=500
    )