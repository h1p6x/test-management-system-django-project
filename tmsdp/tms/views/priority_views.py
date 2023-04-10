from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from ..database.models import *
from ..utils.serializers import *


class PriorityAPIGet(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = PriorityAllListSerializer
    queryset = Priority.objects.all()
