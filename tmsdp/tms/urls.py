from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from . import views
from .views import MyTokenObtainPairView

urlpatterns = [
    path('api/testproject/', views.ProjectsAPIList.as_view()),
    path('api/testproject/add', views.ProjectsAPICreate.as_view()),
    path('api/priority/', views.PriorityAPIGet.as_view()),
    path('api/testrun/result/status', views.TestRunResultStatusAPIGet.as_view()),
    path('api/testproject/close/<int:tp_id>/', views.ProjectAPIClose.as_view()),
    path('api/<int:tp_id>/testsuit/', views.SuitAPIList.as_view()),
    path('api/testsuit/', views.SuitAllAPIList.as_view()),
    path('api/<int:tp_id>/testsuit/add/', views.SuitAPICreate.as_view()),
    path('api/testcase/', views.CaseAllAPIList.as_view()),
    path('api/<int:tp_id>/<int:ts_id>/testcase/', views.CaseAPIList.as_view()),
    path('api/<int:tp_id>/<int:ts_id>/testcase/add', views.CaseAPICreate.as_view()),
    path('api/<int:tp_id>/<int:ts_id>/detail/<int:pk>/', views.CaseAPIDetail.as_view()),
    path('api/<int:tp_id>/<int:ts_id>/update/<int:pk>/', views.CaseAPIUpdate.as_view()),
    path('api/<int:tp_id>/<int:ts_id>/delete/<int:pk>/', views.CaseAPIDelete.as_view()),
    path('api/<int:tp_id>/testcase/search/', views.CaseAPISearch.as_view()),
    path('api/<int:tp_id>/testruns/', views.RunsAPIList.as_view()),
    path('api/testruns/', views.RunsAllAPIList.as_view()),
    path('api/testruns/result/<int:tp_id>', views.RunsResultsAllAPIList.as_view()),
    path('api/<int:tp_id>/testrun/add/', views.RunsAPICreate.as_view()),
    path('api/<int:tp_id>/<int:tr_id>/testrun/', views.RunsAPIDetail.as_view()),  # то что нужно видимо хз
    path('api/<int:tp_id>/<int:tr_id>/result/<int:tc_id>/', views.RunsResultAPIDetailTc.as_view()),
    path('api/<int:tp_id>/<int:tr_id>/result/', views.RunsResultAPIDetail.as_view()),
    path('api/<int:tp_id>/<int:tr_id>/<int:tc_id>/result/add/', views.RunsResultAPICreate.as_view()),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify')
]
