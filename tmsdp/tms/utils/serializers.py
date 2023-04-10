from rest_framework import serializers

from ..database import models


class TestProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TestProject
        fields = ['name']


class TestProjectListSerializer(serializers.ModelSerializer):
    status = serializers.CharField(source='status.name', max_length=200)
    user = serializers.CharField(source='user.username', max_length=200)

    class Meta:
        model = models.TestProject
        fields = '__all__'


class TestProjectUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TestProject
        fields = ['status', 'user']


class TestSuitCreateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.TestSuit
        fields = ['name', 'description']


class TestSuitListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=90)
    description = serializers.CharField(allow_blank=True)
    project = serializers.CharField(source='project.name', max_length=200)


class TestSuitAllListSerializer(serializers.ModelSerializer):
    project = serializers.CharField(source='project.name', max_length=200)

    class Meta:
        model = models.TestSuit
        fields = '__all__'


class TestCaseAllListSerializer(serializers.ModelSerializer):
    priority = serializers.CharField(source='priority.name', max_length=200)
    testSuit = serializers.CharField(source='testSuit.name', max_length=200)

    class Meta:
        model = models.TestCase
        fields = '__all__'


class TestCaseListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField(max_length=255)
    priority = serializers.CharField(source='priority.name', max_length=200)
    estimate = serializers.CharField(max_length=255)
    precondition = serializers.CharField(allow_blank=True)
    steps = serializers.CharField()
    expected_result = serializers.CharField()
    testSuit = serializers.CharField(source='testSuit.name', max_length=200)


class TestCaseCreateSerializer(serializers.ModelSerializer):
    priority = serializers.CharField(source='priority.name', max_length=200)

    class Meta:
        model = models.TestCase
        fields = ['title', 'priority', 'estimate', 'precondition', 'steps', 'expected_result']


class TestCaseDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TestCase
        fields = ['title', 'priority', 'estimate', 'precondition', 'steps', 'expected_result']


class TestRunsSerializer(serializers.ModelSerializer):
    testProject = serializers.CharField(source='testProject.name', max_length=200)

    class Meta:
        model = models.TestRun
        fields = '__all__'


class TestRunAllListSerializer(serializers.ModelSerializer):
    testProject = serializers.CharField(source='testProject.name', max_length=200)

    # testcases = serializers.CharField(source='testcases.name', max_length=500)
    class Meta:
        model = models.TestRun
        fields = '__all__'


class TestRunsCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TestRun
        fields = ['name', 'description', 'testcases', 'testProject']


class TestRunsResultListSerializer(serializers.ModelSerializer):
    status = serializers.CharField(source='status.name', max_length=200)
    user = serializers.CharField(source='user.username', max_length=200)

    class Meta:
        model = models.TestRunResult
        fields = '__all__'


class TestRunsResultCreateSerializer(serializers.ModelSerializer):
    status = serializers.CharField(source='status.name', max_length=200)

    class Meta:
        model = models.TestRunResult
        fields = ['status', 'comment', 'trrDate']


class TestRunsResultAllListSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TestRunResult
        fields = '__all__'


class PriorityAllListSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Priority
        fields = '__all__'


class TestRunResulStatusAllListSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StatusTestRun
        fields = '__all__'


class TestRunTestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TestRunTestCase
        fields = '__all__'
