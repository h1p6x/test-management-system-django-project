import operator
from functools import reduce

from django.db.models import Q
from rest_framework import filters
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import *
from .serializers import *


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


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
            user=self.request.user
        )
        return Response(TestProjectListSerializer(post_new).data, status=status.HTTP_201_CREATED)


class ProjectAPIClose(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestProjectUpdateSerializer

    def put(self, request, tp_id):
        if TestProject.objects.filter(pk=self.kwargs['tp_id']).exists():
            queryset = TestProject.objects.get(pk=tp_id)
            queryset.status = ProjectStatus.objects.get(name='Closed')
            queryset.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(f"Не существует проекта с id = {self.kwargs['tp_id']}", status=status.HTTP_404_NOT_FOUND)


class SuitAPIList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestSuitListSerializer

    def get(self, request, tp_id):
        if TestProject.objects.filter(pk=self.kwargs['tp_id']).exists():
            queryset = TestSuit.objects.filter(project=tp_id)
            serializer_for_queryset = TestSuitListSerializer(
                instance=queryset,  # Передаём набор записей
                many=True  # Указываем, что на вход подаётся именно набор записей
            )
            return Response(serializer_for_queryset.data)
        else:
            return Response(f"Не существует проекта с id = {self.kwargs['tp_id']}", status=status.HTTP_404_NOT_FOUND)


class SuitAllAPIList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestSuitAllListSerializer
    queryset = TestSuit.objects.all()


class SuitAPICreate(generics.CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestSuitCreateSerializer

    def post(self, request, tp_id):
        if TestProject.objects.filter(pk=self.kwargs['tp_id']).exists():
            testproject_queryset = TestProject.objects.get(pk=self.kwargs['tp_id'])
            post_new = TestSuit.objects.create(
                name=request.data['name'],
                description=request.data['description'],
                project=testproject_queryset
            )
            return Response(TestSuitListSerializer(post_new).data, status=status.HTTP_201_CREATED)
        else:
            return Response(f"Не существует проекта с id = {self.kwargs['tp_id']}", status=status.HTTP_400_BAD_REQUEST)


class CaseAPIList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestCaseListSerializer

    def get(self, request, tp_id, ts_id, **kwargs):
        if not TestProject.objects.filter(pk=self.kwargs['tp_id']).exists() or \
                not TestSuit.objects.filter(pk=self.kwargs['ts_id']).exists():
            return Response(f"Не существует проекта с tp_id = {self.kwargs['tp_id']} "
                            f"или набора тест кейсов с ts_id = {self.kwargs['ts_id']}",
                            status=status.HTTP_404_NOT_FOUND)
        if TestSuit.objects.filter(pk=self.kwargs['ts_id'], project=self.kwargs['tp_id']).exists():
            queryset = TestCase.objects.filter(testSuit=self.kwargs['ts_id'])
            serializer_for_queryset = TestCaseListSerializer(
                instance=queryset,
                many=True
            )
            return Response(serializer_for_queryset.data)
        else:
            return Response(f"Не существует набора тест кейсов с ts_id = {self.kwargs['ts_id']}, "
                            f"в рамках проекта tp_id = {self.kwargs['tp_id']}",
                            status=status.HTTP_404_NOT_FOUND)


class CaseAllAPIList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestCaseAllListSerializer
    queryset = TestCase.objects.all()


class CaseAPICreate(generics.CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestCaseCreateSerializer

    def post(self, request, tp_id, ts_id, **kwargs):
        if not TestProject.objects.filter(pk=self.kwargs['tp_id']).exists() or \
                not TestSuit.objects.filter(pk=self.kwargs['ts_id']).exists():
            return Response(f"Не существует проекта с tp_id = {self.kwargs['tp_id']} "
                            f"или набора тест кейсов с ts_id = {self.kwargs['ts_id']}",
                            status=status.HTTP_404_NOT_FOUND)
        if TestSuit.objects.filter(pk=self.kwargs['ts_id'], project=self.kwargs['tp_id']).exists():
            test_suit = TestSuit.objects.get(pk=self.kwargs['ts_id'], project=self.kwargs['tp_id'])
            test_case_post = TestCase.objects.create(
                title=request.data['title'],
                priority=Priority.objects.get(name=request.data['priority']),
                estimate=request.data['estimate'],
                precondition=request.data['precondition'],
                steps=request.data['steps'],
                expected_result=request.data['expected_result'],
                testSuit=test_suit
            )
            return Response(TestCaseListSerializer(test_case_post).data, status=status.HTTP_201_CREATED)
        else:
            return Response(f"Не существует набора тест кейсов с ts_id = {self.kwargs['ts_id']}, "
                            f"в рамках проекта tp_id = {self.kwargs['tp_id']}",
                            status=status.HTTP_404_NOT_FOUND)


class CaseAPIDetail(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestCaseDetailSerializer

    def get(self, request, tp_id, ts_id, pk, **kwargs):
        if not TestProject.objects.filter(pk=self.kwargs['tp_id']).exists() or \
                not TestSuit.objects.filter(pk=self.kwargs['ts_id']).exists():
            return Response(f"Не существует проекта с tp_id = {self.kwargs['tp_id']} "
                            f"или набора тест кейсов с ts_id = {self.kwargs['ts_id']}",
                            status=status.HTTP_404_NOT_FOUND)
        if TestSuit.objects.filter(pk=self.kwargs['ts_id'], project=self.kwargs['tp_id']).exists():
            queryset = TestCase.objects.filter(testSuit=self.kwargs['ts_id'], pk=self.kwargs['pk'])
            serializer_for_queryset = TestCaseListSerializer(
                instance=queryset,  # Передаём набор записей
                many=True  # Указываем, что на вход подаётся именно набор записей
            )
            return Response(serializer_for_queryset.data)
        else:
            return Response(f"Не существует набора тест кейсов с ts_id = {self.kwargs['ts_id']}, "
                            f"в рамках проекта tp_id = {self.kwargs['tp_id']}",
                            status=status.HTTP_404_NOT_FOUND)


class CaseAPIDelete(generics.DestroyAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestCaseDetailSerializer

    def delete(self, request, tp_id, ts_id, pk, **kwargs):
        if not TestProject.objects.filter(pk=self.kwargs['tp_id']).exists() or \
                not TestSuit.objects.filter(pk=self.kwargs['ts_id']).exists():
            return Response(f"Не существует проекта с tp_id = {self.kwargs['tp_id']} "
                            f"или набора тест кейсов с ts_id = {self.kwargs['ts_id']}",
                            status=status.HTTP_404_NOT_FOUND)
        if not TestCase.objects.filter(pk=self.kwargs['pk']).exists():
            return Response(f"Не существует тест кейса с id = {self.kwargs['pk']}", status=status.HTTP_404_NOT_FOUND)
        if not TestSuit.objects.filter(pk=self.kwargs['ts_id'], project=self.kwargs['tp_id']).exists():
            return Response(f"Не существует набора тестов ts_id = {self.kwargs['ts_id']} "
                            f"в рамках проекта tp_id = {self.kwargs['tp_id']}",
                            status=status.HTTP_404_NOT_FOUND)
        if TestCase.objects.filter(testSuit=self.kwargs['ts_id'], pk=self.kwargs['pk']).exists():
            queryset = TestCase.objects.filter(testSuit=self.kwargs['ts_id'], pk=self.kwargs['pk']).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(f"Не существует тест кейса с id = {self.kwargs['pk']} для данного набора тестов",
                            status=status.HTTP_404_NOT_FOUND)


class CaseAPIUpdate(generics.UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestCaseCreateSerializer

    def put(self, request, tp_id, ts_id, pk, **kwargs):
        if not TestProject.objects.filter(pk=self.kwargs['tp_id']).exists() or \
                not TestSuit.objects.filter(pk=self.kwargs['ts_id']).exists():
            return Response(f"Не существует проекта с tp_id = {self.kwargs['tp_id']} "
                            f"или набора тест кейсов с ts_id = {self.kwargs['ts_id']}",
                            status=status.HTTP_404_NOT_FOUND)
        if not TestCase.objects.filter(pk=self.kwargs['pk']).exists():
            return Response(f"Не существует тест кейса с id = {self.kwargs['pk']}", status=status.HTTP_404_NOT_FOUND)
        if not TestSuit.objects.filter(pk=self.kwargs['ts_id'], project=self.kwargs['tp_id']).exists():
            return Response(f"Не существует набора тестов ts_id = {self.kwargs['ts_id']} "
                            f"в рамках проекта tp_id = {self.kwargs['tp_id']}",
                            status=status.HTTP_404_NOT_FOUND)
        if TestCase.objects.filter(testSuit=self.kwargs['ts_id'], pk=self.kwargs['pk']).exists():
            test_suit = TestSuit.objects.get(pk=self.kwargs['ts_id'], project=self.kwargs['tp_id'])
            TestCase.objects.filter(testSuit=self.kwargs['ts_id'], pk=self.kwargs['pk']).update(
                title=request.data['title'],
                priority=Priority.objects.get(name=request.data['priority']),
                estimate=request.data['estimate'],
                precondition=request.data['precondition'],
                steps=request.data['steps'],
                expected_result=request.data['expected_result'],
                testSuit=test_suit
            )
            queryset = TestCase.objects.filter(testSuit=self.kwargs['ts_id'], pk=self.kwargs['pk'])
            serializer_for_queryset = TestCaseListSerializer(
                instance=queryset,
                many=True
            )
            return Response(serializer_for_queryset.data, status=status.HTTP_200_OK)
        else:
            return Response(f"Не существует тест кейса с id = {self.kwargs['pk']} для данного набора тестов",
                            status=status.HTTP_404_NOT_FOUND)


class CaseAPISearch(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    filter_backends = (filters.SearchFilter,)
    serializer_class = TestCaseListSerializer

    def get_queryset(self):
        result = TestCase.objects.filter(testSuit__project__id=self.kwargs['tp_id'])
        query = self.request.query_params.get('search', '')

        if query:
            query_list = query.split()
            result = result.filter(
                reduce(operator.and_,
                       (Q(title__iregex=q) for q in query_list)) |
                reduce(operator.and_,
                       (Q(steps__iregex=q) for q in query_list))
            )
        return result

    def get_context_data(self, **kwargs):
        context = super(CaseAPISearch, self).get_context_data(**kwargs)
        context['tp_id'] = self.kwargs['tp_id']
        context['search_word'] = self.request.GET.get('q')
        return context


class RunsAPIList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestRunsSerializer

    def get(self, request, tp_id):
        if TestProject.objects.filter(pk=self.kwargs['tp_id']).exists():
            queryset = TestRun.objects.filter(testProject=tp_id).order_by("-name")
            serializer_for_queryset = TestRunsSerializer(
                instance=queryset,
                many=True
            )
            return Response(serializer_for_queryset.data)
        else:
            return Response(f"Не существует проекта с id = {self.kwargs['tp_id']}", status=status.HTTP_404_NOT_FOUND)


class RunsAllAPIList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestRunAllListSerializer
    queryset = TestRun.objects.all()


class RunsAPICreate(generics.CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestRunsCreateSerializer
    queryset = TestRun.objects.all()

    def post(self, request, tp_id):
        if TestProject.objects.filter(pk=self.kwargs['tp_id']).exists():
            data_ready_for_json = list(TestProject.objects.filter(pk=self.kwargs['tp_id']).values('id'))
            test_project_name = data_ready_for_json[0]['id']
            for key in request.data['testcases']:
                if not TestCase.objects.filter(pk=key, testSuit__project__id=self.kwargs['tp_id']).exists():
                    return Response(f"Не существует тест кейса с id = {key}"
                                    f" для тестовго проекта с tp_id = {self.kwargs['tp_id']}",
                                    status=status.HTTP_404_NOT_FOUND)
            request.data['testProject'] = test_project_name
            serializer = TestRunsCreateSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(f"Не существует тест кейса с id = {self.kwargs['tc_id']}"
                            f"для тестовго проекта с tp_id = {self.kwargs['tp_id']}", status=status.HTTP_404_NOT_FOUND)


class RunsAPIDetail(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestRunsSerializer
    queryset = TestRun.objects.all()

    def get(self, request, tp_id, tr_id, **kwargs):
        if not TestProject.objects.filter(pk=self.kwargs['tp_id']).exists() or \
                not TestRun.objects.filter(pk=self.kwargs['tr_id']).exists():
            return Response(f"Не существует проекта с tp_id = {self.kwargs['tp_id']} "
                            f"или тестового запуска с tr_id = {self.kwargs['tr_id']}",
                            status=status.HTTP_404_NOT_FOUND)
        if TestRun.objects.filter(pk=self.kwargs['tr_id'], testProject=self.kwargs['tp_id']).exists():
            queryset = TestRun.objects.filter(testProject=self.kwargs['tp_id'], pk=self.kwargs['tr_id'])
            # queryset = TestRunTestCase.objects.filter(testRun=self.kwargs['tr_id'])
            serializer_for_queryset = TestRunsSerializer(
                instance=queryset,
                many=True
            )
            return Response(serializer_for_queryset.data)
        else:
            return Response(f"Не существует тестового запуска tr_id = {self.kwargs['tr_id']} "
                            f"в рамках проекта tp_id = {self.kwargs['tp_id']}",
                            status=status.HTTP_404_NOT_FOUND)


class RunsResultsAllAPIList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestRunsResultAllListSerializer
    queryset = TestRunResult.objects.all()

    def get(self, request, tp_id):
        queryset = TestRunResult.objects.filter(testrunTestcase__testRun_id__testProject__id=self.kwargs['tp_id'])
        # queryset = TestRunResult.objects.all().select_related('testrunTestcase').values_list('testrunTestcase__testRun_id').values()
        serializer_for_queryset = TestRunsResultListSerializer(
            instance=queryset,
            many=True
        )
        return Response(serializer_for_queryset.data)


class RunsResultAPIDetailTc(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestRunsResultListSerializer

    def get(self, request, tp_id, tr_id, tc_id, **kwargs):
        if not TestProject.objects.filter(pk=self.kwargs['tp_id']).exists() or \
                not TestRun.objects.filter(pk=self.kwargs['tr_id'], testProject=self.kwargs['tp_id']).exists():
            return Response(f"Не существует проекта с tp_id = {self.kwargs['tp_id']} "
                            f"или тестового запуска с tr_id = {self.kwargs['tr_id']}",
                            status=status.HTTP_404_NOT_FOUND)
        if TestRunTestCase.objects.filter(testRun=self.kwargs['tr_id'], testCase=self.kwargs['tc_id']):
            queryset = TestRunResult.objects.filter(testrunTestcase=TestRunTestCase.
                                                    objects.get(testRun=self.kwargs['tr_id'],
                                                                testCase=self.kwargs['tc_id']))
            serializer_for_queryset = TestRunsResultListSerializer(
                instance=queryset,
                many=True
            )
            print(serializer_for_queryset.data)
            return Response(serializer_for_queryset.data)
        else:
            return Response(f"Не существует тестового запуска tr_id = {self.kwargs['tr_id']} "
                            f"в рамках проекта tp_id = {self.kwargs['tp_id']}",
                            status=status.HTTP_404_NOT_FOUND)


class RunsResultAPIDetail(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestRunsResultListSerializer
    queryset = TestRunResult.objects.all()

    def get(self, request, tp_id, tr_id,
            **kwargs):  # TODO не получается вывести множество элементов, если указано objects.get(),
        # TODO а если указано filter, то The QuerySet value for an exact lookup must be limited to one result using slicing.
        if not TestProject.objects.filter(pk=self.kwargs['tp_id']).exists() or \
                not TestRun.objects.filter(pk=self.kwargs['tr_id'], testProject=self.kwargs['tp_id']).exists():
            return Response(f"Не существует проекта с tp_id = {self.kwargs['tp_id']} "
                            f"или тестового запуска с tr_id = {self.kwargs['tr_id']}",
                            status=status.HTTP_404_NOT_FOUND)
        if TestRunTestCase.objects.filter(testRun=self.kwargs['tr_id']):
            # queryset = TestRunResult.objects.filter(testrunTestcase=TestRunTestCase.
            #                                         objects.filter(testRun=self.kwargs['tr_id']).order_by('id'))
            queryset = TestRunTestCase.objects.filter(testRun=self.kwargs['tr_id'])
            # serializer_for_queryset = TestRunsResultListSerializer(
            #     instance=queryset,
            #     many=True
            # )
            serializer_for_queryset = TestRunTestCaseSerializer(
                instance=queryset,
                many=True
            )
            return Response(serializer_for_queryset.data)
        else:
            return Response([])


class RunsResultAPICreate(generics.CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestRunsResultCreateSerializer

    def post(self, request, tp_id, tr_id, tc_id, **kwargs):
        if not TestProject.objects.filter(pk=self.kwargs['tp_id']).exists() or \
                not TestRun.objects.filter(pk=self.kwargs['tr_id']).exists():
            return Response(f"Не существует проекта с tp_id = {self.kwargs['tp_id']} "
                            f"или тестового запуска с tr_id = {self.kwargs['tr_id']}",
                            status=status.HTTP_404_NOT_FOUND)
        if not TestCase.objects.filter(pk=self.kwargs['tc_id'], testSuit__project__id=self.kwargs['tp_id']).exists():
            return Response(f"Не существует тест кейса с id = {self.kwargs['tc_id']} "
                            f"для тестовго проекта с tp_id = {self.kwargs['tp_id']}", status=status.HTTP_404_NOT_FOUND)
        if TestRun.objects.filter(pk=self.kwargs['tr_id'], testProject=self.kwargs['tp_id']).exists():
            test_run_result_post = TestRunResult.objects.create(
                testrunTestcase=TestRunTestCase.objects.get(testRun=self.kwargs['tr_id'],
                                                            testCase=self.kwargs['tc_id']),
                status=StatusTestRun.objects.get(name=request.data['status']),
                trrDate=request.data['trrDate'],
                comment=request.data['comment'],
                user=self.request.user,
            )
            return Response(TestRunsResultCreateSerializer(test_run_result_post).data, status=status.HTTP_201_CREATED)
        else:
            return Response(f"Не существует тестового запуска с tr_id = {self.kwargs['tr_id']}, "
                            f"в рамках проекта tp_id = {self.kwargs['tp_id']}",
                            status=status.HTTP_404_NOT_FOUND)


class PriorityAPIGet(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = PriorityAllListSerializer
    queryset = Priority.objects.all()


class TestRunResultStatusAPIGet(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestRunResulStatusAllListSerializer
    queryset = StatusTestRun.objects.all()


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):

        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
