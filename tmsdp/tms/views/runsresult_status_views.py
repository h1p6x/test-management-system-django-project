from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from ..database.models import *
from ..utils.serializers import *


class TestRunResultStatusAPIGet(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TestRunResulStatusAllListSerializer
    queryset = StatusTestRun.objects.all()
