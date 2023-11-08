const request = require('request');
const chai = require('chai');
let scheduleId;
let taskId;

describe('API endpoints', function () {
    it('GET /schedules initially', async function () {
        const options = {
            method: 'GET',
            url: 'http://localhost:3000/api/schedules',
        };

        request(options, function (err, response) {
            if (err) {
                return;
            }

            chai.expect(response.statusCode).to.equal(200);
        });

    });

    it('POST /schedules', async function () {
        const options = {
            method: 'POST',
            url: 'http://localhost:3000/api/schedules',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "accountId": 3,
                "agentId": 2,
                "startTime": "2023-11-30T00:00:00.000Z",
                "endTime": "2023-12-30T00:00:00.000Z"
            }),
        };

        request(options, (err, response) => {
            if (err) {
                return;
            }

            chai.expect(response.statusCode).to.equal(201);

            // Store the schedule ID for use in the other test cases
            scheduleId = JSON.parse(response.body).id;
        });
    });

    it('POST /schedules with missing keys', async function () {
        const options = {
            method: 'POST',
            url: 'http://localhost:3000/api/schedules',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "accountId": 3,
                "agentId": 2,
                "endTime": "2023-12-30T00:00:00.000Z"
            }),
        };

        request(options, (err, response) => {
            if (err) {
                return;
            }

            chai.expect(response.statusCode).to.equal(400);

            let res = JSON.parse(response.body);
            chai.expect(res.message).to.equal('startTime is required');

        });
    });

    // Get by ID
    it('GET /schedules/:id', async function () {
        if (scheduleId) {
            const options = {
                method: 'GET',
                url: `http://localhost:3000/api/schedules/${scheduleId}`,
            };

            request(options, function (err, response) {
                if (err) {
                    return;
                }

                chai.expect(response.statusCode).to.equal(200);
                if (!response.body) {
                    chai.expect.fail('Response body is empty');
                }

                for (const schedule of JSON.parse(response.body)) {
                    chai.expect(schedule).to.have.property('id');
                    chai.expect(schedule).to.have.property('accountId');
                    chai.expect(schedule).to.have.property('agentId');
                    chai.expect(schedule).to.have.property('startTime');
                    chai.expect(schedule).to.have.property('endTime');
                }
            });
        }
    });

    it('PUT /schedules/:id', async function () {
        if (scheduleId) {
            const options = {
                method: 'PUT',
                url: `http://localhost:3000/api/schedules/${scheduleId}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "accountId": 10,
                    "agentId": 24,
                    "startTime": "2023-11-30T00:00:00.000Z",
                    "endTime": "2023-12-30T00:00:00.000Z"
                }),
            };

            request(options, function (err, response) {
                if (err) {
                    return;
                }

                chai.expect(response.statusCode).to.equal(200);

                for (const schedule of JSON.parse(response.body)) {
                    chai.expect(schedule).to.have.property('id');
                    chai.expect(schedule).to.have.property('accountId');
                    chai.expect(schedule).to.have.property('agentId');
                    chai.expect(schedule).to.have.property('startTime');
                    chai.expect(schedule).to.have.property('endTime');
                    chai.expect(schedule.accountId).to.equal(10);
                    chai.expect(schedule.agentId).to.equal(24);
                }
            });
        }
    });

    it('DELETE /schedules/:id', async function () {
        if (scheduleId) {
            const options = {
                method: 'DELETE',
                url: `http://localhost:3000/api/schedules/${scheduleId}`,
            };

            request(options, function (err, response) {
                if (err) {
                    return;
                }

                chai.expect(response.statusCode).to.equal(204);
            });
        }
    });

    it('GET /schedules/:id for deleted schedule', async function () {
        if (scheduleId) {
            const options = {
                method: 'GET',
                url: `http://localhost:3000/api/schedules/${scheduleId}`,
            };

            request(options, function (err, response) {
                if (err) {
                    return;
                }

                chai.expect(response.statusCode).to.equal(404);
                let responseMessage = JSON.parse(response.body);
                chai.expect(responseMessage.message).to.equal('Schedule not found');
            });
        }
    });

    it('PUT /schedules/:id for deleted schedule', async function () {
        if (scheduleId) {
            const options = {
                method: 'PUT',
                url: `http://localhost:3000/api/schedules/${scheduleId}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accountId: 2,
                }),
            };

            request(options, function (err, response) {
                if (err) {
                    return;
                }

                chai.expect(response.statusCode).to.equal(404);
                let responseMessage = JSON.parse(response.body);
                chai.expect(responseMessage.message).to.equal('Schedule not found');
            });
        }
    });

    it('DELETE /schedules/:id for deleted schedule', async function () {
        if (scheduleId) {
            const options = {
                method: 'DELETE',
                url: `http://localhost:3000/api/schedules/${scheduleId}`,
            };

            request(options, function (err, response) {
                if (err) {
                    return;
                }

                chai.expect(response.statusCode).to.equal(204);
            });
        }
    });

    it('Create a Schedule and associate a Task', async function () {
        const scheduleData = {
            "accountId": 456,
            "agentId": 2,
            "startTime": "2023-11-30T00:00:00.000Z",
            "endTime": "2023-12-30T00:00:00.000Z"
        };

        const taskData = {
            "accountId": 3,
            "startTime": "2023-12-01T08:00:00.000Z",
            "duration": 120,
            "type": "break"
        };

        // POST the schedule
        const postScheduleOptions = {
            method: 'POST',
            url: 'http://localhost:3000/api/schedules',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(scheduleData),
        };

        request(postScheduleOptions, function (err, scheduleResponse) {
            if (err) {
                return;
            }

            chai.expect(scheduleResponse.statusCode).to.equal(201);

            // Store the schedule ID for use in other test cases
            scheduleId = JSON.parse(scheduleResponse.body).id;

            // POST the task associated with the schedule
            taskData.scheduleId = scheduleId;
            const postTaskOptions = {
                method: 'POST',
                url: 'http://localhost:3000/api/tasks',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            };

            request(postTaskOptions, function (taskErr, taskResponse) {
                if (taskErr) {
                    return;
                }

                chai.expect(taskResponse.statusCode).to.equal(201);

                // Store the task ID for use in other test cases
                taskId = JSON.parse(taskResponse.body).id;
            });
        });
    });

    it('POST /tasks with missing keys', function () {
        const taskWithMissingKeys = {
            startTime: "2023-12-01T08:00:00.000Z",
            duration: 120,
            type: "work"
        };

        const postTaskOptions = {
            method: 'POST',
            url: 'http://localhost:3000/api/tasks',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskWithMissingKeys),
        };

        request(postTaskOptions, function (taskErr, response) {
            if (taskErr) {
                return;
            }

            chai.expect(response.statusCode).to.equal(400);

            let res = JSON.parse(response.body);
            chai.expect(res.message).to.equal('accountId is required');
        });
    });

    it('PUT /tasks/:id', async function () {
        // Ensure you have a valid task ID to update
        if (taskId) {
            const updatedTaskData = {
                "accountId": 4,
                "startTime": "2023-12-01T09:00:00.000Z",
                "duration": 180,
                "type": "break"
            };

            const putTaskOptions = {
                method: 'PUT',
                url: `http://localhost:3000/api/tasks/${taskId}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTaskData),
            };

            request(putTaskOptions, function (err, response) {
                if (err) {
                    return;
                }

                chai.expect(response.statusCode).to.equal(200);

                for (task in JSON.parse(response.body)) {
                    chai.expect(task.duration).to.equal(180);
                    chai.expect(task.accountId).to.equal(4);
                }
            });
        }
    });

    it('PUT /tasks/:id with wrong type', async function () {
        // Ensure you have a valid task ID to update
        if (taskId) {
            const updatedTaskData = {
                "accountId": 4,
                "startTime": "2023-12-01T09:00:00.000Z",
                "duration": 180,
                "type": "Updated Task Type"
            };

            const putTaskOptions = {
                method: 'PUT',
                url: `http://localhost:3000/api/tasks/${taskId}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTaskData),
            };

            request(putTaskOptions, function (err, response) {
                if (err) {
                    return;
                }

                chai.expect(response.statusCode).to.equal(404);

                let res = JSON.parse(response.body);
                chai.expect(res.message).to.equal('Type can either be \'work\' or \'break\'');
            });
        }
    });

    it('GET Schedule to Verify assoiated Task', async function () {
        if (scheduleId && taskId) {
            const getScheduleOptions = {
                method: 'GET',
                url: `http://localhost:3000/api/schedules/${scheduleId}`,
            };

            request(getScheduleOptions, function (err, response) {
                if (err) {
                    return;
                }

                chai.expect(response.statusCode).to.equal(200);

                const schedule = JSON.parse(response.body);
                chai.expect(schedule).to.have.property('id');
                chai.expect(schedule).to.have.property('accountId');
                chai.expect(schedule).to.have.property('agentId');
                chai.expect(schedule).to.have.property('startTime');
                chai.expect(schedule).to.have.property('endTime');

                const associatedTasks = schedule.tasks;
                const associatedTaskIds = associatedTasks.map((task) => task.id);
                chai.expect(associatedTaskIds).to.include(taskId);
            });
        }
    });

    it('DELETE Schedule with Associated Task', async function () {
        if (scheduleId) {
            const deleteScheduleOptions = {
                method: 'DELETE',
                url: `http://localhost:3000/api/schedules/${scheduleId}`,
            };

            request(deleteScheduleOptions, function (err, response) {
                if (err) {
                    return;
                }

                chai.expect(response.statusCode).to.equal(200);
                chai.expect(response.body).to.equal('Delete the associated tasks first to delete the schedule');
            });
        }
    });

    it('DELETE Tasks and Schedule', async function () {
        if (taskId && scheduleId) {
            const deleteTaskOptions = {
                method: 'DELETE',
                url: `http://localhost:3000/api/tasks/${taskId}`,
            };

            request(deleteTaskOptions, function (taskErr, taskResponse) {
                if (taskErr) {
                    return;
                }

                chai.expect(taskResponse.statusCode).to.equal(204);

                const deleteScheduleOptions = {
                    method: 'DELETE',
                    url: `http://localhost:3000/api/schedules/${scheduleId}`,
                };

                request(deleteScheduleOptions, function (scheduleErr, scheduleResponse) {
                    if (scheduleErr) {
                        return;
                    }

                    chai.expect(scheduleResponse.statusCode).to.equal(204);
                });
            });
        }
    });
})
