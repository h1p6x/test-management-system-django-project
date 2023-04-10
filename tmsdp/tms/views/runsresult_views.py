from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..database.models import *
from ..utils.serializers import *


class RunsResultsAllAPIList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestRunsResultAllListSerializer
    queryset = TestRunResult.objects.all()

    def get(self, request, tp_id):
        queryset = TestRunResult.objects.filter(testrunTestcase__testRun_id__testProject__id=tp_id)
        serializer_for_queryset = TestRunsResultListSerializer(
            instance=queryset,
            many=True,
            context={'request': request}
        )
        return Response(serializer_for_queryset.data)


class RunsResultAPIDetailTc(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestRunsResultListSerializer

    def get(self, request, tp_id, tr_id, tc_id, **kwargs):
        tp_id_exists = TestProject.objects.filter(pk=tp_id).exists()
        tr_id_exists = TestRun.objects.filter(pk=tr_id, testProject=tp_id).exists()
        tc_id_exists = TestRunTestCase.objects.filter(testRun=tr_id, testCase=tc_id).exists()

        if not tp_id_exists or not tr_id_exists:
            return Response(f"Не существует проекта с tp_id = {tp_id} "
                            f"или тестового запуска с tr_id = {tr_id}",
                            status=status.HTTP_404_NOT_FOUND)

        if not tc_id_exists:
            return Response(f"Не существует тестового запуска tr_id = {tr_id} "
                            f"в рамках проекта tp_id = {tp_id}",
                            status=status.HTTP_404_NOT_FOUND)

        queryset = TestRunResult.objects.filter(testrunTestcase=TestRunTestCase.
                                                objects.get(testRun=tr_id, testCase=tc_id))
        serializer_for_queryset = TestRunsResultListSerializer(
            instance=queryset,
            many=True
        )
        return Response(serializer_for_queryset.data)


class RunsResultAPIDetail(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestRunsResultListSerializer
    queryset = TestRunResult.objects.all()

    def get(self, request, tp_id, tr_id, **kwargs):
        tp_id_exists = TestProject.objects.filter(pk=tp_id).exists()
        tr_id_exists = TestRun.objects.filter(pk=tr_id, testProject=tp_id).exists()

        if not tp_id_exists or not tr_id_exists:
            return Response(f"Не существует проекта с tp_id = {tp_id} "
                            f"или тестового запуска с tr_id = {tr_id}",
                            status=status.HTTP_404_NOT_FOUND)

        queryset = TestRunTestCase.objects.filter(testRun=tr_id)
        serializer_for_queryset = TestRunTestCaseSerializer(
            instance=queryset,
            many=True
        )
        return Response(serializer_for_queryset.data)


class RunsResultAPICreate(generics.CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestRunsResultCreateSerializer

    def post(self, request, tp_id, tr_id, tc_id, **kwargs):
        tp_id_exists = TestProject.objects.filter(pk=tp_id).exists()
        tr_id_exists = TestRun.objects.filter(pk=tr_id).exists()
        tc_id_exists = TestCase.objects.filter(pk=tc_id, testSuit__project__id=tp_id).exists()

        if not tp_id_exists or not tr_id_exists:
            return Response(f"Не существует проекта с tp_id = {tp_id} "
                            f"или тестового запуска с tr_id = {tr_id}",
                            status=status.HTTP_404_NOT_FOUND)

        if not tc_id_exists:
            return Response(f"Не существует тест кейса с id = {tc_id} "
                            f"для тестовго проекта с tp_id = {tp_id}",
                            status=status.HTTP_404_NOT_FOUND)

        if TestRun.objects.filter(pk=tr_id, testProject=tp_id).exists():
            test_run_result_post = TestRunResult.objects.create(
                testrunTestcase=TestRunTestCase.objects.get(testRun=tr_id, testCase=tc_id),
                status=StatusTestRun.objects.get(name=request.data['status']),
                trrDate=request.data['trrDate'],
                comment=request.data['comment'],
                user=self.request.user,
            )
            return Response(TestRunsResultCreateSerializer(test_run_result_post).data, status=status.HTTP_201_CREATED)
        else:
            return Response(f"Не существует тестового запуска с tr_id = {tr_id}, "
                            f"в рамках проекта tp_id = {tp_id}",
                            status=status.HTTP_404_NOT_FOUND)
