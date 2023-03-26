"use strict";

const request = require("supertest");
const db = require("../db")
const app = require("../app");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u2Token

} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************ POST /jobs */
describe("POST /jobs", function () {
    const newJob = {
        title: "Job Tester",
        salary: 777,
        equity: 0.5,
        companyHandle: "c1"
    };

    test("ok for users with is_admin = true", async function () {
        const resp = await request(app)
            .post("/jobs")
            .send(newJob)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body.job).toEqual(expect.objectContaining(
            {
                id: expect.any(Number),
                title: "Job Tester",
                salary: 777,
                equity: "0.5",
                companyHandle: "c1"
            },
        ));
    });
    test("not ok for users with is_admin = false", async function () {
        const resp = await request(app)
            .post("/jobs")
            .send(newJob)
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toEqual(401);
    });

    test("bad request with missing data", async function () {
        const resp = await request(app)
            .post("/jobs")
            .send({
                title: "new",
                salary: 10,
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(400);
    });

    test("bad request with invalid data", async function () {
        const resp = await request(app)
            .post("/jobs")
            .send({
                ...newJob,
                equity: 2,
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(400);
    });
});

/************************************ GET /jobs */
describe("GET /jobs", function () {
    test("ok for anon get all jobs", async function () {
        const resp = await request(app).get("/jobs");
        expect(resp.body).toEqual({
            jobs:
                [
                    {
                        id: expect.any(Number),
                        title: "job1",
                        salary: 123,
                        equity: '0',
                        companyHandle: "c1"
                    },
                    {
                        id: expect.any(Number),
                        title: "job2",
                        salary: 456,
                        equity: '0.5',
                        companyHandle: "c2"
                    },
                    {
                        id: expect.any(Number),
                        title: "job3",
                        salary: 789,
                        equity: '1',
                        companyHandle: "c3"
                    }
                ],
        });
    });

    test("fails: test next() handler", async function () {
        // there's no normal failure event which will cause this route to fail ---
        // thus making it hard to test that the error-handler works with it. This
        // should cause an error, all right :)
        await db.query("DROP TABLE jobs CASCADE");
        const resp = await request(app)
            .get("/jobs")
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(500);
    });
});
/************************************ GET /jobs?... with query(title,minSalary,hasEquity) */
describe("GET /jobs with query", function () {
    test("ok for anon", async function () {
        const resp = await request(app).get("/jobs?title=j&minSalary=400");
        expect(resp.body).toEqual({
            jobs:
                [
                    {
                        id: expect.any(Number),
                        title: "job2",
                        salary: 456,
                        equity: '0.5',
                        companyHandle: "c2"
                    },
                    {
                        id: expect.any(Number),
                        title: "job3",
                        salary: 789,
                        equity: '1',
                        companyHandle: "c3"
                    }
                ],
        });
    });
    test("ok for anon", async function () {
        //hasEquity set to true gets all jobs with equity > 0
        const resp = await request(app).get("/jobs?hasEquity=true");
        expect(resp.body).toEqual({
            jobs:
                [
                    {
                        id: expect.any(Number),
                        title: "job2",
                        salary: 456,
                        equity: '0.5',
                        companyHandle: "c2"
                    },
                    {
                        id: expect.any(Number),
                        title: "job3",
                        salary: 789,
                        equity: '1',
                        companyHandle: "c3"
                    }
                ],
        });
    });
    test("ok for anon", async function () {
        //hasEquity set to false defaults to get all
        const resp = await request(app).get("/jobs?hasEquity=false");
        expect(resp.body).toEqual({
            jobs:
                [
                    {
                        id: expect.any(Number),
                        title: "job1",
                        salary: 123,
                        equity: '0',
                        companyHandle: "c1"
                    },
                    {
                        id: expect.any(Number),
                        title: "job2",
                        salary: 456,
                        equity: '0.5',
                        companyHandle: "c2"
                    },
                    {
                        id: expect.any(Number),
                        title: "job3",
                        salary: 789,
                        equity: '1',
                        companyHandle: "c3"
                    }
                ],
        });
    });
    test("defaults to gets all with invalid query", async function () {
        const resp = await request(app).get("/jobs?names=c&minEmployees=2");
        expect(resp.body).toEqual({
            jobs:
                [
                    {
                        id: expect.any(Number),
                        title: "job1",
                        salary: 123,
                        equity: '0',
                        companyHandle: "c1"
                    },
                    {
                        id: expect.any(Number),
                        title: "job2",
                        salary: 456,
                        equity: '0.5',
                        companyHandle: "c2"
                    },
                    {
                        id: expect.any(Number),
                        title: "job3",
                        salary: 789,
                        equity: '1',
                        companyHandle: "c3"
                    }
                ],
        });
    })
    // test("failes with invalid minEmployees > maxEmployees", async function () {
    //     const resp = await request(app).get("/companies?name=c&minEmployees=2&maxEmployees=1");
    //     expect(resp.statusCode).toEqual(400);
    //     expect(resp.body.error.message).toBe('minEmployees and not be greater than maxEmployees');
    // })
});

/************************************ GET /jobs/:id */
describe("GET /jobs/:id", function () {
    test("works for anon", async function () {
        const { rows: jobIDs } = await db.query(`SELECT id FROM jobs;`)
        for (const { id } of jobIDs) {
            const resp = await request(app).get(`/jobs/${id}`);
            expect(resp.body).toEqual({
                job: {
                    id: id,
                    title: expect.any(String),
                    salary: expect.any(Number),
                    equity: expect.any(String),
                    companyHandle: expect.any(String)
                }
            });
        }
    });
    test("No Job with invalid id", async function () {
        const resp = await request(app).get(`/job/0`);
        expect(resp.statusCode).toEqual(404);
    });
});

/************************************ PATCH /jobs/:id */
describe("PATCH /jobs/:id", function () {
    test("works for Admin users", async function () {
        const { rows: jobIDs } = await db.query(`SELECT id FROM jobs;`)
        for (const { id } of jobIDs) {
            const resp = await request(app)
                .patch(`/jobs/${id}`)
                .send({
                    title: "Patch Job",
                })
                .set("authorization", `Bearer ${u1Token}`);
            expect(resp.body).toEqual({
                job: {
                    id: expect.any(Number),
                    title: "Patch Job",
                    salary: expect.any(Number),
                    equity: expect.any(String),
                    companyHandle: expect.any(String)
                },
            });
        }
    });
    test("unauth for user with isAdmin = false", async function () {
        const { rows: jobIDs } = await db.query(`SELECT id FROM jobs;`)
        for (const { id } of jobIDs) {
            const resp = await request(app)
                .patch(`/jobs/${id}`)
                .send({
                    title: "Patch Job",
                })
                .set("authorization", `Bearer ${u2Token}`);
            expect(resp.statusCode).toEqual(401)
        }
    })

    test("unauth for anon", async function () {
        const { rows: jobIDs } = await db.query(`SELECT id FROM jobs;`)
        for (const { id } of jobIDs) {
            const resp = await request(app)
                .patch(`/jobs/${id}`)
                .send({
                    title: "Patch Job",
                });
            expect(resp.statusCode).toEqual(401);
        }
    });

    test("not found: job with id 0", async function () {
        //No jobs with id of 0
        const resp = await request(app)
            .patch(`/jobs/0`)
            .send({
                title: "Patch Job",
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toEqual('No Job Found with ID: 0')
    });

    test("bad request from json schema validation", async function () {
        //can not update companyHandle
        const { rows: jobIDs } = await db.query(`SELECT id FROM jobs;`)
        for (const { id } of jobIDs) {
            const resp = await request(app)
                .patch(`/jobs/${id}`)
                .send({
                    companyHandle: "c2",
                })
                .set("authorization", `Bearer ${u1Token}`);
            expect(resp.statusCode).toEqual(400);
        }
    });

    test("bad request on invalid data", async function () {
        const { rows: jobIDs } = await db.query(`SELECT id FROM jobs;`)
        for (const { id } of jobIDs) {
            const resp = await request(app)
                .patch(`/jobs/${id}`)
                .send({
                    salary: "100000",
                    equity: "not-a-number",
                })
                .set("authorization", `Bearer ${u1Token}`);
            expect(resp.statusCode).toEqual(400);
            expect(resp.body.error.message).toEqual([
                'instance.salary is not of a type(s) integer',
                'instance.equity is not of a type(s) number'
            ])
        }
    });
});

/************************************ DELETE /jobs/:id */

describe("DELETE /jobs/:id", function () {
    test("works for users with isAdmin = true", async function () {
        const { rows: jobIDs } = await db.query(`SELECT id FROM jobs;`)
        for (const { id } of jobIDs) {
            const resp = await request(app)
                .delete(`/jobs/${id}`)
                .set("authorization", `Bearer ${u1Token}`);
            expect(resp.body).toEqual({ deleted: `${id}` });
        }
    });
    test("unauth for users with isAdmin = false", async function () {
        const resp = await request(app)
            .delete(`/jobs/0`)
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.error.message).toBe('You are not an Admin')
    });

    test("unauth for anon", async function () {
        const resp = await request(app)
            .delete(`/jobs/0`);
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.error.message).toBe('Unauthorized')
    });

    test("not found for no such company", async function () {
        const resp = await request(app)
            .delete(`/jobs/0`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(404);
    });
});