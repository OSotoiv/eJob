const { sqlForPartialUpdate } = require('./sql');
const { BadRequestError } = require("../expressError");

describe("Returns params for base query for updating a table", () => {
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