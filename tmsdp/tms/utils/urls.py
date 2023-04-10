from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from ..views import case_views, \
    logout_views, project_views, priority_views, \
    runsresult_views, runs_views, runsresult_status_views, \
    suit_views
from ..views import token_add

urlpatterns = [
    path('api/testproject/', project_views.ProjectsAPIList.as_view()),
    path('api/testproject/add', project_views.ProjectsAPICreate.as_view()),
    path('api/priority/', priority_views.PriorityAPIGet.as_view()),
    path('api/testrun/result/status', runsresult_status_views.TestRunResultStatusAPIGet.as_view()),
    path('api/testproject/close/<int:tp_id>/', project_views.ProjectAPIClose.as_view()),
    path('api/<int:tp_id>/testsuit/', suit_views.SuitAPIList.as_view()),
    path('api/testsuit/', suit_views.SuitAllAPIList.as_view()),
    path('api/<int:tp_id>/testsuit/add/', suit_views.SuitAPICreate.as_view()),
    path('api/testcase/', case_views.CaseAllAPIList.as_view()),
    path('api/<int:tp_id>/<int:ts_id>/testcase/', case_views.CaseAPIList.as_view()),
    path('api/<int:tp_id>/<int:ts_id>/testcase/add', case_views.CaseAPICreate.as_view()),
    path('api/<int:tp_id>/<int:ts_id>/detail/<int:pk>/', case_views.CaseAPIDetail.as_view()),
    path('api/<int:tp_id>/<int:ts_id>/update/<int:pk>/', case_views.CaseAPIUpdate.as_view()),
    path('api/<int:tp_id>/<int:ts_id>/delete/<int:pk>/', case_views.CaseAPIDelete.as_view()),
    path('api/<int:tp_id>/testcase/search/', case_views.CaseAPISearch.as_view()),
    path('api/<int:tp_id>/testruns/', runs_views.RunsAPIList.as_view()),
    path('api/testruns/', runs_views.RunsAllAPIList.as_view()),
    path('api/testruns/result/<int:tp_id>', runsresult_views.RunsResultsAllAPIList.as_view()),
    path('api/<int:tp_id>/testrun/add/', runs_views.RunsAPICreate.as_view()),
    path('api/<int:tp_id>/<int:tr_id>/testrun/', runs_views.RunsAPIDetail.as_view()),
    path('api/<int:tp_id>/<int:tr_id>/result/<int:tc_id>/', runsresult_views.RunsResultAPIDetailTc.as_view()),
    path('api/<int:tp_id>/<int:tr_id>/result/', runsresult_views.RunsResultAPIDetail.as_view()),
    path('api/<int:tp_id>/<int:tr_id>/<int:tc_id>/result/add/', runsresult_views.RunsResultAPICreate.as_view()),
    path('token/', token_add.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify')
]
