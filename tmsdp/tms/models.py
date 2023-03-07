from django.db import models
from django.urls import reverse
from django.contrib.auth.models import User


class StatusTestRun(models.Model):
    name = models.CharField(max_length=90)

    def __str__(self):
        return self.name


class ProjectStatus(models.Model):
    name = models.CharField(max_length=90)

    def __str__(self):
        return self.name


class Priority(models.Model):
    name = models.CharField(max_length=90)

    def __str__(self):
        return self.name


class TestProject(models.Model):
    status = models.ForeignKey(ProjectStatus, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=90)
    creation_date = models.DateTimeField(auto_now_add=True)
    modification_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('projects')


class TestSuit(models.Model):
    name = models.CharField(max_length=90)
    description = models.TextField(blank=True)
    project = models.ForeignKey(TestProject, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('list_testsuits', kwargs={'tp_id': self.project.pk})


class TestCase(models.Model):
    testSuit = models.ForeignKey(TestSuit, on_delete=models.CASCADE)
    priority = models.ForeignKey(Priority, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    estimate = models.CharField(max_length=255)
    precondition = models.TextField(blank=True)
    steps = models.TextField()
    expected_result = models.TextField()

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('tc-list', kwargs={'tp_id': self.testSuit.project.pk, 'ts_id': self.testSuit.pk})


class TestRun(models.Model):
    testProject = models.ForeignKey(TestProject, on_delete=models.CASCADE)
    name = models.CharField(max_length=90)
    description = models.TextField(blank=True)
    testcases = models.ManyToManyField(TestCase, through='TestRunTestCase', through_fields=('testRun', 'testCase'))

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('list-testruns', kwargs={'tp_id': self.testProject.pk})


class TestRunTestCase(models.Model):
    testRun = models.ForeignKey(TestRun, on_delete=models.CASCADE)
    testCase = models.ForeignKey(TestCase, on_delete=models.CASCADE)

    class Meta:
        auto_created = True


class TestRunResult(models.Model):
    testrunTestcase = models.OneToOneField(TestRunTestCase, on_delete=models.CASCADE, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.ForeignKey(StatusTestRun, on_delete=models.CASCADE)
    comment = models.CharField(max_length=255, blank=True)
    trrDate = models.DateTimeField()

    def get_absolute_url(self):
        return reverse('trr-detail', kwargs={'tp_id': self.testrunTestcase.testRun.testProject.pk,
                                             'tr_id': self.testrunTestcase.testRun.pk,
                                             'pk': self.testrunTestcase.testCase.pk})

    class Meta:
        auto_created = True

    def __str__(self):
        return self.comment
