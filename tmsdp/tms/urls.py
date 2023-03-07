from django.urls import include, re_path, path
from django.contrib.auth.decorators import login_required
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

urlpatterns = [
        path('api/testproject/', login_required(views.ProjectsAPIList.as_view())),
        path('api/testproject/add', login_required(views.ProjectsAPICreate.as_view())),
        path('api/testproject/close/<int:tp_id>/', login_required(views.ProjectAPIClose.as_view())),
        path('api/<int:tp_id>/testsuit/', login_required(views.SuitAPIList.as_view())),
        path('api/<int:tp_id>/testsuit/add/', login_required(views.SuitAPICreate.as_view())),
        path('api/<int:tp_id>/<int:ts_id>/testcase/', login_required(views.CaseAPIList.as_view())),
        path('api/<int:tp_id>/<int:ts_id>/testcase/add', login_required(views.CaseAPICreate.as_view())),
        path('api/<int:tp_id>/<int:ts_id>/detail/<int:pk>/', login_required(views.CaseAPIDetail.as_view())),
        path('api/<int:tp_id>/<int:ts_id>/update/<int:pk>/', login_required(views.CaseAPIUpdate.as_view())),
        path('api/<int:tp_id>/<int:ts_id>/delete/<int:pk>/', login_required(views.CaseAPIDelete.as_view())),
        path('api/<int:tp_id>/testcase/search/', login_required(views.CaseAPISearch.as_view())),
        path('api/<int:tp_id>/testruns/', login_required(views.RunsAPIList.as_view())),
        path('api/<int:tp_id>/testrun/add/', login_required(views.RunsAPICreate.as_view())),
        path('api/<int:tp_id>/<int:tr_id>/testrun/', login_required(views.RunsAPIDetail.as_view())),
        path('api/<int:tp_id>/<int:tr_id>/result/<int:tc_id>/', login_required(views.RunsResultAPIDetail.as_view())),
        path('api/<int:tp_id>/<int:tr_id>/<int:tc_id>/result/add/', login_required(views.RunsResultAPICreate.as_view())),
        path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
        path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
