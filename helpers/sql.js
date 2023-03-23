const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.
/**
 * Generates a SQL query for updating a row in a database table with a subset of columns.
 *
 * @param {object} dataToUpdate - An object containing the data to update.
 * The keys are the column names, and the values are the new values for those columns.
 * @param {object} jsToSql - An object mapping JavaScript object keys to their corresponding column names in the SQL table.
 * keys in a JavaScript object may have different naming conventions or formats than the column names in the SQL table, so we need to 
 * change them for the sql query. 
 * @returns {object} An object with two properties: "setCols", which is a string containing the SQL SET clause for the query,
 * and "values", which is an array of the values to update in the table.
 * @throws {BadRequestError} Throws an error if the "dataToUpdate" object is empty.
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
