from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..database.models import *
from ..utils.serializers import *


class SuitAPIList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestSuitListSerializer

    def get(self, request, tp_id):
        tp_id_exists = TestProject.objects.filter(pk=tp_id).exists()
        if tp_id_exists:
            queryset = TestSuit.objects.filter(project=tp_id)
            serializer_for_queryset = TestSuitListSerializer(instance=queryset, many=True)
            return Response(serializer_for_queryset.data)
        else:
            return Response(f"Не существует проекта с id = {tp_id}", status=status.HTTP_404_NOT_FOUND)


class SuitAllAPIList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestSuitAllListSerializer
    queryset = TestSuit.objects.all()


class SuitAPICreate(generics.CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestSuitCreateSerializer

    def post(self, request, tp_id):
        if TestProject.objects.filter(pk=tp_id).exists():
            post_new = TestSuit.objects.create(
                name=request.data['name'],
                description=request.data['description'],
                project_id=tp_id
            )
            return Response(TestSuitListSerializer(post_new).data, status=status.HTTP_201_CREATED)
        else:
            return Response(f"Не существует проекта с id = {tp_id}", status=status.HTTP_400_BAD_REQUEST)

