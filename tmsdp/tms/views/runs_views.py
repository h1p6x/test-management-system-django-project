from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..database.models import *
from ..utils.serializers import *


class RunsAPIList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestRunsSerializer

    def get(self, request, tp_id):
        if TestProject.objects.filter(pk=tp_id).exists():
            queryset = TestRun.objects.filter(testProject=tp_id).order_by("-name")
            serializer_for_queryset = TestRunsSerializer(
                instance=queryset,
                many=True
            )
            return Response(serializer_for_queryset.data)
        else:
            return Response(f"Не существует проекта с id = {tp_id}", status=status.HTTP_404_NOT_FOUND)


class RunsAllAPIList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestRunAllListSerializer
    queryset = TestRun.objects.all()


class RunsAPICreate(generics.CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestRunsCreateSerializer
    queryset = TestRun.objects.all()

    def post(self, request, tp_id):
        if TestProject.objects.filter(pk=tp_id).exists():
            data_ready_for_json = list(TestProject.objects.filter(pk=tp_id).values('id'))
            for key in request.data['testcases']:
                if not TestCase.objects.filter(pk=key, testSuit__project__id=tp_id).exists():
                    return Response(f"Не существует тест кейса с id = {key} для тестового проекта с tp_id = {tp_id}",
                                    status=status.HTTP_404_NOT_FOUND)
            request.data['testProject'] = tp_id
            serializer = TestRunsCreateSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(f"Не существует тестового проекта с id = {tp_id}", status=status.HTTP_404_NOT_FOUND)


class RunsAPIDetail(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestRunsSerializer
    queryset = TestRun.objects.all()

    def get(self, request, tp_id, tr_id, **kwargs):
        if not TestProject.objects.filter(pk=tp_id).exists() or not TestRun.objects.filter(pk=tr_id).exists():
            return Response(f"Не существует проекта с tp_id = {tp_id} или тестового запуска с tr_id = {tr_id}",
                            status=status.HTTP_404_NOT_FOUND)
        queryset = TestRun.objects.filter(testProject=tp_id, pk=tr_id)
        if queryset.exists():
            serializer_for_queryset = TestRunsSerializer(instance=queryset, many=True)
            return Response(serializer_for_queryset.data)
        else:
            return Response(f"Не существует тестового запуска tr_id = {tr_id} в рамках проекта tp_id = {tp_id}",
                            status=status.HTTP_404_NOT_FOUND)
