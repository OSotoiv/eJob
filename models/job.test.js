"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const { findAll } = require("./job.js");
const Job = require("./job.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("./_testCommon");
//you dont need a token because only routes verify user not models
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**********************************************Job.create() */
describe("create new job", function () {
    const testJob = {
        title: "Job Tester",
        salary: 100000,
        equity: .99,
        companyHandle: 'c1'
    }
    test("works", async function () {
        const job = await Job.create(testJob);
        expect(job).toEqual({
            id: expect.any(Number),
            title: "Job Tester",
            salary: 100000,
            equity: "0.99",
            companyHandle: 'c1'
        });
        const result = await db.query(`
        SELECT id,title,salary,equity,company_handle AS "companyHandle"
         FROM jobs WHERE id = $1`, [job.id]);
        expect(result.rows[0]).toEqual({
            id: job.id,
            title: "Job Tester",
            salary: 100000,
            equity: "0.99",
            companyHandle: 'c1'
        })
    })
    test("bad requet when company does not exitst", async function () {
        try {
            const job = await Job.create({ ...testJob, companyHandle: 'c4' });
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    })
})
/**********************************************Job.findBy() */
describe("find Job by query", function () {
    test("find with title & minSalary", async function () {
        const jobs = await Job.findBy({ title: 'j', minSalary: 450 });
        expect(jobs).toEqual([
            {
                id: expect.any(Number),
                title: "job2",
                salary: 456,
                equity: "0.5",
                companyHandle: 'c2'
            },
            {
                id: expect.any(Number),
                title: "job3",
                salary: 789,
                equity: null,
                companyHandle: 'c3'
            }
        ])
    });
    test("find with only hasEquity=true", async function () {
        const jobs = await Job.findBy({ hasEquity: 'true' });
        expect(jobs).toEqual([
            {
                id: expect.any(Number),
                title: "job2",
                salary: 456,
                equity: "0.5",
                companyHandle: 'c2'
            }
        ])
    })
    // test("find with only hasEquity=false")
    //>>>>Route to GET/jobs?hasEquity=false will remove hasEquity
    //resulting in hitting the next() route which returns Job.findAll()
})
/**********************************************Job.findAll() */
describe("find all Jobs no query", function () {
    test("returns all jobs ORDERED by title", async function () {
        const jobs = await Job.findAll();
        expect(jobs).toEqual([
            {
                id: expect.any(Number),
                title: "job1",
                salary: 123,
                equity: "0",
                companyHandle: 'c1'
            },
            {
                id: expect.any(Number),
                title: "job2",
                salary: 456,
                equity: "0.5",
                companyHandle: 'c2'
            },
            {
                id: expect.any(Number),
                title: "job3",
                salary: 789,
                equity: null,
                companyHandle: 'c3'
            }
        ])
    })
})
/**********************************************Job.get() */
describe("get a job by id", function () {
    test("Job.get(valid id)", async function () {
        const { rows: jobIDs } = await db.query(`SELECT id FROM jobs;`)
        for (const { id } of jobIDs) {
            const job = await Job.get(id);
            expect(job).toHaveProperty('id', id);
            expect(job).toHaveProperty('title', expect.any(String));
            expect(job).toHaveProperty('salary', expect.any(Number));
            expect(job).toHaveProperty('companyHandle', expect.any(String));
        }
    })
    test("Job.get(!valid id)", async function () {
        try {
            await Job.get('0');
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
            expect(err.message).toBe('No job ID of: 0')
        }
    })
})
/**********************************************Job.update() */
describe("update a job (title,salary,equity)ONLY", function () {
    const data = { title: 'Updated Job', salary: 100000, equity: 0.2 }
    test("Job.update(validID, validDATA)", async function () {
        const { rows: jobIDs } = await db.query(`SELECT id FROM jobs;`);
        for (const { id } of jobIDs) {
            const job = await Job.update(id, data);
            expect(job).toEqual({
                id: id,
                title: 'Updated Job',
                salary: 100000,
                equity: '0.2',
                companyHandle: expect.any(String)
            },)
        }
    });
    test("Job.update(invalidID, validDATA)", async function () {
        try {
            await Job.update(0, data);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
            expect(err.message).toBe('No Job Found with ID: 0')
        }
    })
    //Testing with invalid data should never happen since the route
    //to PATCH/jobs/:id will validate the req.body
})
/**********************************************Job.delete() */
describe("remove job", function () {
    test("Job.remove(Valid ID)", async function () {
        const { rows: jobIDs } = await db.query(`SELECT id FROM jobs;`);
        for (const { id } of jobIDs) {
            await Job.remove(id);
            const res = await db.query("SELECT id FROM jobs WHERE id = $1", [id]);
            expect(res.rows.length).toEqual(0);
        }
    });

    test("Job.remove(Invalid ID)", async function () {
        try {
            await Job.remove(0);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
            expect(err.message).toBe('No Job Found with ID: 0')
        }
    });
});