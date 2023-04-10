import operator
from functools import reduce

from django.db.models import Q
from rest_framework import filters
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..database.models import *
from ..utils.serializers import *


class CaseAPIList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestCaseListSerializer

    def get(self, request, tp_id, ts_id, **kwargs):
        tp_id_exists = TestProject.objects.filter(pk=self.kwargs['tp_id']).exists()
        ts_id_exists = TestSuit.objects.filter(pk=self.kwargs['ts_id']).exists()

        if not tp_id_exists or not ts_id_exists:
            return Response(f"Не существует проекта с tp_id = {tp_id} "
                            f"или набора тест кейсов с ts_id = {ts_id}",
                            status=status.HTTP_404_NOT_FOUND)

        if TestSuit.objects.filter(pk=ts_id, project=tp_id).exists():
            queryset = TestCase.objects.filter(testSuit=ts_id)
            serializer_for_queryset = TestCaseListSerializer(
                instance=queryset,
                many=True
            )
            return Response(serializer_for_queryset.data)
        else:
            return Response(f"Не существует набора тест кейсов с ts_id = {ts_id}, "
                            f"в рамках проекта tp_id = {tp_id}",
                            status=status.HTTP_404_NOT_FOUND)



class CaseAllAPIList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestCaseAllListSerializer
    queryset = TestCase.objects.all()


class CaseAPICreate(generics.CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestCaseCreateSerializer

    def post(self, request, tp_id, ts_id, **kwargs):
        tp_id_exists = TestProject.objects.filter(pk=tp_id).exists()
        ts_id_exists = TestSuit.objects.filter(pk=ts_id).exists()

        if not tp_id_exists or not ts_id_exists:
            return Response(f"Не существует проекта с tp_id = {tp_id} "
                            f"или набора тест кейсов с ts_id = {ts_id}",
                            status=status.HTTP_404_NOT_FOUND)

        if TestSuit.objects.filter(pk=ts_id, project=tp_id).exists():
            test_suit = TestSuit.objects.get(pk=ts_id, project=tp_id)
            test_case_data = {
                'title': request.data['title'],
                'priority': Priority.objects.get(name=request.data['priority']),
                'estimate': request.data['estimate'],
                'precondition': request.data['precondition'],
                'steps': request.data['steps'],
                'expected_result': request.data['expected_result'],
                'testSuit': test_suit
            }
            test_case_post = TestCase.objects.create(**test_case_data)
            return Response(TestCaseListSerializer(test_case_post).data, status=status.HTTP_201_CREATED)
        else:
            return Response(f"Не существует набора тест кейсов с ts_id = {ts_id}, "
                            f"в рамках проекта tp_id = {tp_id}",
                            status=status.HTTP_404_NOT_FOUND)


class CaseAPIDetail(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestCaseDetailSerializer

    def get(self, request, tp_id, ts_id, pk, **kwargs):
        tp_id_exists = TestProject.objects.filter(pk=tp_id).exists()
        ts_id_exists = TestSuit.objects.filter(pk=ts_id).exists()

        if not tp_id_exists or not ts_id_exists:
            return Response(f"Не существует проекта с tp_id = {tp_id} "
                            f"или набора тест кейсов с ts_id = {ts_id}",
                            status=status.HTTP_404_NOT_FOUND)

        if TestSuit.objects.filter(pk=ts_id, project=tp_id).exists():
            queryset = TestCase.objects.filter(testSuit=ts_id, pk=pk)
            serializer_for_queryset = TestCaseListSerializer(instance=queryset, many=True)
            return Response(serializer_for_queryset.data)
        else:
            return Response(f"Не существует набора тест кейсов с ts_id = {ts_id}, "
                            f"в рамках проекта tp_id = {tp_id}",
                            status=status.HTTP_404_NOT_FOUND)


class CaseAPIDelete(generics.DestroyAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestCaseDetailSerializer

    def delete(self, request, tp_id, ts_id, pk, **kwargs):
        tp_id_exists = TestProject.objects.filter(pk=tp_id).exists()
        ts_id_exists = TestSuit.objects.filter(pk=ts_id).exists()
        pk_exists = TestCase.objects.filter(pk=pk).exists()

        if not tp_id_exists or not ts_id_exists:
            return Response(f"Не существует проекта с tp_id = {tp_id} "
                            f"или набора тест кейсов с ts_id = {ts_id}",
                            status=status.HTTP_404_NOT_FOUND)

        if not pk_exists:
            return Response(f"Не существует тест кейса с id = {pk}", status=status.HTTP_404_NOT_FOUND)

        if TestSuit.objects.filter(pk=ts_id, project=tp_id).exists():
            queryset = TestCase.objects.filter(testSuit=ts_id, pk=pk).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(f"Не существует набора тестов ts_id = {ts_id} "
                            f"в рамках проекта tp_id = {tp_id}",
                            status=status.HTTP_404_NOT_FOUND)


class CaseAPIUpdate(generics.UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestCaseCreateSerializer

    def put(self, request, tp_id, ts_id, pk, **kwargs):
        tp_id_exists = TestProject.objects.filter(pk=tp_id).exists()
        ts_id_exists = TestSuit.objects.filter(pk=ts_id).exists()
        pk_exists = TestCase.objects.filter(pk=pk).exists()

        if not tp_id_exists or not ts_id_exists:
            return Response(f"Не существует проекта с tp_id = {tp_id} "
                            f"или набора тест кейсов с ts_id = {ts_id}",
                            status=status.HTTP_404_NOT_FOUND)
        if not pk_exists:
            return Response(f"Не существует тест кейса с id = {pk}", status=status.HTTP_404_NOT_FOUND)

        if not TestSuit.objects.filter(pk=ts_id, project=tp_id).exists():
            return Response(f"Не существует набора тестов ts_id = {ts_id} "
                            f"в рамках проекта tp_id = {tp_id}",
                            status=status.HTTP_404_NOT_FOUND)

        if TestCase.objects.filter(testSuit=ts_id, pk=pk).exists():
            test_suit = TestSuit.objects.get(pk=ts_id, project=tp_id)
            TestCase.objects.filter(testSuit=ts_id, pk=pk).update(
                title=request.data['title'],
                priority=Priority.objects.get(name=request.data['priority']),
                estimate=request.data['estimate'],
                precondition=request.data['precondition'],
                steps=request.data['steps'],
                expected_result=request.data['expected_result'],
                testSuit=test_suit
            )
            queryset = TestCase.objects.filter(testSuit=ts_id, pk=pk)
            serializer_for_queryset = TestCaseListSerializer(
                instance=queryset,
                many=True
            )
            return Response(serializer_for_queryset.data, status=status.HTTP_200_OK)
        else:
            return Response(f"Не существует тест кейса с id = {pk} для данного набора тестов",
                            status=status.HTTP_404_NOT_FOUND)


class CaseAPISearch(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    filter_backends = (filters.SearchFilter,)
    serializer_class = TestCaseListSerializer

    def get_queryset(self):
        result = TestCase.objects.filter(testSuit__project__id=self.kwargs.get('tp_id'))
        query_list = self.request.GET.get('q', '').split()

        if query_list:
            result = result.filter(
                reduce(operator.and_,
                       (Q(title__icontains=q) for q in query_list)) |
                reduce(operator.and_,
                       (Q(steps__icontains=q) for q in query_list))
            )
        return result

    def get_context_data(self, **kwargs):
        context = super(CaseAPISearch, self).get_context_data(**kwargs)
        context['tp_id'] = self.kwargs.get('tp_id')
        context['search_word'] = self.request.GET.get('q')
        return context
