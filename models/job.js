"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate, sqlForFiltering } = require("../helpers/sql");

/** Related functions for job model. */

class Job {
    /** Create a job (from data), update db, return new job data.
 *
 * data should be { title, salary, equity, company_handle }
 *
 * Returns { title, salary, equity, company_handle }
 *
 * Throws BadRequestError if company handle doesnt exist.
 * */
    static async create({ title, salary, equity, companyHandle }) {
        //check company handle is valid
        const isCompany = await db.query(`SELECT name FROM companies WHERE handle = $1`, [companyHandle]);
        if (!isCompany.rows[0]) throw new BadRequestError(`Company Handle ${companyHandle} does not exist.`);

        const result = await db.query(
            `INSERT INTO jobs
               (title, salary, equity, company_handle)
               VALUES ($1, $2, $3, $4)
               RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
            [title, salary, equity, companyHandle],
        );
        const job = result.rows[0];
        return job;
    }
    static async findBy(data) {
        const { whereClause, queryValues } = sqlForFiltering(
            data,
            {
                title: { sql: "LOWER(title)", sym: 'LIKE' },
                minSalary: { sql: "salary", sym: '>' },
                hasEquity: {
                    sql: "equity",
                    sym: data.hasEquity === "true" ? '>' : 'IN',
                    val: data.hasEquity === "false" ? ['0', null] : '0'
                }
            })
        const jobsRes = await db.query(
            `SELECT
            id,
            title,
            salary,
            equity,
            company_handle AS "companyHandle"
            FROM jobs
            WHERE ${whereClause}
            ORDER BY title`,
            [...queryValues]);
        if (!jobsRes.rows[0]) { return 'No jobs Found' }
        return jobsRes.rows;
    }
    static async findAll() {
        const jobsRes = await db.query(
            `SELECT
          id,
          title,
          salary,
          equity,
          company_handle AS "companyHandle"
          FROM jobs
          ORDER BY title`);
        return jobsRes.rows;
    }
    static async get(id) {
        const jobRes = await db.query(
            `SELECT id, title, salary, equity, company_handle AS "companyHandle"
                FROM jobs
                WHERE id = $1`, [id]);

        const job = jobRes.rows[0];

        if (!job) throw new NotFoundError(`No job ID of: ${id}`);

        return job;
    }
    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                title: "title",
                salary: "salary",
                equity: "equity"
            });
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE jobs 
                          SET ${setCols} 
                          WHERE id = ${idVarIdx} 
                          RETURNING id, 
                                    title, 
                                    salary, 
                                    equity, 
                                    company_handle AS "companyHandle"`;
        const result = await db.query(querySql, [...values, id]);
        const company = result.rows[0];

        if (!company) throw new NotFoundError(`No Job Found with ID: ${id}`);

        return company;
    }
    static async remove(id) {
        const result = await db.query(`DELETE FROM jobs WHERE id = $1 RETURNING id`, [id]);
        const job = result.rows[0];
        if (!job) throw new NotFoundError(`No Job Found with ID: ${id}`);
    }
}

module.exports = Job