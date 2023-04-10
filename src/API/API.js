import React from 'react';

export const getProjects = async ({authTokens}) => {
    return await fetch('http://127.0.0.1:8000/api/testproject/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        }
    }).then((res) => res.json())
}

export const getSuits = async ({authTokens}) => {
    return await fetch('http://127.0.0.1:8000/api/testsuit/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        }
    }).then((res) => res.json())
}

export const getTestCase = async ({authTokens}) => {
    return await fetch('http://127.0.0.1:8000/api/testcase/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        }
    }).then((res) => res.json())
}

export const getTestCasePriority = async ({authTokens}) => {
    return await fetch('http://127.0.0.1:8000/api/priority/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        }
    }).then((res) => res.json())
}

export const getTestRuns = async ({authTokens}) => {
    return await fetch('http://127.0.0.1:8000/api/testruns/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        }
    }).then((res) => res.json())
}

export const getTestRunsForProject = async ({authTokens, projectId}) => {
    return await fetch(`http://127.0.0.1:8000/api/${projectId}/testruns/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        }
    }).then((res) => res.json())
};

export const getTestRunsTestCaseForTestRun = async ({authTokens, projectId, testRunId}) => {
    return await fetch(`http://127.0.0.1:8000/api/${projectId}/${testRunId}/result/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        }
    }).then((res) => res.json())
};

export const getTectCaseDetailForForTestRun = async ({authTokens, projectId, testRunId}) => {
    return await fetch(`http://127.0.0.1:8000/api/${projectId}/${testRunId}/result/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        }
    }).then((res) => res.json())
};

export const getTestSuitForProject = async ({authTokens, projectId}) => {
    return await fetch(`http://127.0.0.1:8000/api/${projectId}/testsuit/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        }
    }).then((res) => res.json())
};

export const createProject = async ({authTokens, projectName}) => {
    return await fetch(`http://127.0.0.1:8000/api/testproject/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        },
        body: JSON.stringify({
            name: projectName
        })
    }).then((res) => (res))
};

export const closeProject = async ({authTokens, id}) => {
    return await fetch(`http://127.0.0.1:8000/api/testproject/close/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        },
        body: JSON.stringify({})
    }).then((res) => res.json())
};

export const createTestSuit = async ({authTokens, testSuitCreate, projectId}) => {
    return await fetch(`http://127.0.0.1:8000/api/${projectId}/testsuit/add/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        },
        body: JSON.stringify({
            name: testSuitCreate.name,
            description: testSuitCreate.description
        })
    }).then((res) => res)
};

export const createTestRun = async ({authTokens, testRunCreate, projectId}) => {
    return await fetch(`http://127.0.0.1:8000/api/${projectId}/testrun/add/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        },
        body: JSON.stringify({
            name: testRunCreate.name,
            description: testRunCreate.description,
            testcases: testRunCreate.testcases
        })
    }).then((res) => res)
};

export const createTestCase = async ({authTokens, testCaseCreate, projectId, testSuitId}) => {
    return await fetch(`http://127.0.0.1:8000/api/${projectId}/${testSuitId}/testcase/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        },
        body: JSON.stringify({
            title: testCaseCreate.title,
            priority: testCaseCreate.priority,
            estimate: testCaseCreate.estimate,
            precondition: testCaseCreate.precondition,
            steps: testCaseCreate.steps,
            expected_result: testCaseCreate.expected_result
        })
    }).then((res) => res)
};

export const getTestCaseForProject = async ({authTokens, projectId}) => {
    return await fetch(`http://127.0.0.1:8000/api/${projectId}/testcase/search/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        }
    }).then((res) => res.json())
};

export const getTestCaseForSuit = async ({authTokens, projectId, testSuitId}) => {
    return await fetch(`http://127.0.0.1:8000/api/${projectId}/${testSuitId}/testcase/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        }
    }).then((res) => res.json())
};

export const getRunResultForTestCase = async ({authTokens, projectId, testRunId, testRunTestCase}) => {
    return await fetch(`http://127.0.0.1:8000/api/${projectId}/${testRunId}/result/${testRunTestCase}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        }
    }).then((res) => res.json())
};

export const editTestCase = async ({authTokens, projectId, testSuitId, testCaseId, testCaseDetail}) => {
    return await fetch(`http://127.0.0.1:8000/api/${projectId}/${testSuitId}/update/${testCaseId}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        },
        body: JSON.stringify({
            title: testCaseDetail.title,
            priority: testCaseDetail.priority,
            estimate: testCaseDetail.estimate,
            precondition: testCaseDetail.precondition,
            steps: testCaseDetail.steps,
            expected_result: testCaseDetail.expected_result
        })
    }).then((res) => res)
};

export const deleteTestCase = async ({authTokens, projectId, testSuitId, testCaseId}) => {
    return await fetch(`http://127.0.0.1:8000/api/${projectId}/${testSuitId}/delete/${testCaseId}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        },
    }).then((res) => res)
};

export const getTestCaseDetail = async ({authTokens, projectId, testSuitId, testCaseId}) => {
    return await fetch(`http://127.0.0.1:8000/api/${projectId}/${testSuitId}/detail/${testCaseId}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        },
    }).then((res) => res.json())
};

export const createTestRunResult = async ({authTokens, projectId, testRunId, testCaseId, testRunResultCreate}) => {
    return await fetch(`http://127.0.0.1:8000/api/${projectId}/${testRunId}/${testCaseId}/result/add/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        },
        body: JSON.stringify({
            status: testRunResultCreate.status,
            comment: testRunResultCreate.comment,
            trrDate: testRunResultCreate.trrDate
        })
    }).then((res) => res)
};

export const getTestRunStatus = async ({authTokens}) => {
    return await fetch(`http://127.0.0.1:8000/api/testrun/result/status`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        },
    }).then((res) => res.json())
};