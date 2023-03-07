from django.contrib import admin
from .models import *

admin.site.register(TestCase)
admin.site.register(StatusTestRun)
admin.site.register(ProjectStatus)
admin.site.register(Priority)
admin.site.register(TestProject)
admin.site.register(TestSuit)
admin.site.register(TestRun)
admin.site.register(TestRunResult)
