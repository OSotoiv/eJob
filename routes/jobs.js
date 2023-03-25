"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, isAdmin } = require("../middleware/auth");
const Job = require("../models/job");

const jobNewSchema = require("../schemas/jobNew.json");
const jobFilterSchema = require("../schemas/jobFilter.json")
const jobUpdateSchema = require("../schemas/jobUpdate.json");
const { json } = require("body-parser");

const router = new express.Router();

router.post("/", ensureLoggedIn, isAdmin, async function (req, res, next) {
    try {
        //check database  return 401 for not admin. research firebase for checking user roles ORM  
        const validator = jsonschema.validate(req.body, jobNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const job = await Job.create(req.body);
        return res.status(201).json({ job });
    } catch (err) {
        return next(err);
    }
});

router.get("/", async function (req, res, next) {
    try {
        if (req.query.hasEquity === "false") {
            //defaulting to deleting here until I work out IN operator for db.query
            delete req.query.hasEquity
        }
        if (Object.keys(req.query).length > 0) {
            const validator = jsonschema.validate(req.query, jobFilterSchema);
            if (!validator.valid) {
                return next()
            }
            const jobs = await Job.findBy(req.query);
            return res.json({ jobs });
        } return next()
    } catch (err) {
        return next(err);
    }
});
router.get("/", async function (req, res, next) {
    try {
        const jobs = await Job.findAll();
        return res.json({ jobs });
    } catch (err) {
        return next(err);
    }
});
router.get("/:id", async function (req, res, next) {
    try {
        const job = await Job.get(req.params.id);
        return res.json({ job });
    } catch (err) {
        return next(err);
    }
});
router.patch("/:id", ensureLoggedIn, isAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, jobUpdateSchema);
        console.dir(validator)
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const job = await Job.update(req.params.id, req.body);
        return res.json({ job });
    } catch (err) {
        return next(err);
    }
});
router.delete("/:id", ensureLoggedIn, isAdmin, async function (req, res, next) {
    try {
        await Job.remove(req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;