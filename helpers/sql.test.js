const { sqlForPartialUpdate, sqlForFiltering } = require('./sql');
const { BadRequestError } = require("../expressError");

//right now this only test updating a user WRITE TEST FOR UPDATING COMPANIES
describe("Test helper function for make update query sqlForPartialUpdate", () => {
    const dataToUpdate = { firstName: 'Mickey', lastName: "Mouse", email: "mickeyMouse@gmail.com" };
    const jsToSql = { firstName: 'first_name', lastName: "last_name", isAdmin: "is_admin", };

    test('should return setCols and values for partial update', () => {
        const expectedSetCols = '"first_name"=$1, "last_name"=$2, "email"=$3';
        const expectedValues = ['Mickey', 'Mouse', 'mickeyMouse@gmail.com'];

        const { setCols, values } = sqlForPartialUpdate(dataToUpdate, jsToSql);

        expect(setCols).toBe(expectedSetCols);
        expect(values).toEqual(expectedValues);
    });
    test('should throw BadRequestError for empty dataToUpdate object', () => {
        const dataToUpdate = {};
        expect(() => {
            sqlForPartialUpdate(dataToUpdate, jsToSql);
        }).toThrow(BadRequestError);
    });
})
describe("Test helper function for make filterBy query sqlForFiltering", () => {
    //testing with filtering the get /company?name=NAME&minEmployees=99&maxEmployees=100
    const dataToFilterby = { name: 'Mickey', minEmployees: "800", maxEmployees: "900" };
    const jsToSql = {
        name: { sql: "LOWER(name)", sym: 'LIKE' },
        minEmployees: { sql: "num_employees", sym: '>' },
        maxEmployees: { sql: "num_employees", sym: '<' }
    };

    test('should return { whereClause, queryValues } for making query string', () => {
        const expectedWhereCols = `LOWER(name) LIKE $1 AND num_employees > $2 AND num_employees < $3`;
        const expectedValues = ['%Mickey%', '800', '900'];

        const { whereClause, queryValues } = sqlForFiltering(dataToFilterby, jsToSql);

        expect(whereClause).toBe(expectedWhereCols);
        expect(queryValues).toEqual(expectedValues);
    });
    test('should work with only name and minEmployees', () => {
        delete dataToFilterby.maxEmployees;
        const expectedWhereCols = `LOWER(name) LIKE $1 AND num_employees > $2`;
        const expectedValues = ['%Mickey%', '800'];

        const { whereClause, queryValues } = sqlForFiltering(dataToFilterby, jsToSql);

        expect(whereClause).toBe(expectedWhereCols);
        expect(queryValues).toEqual(expectedValues);
    });
    test('should work with only name', () => {
        delete dataToFilterby.minEmployees;
        const expectedWhereCols = `LOWER(name) LIKE $1`;
        const expectedValues = ['%Mickey%'];

        const { whereClause, queryValues } = sqlForFiltering(dataToFilterby, jsToSql);

        expect(whereClause).toBe(expectedWhereCols);
        expect(queryValues).toEqual(expectedValues);
    });

    test('should throw BadRequestError empty dataToFilterby', () => {
        delete dataToFilterby.name;
        expect(() => {
            sqlForFiltering(dataToFilterby, jsToSql);
        }).toThrow(BadRequestError);
    });
})
