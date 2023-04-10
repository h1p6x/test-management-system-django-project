from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..database.models import *
from ..utils.serializers import *


class ProjectsAPIList(generics.ListAPIView):
    queryset = TestProject.objects.all()
    serializer_class = TestProjectListSerializer
    permission_classes = (IsAuthenticated,)


class ProjectsAPICreate(generics.CreateAPIView):
    queryset = TestProject.objects.all()
    serializer_class = TestProjectCreateSerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        post_new = TestProject.objects.create(
            name=request.data['name'],
            status=ProjectStatus.objects.get(name='Open'),
            user=request.user
        )
        serializer = TestProjectListSerializer(post_new, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ProjectAPIClose(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestProjectUpdateSerializer

    def put(self, request, tp_id):
        if TestProject.objects.filter(pk=tp_id).exists():
            queryset = TestProject.objects.filter(pk=tp_id)
            queryset.update(status=ProjectStatus.objects.get(name='Closed'))
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(f"Не существует проекта с id = {tp_id}", status=status.HTTP_404_NOT_FOUND)
