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
    `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate)
  };
}

/**
 * @param {object} dataToFilterby - An object containing the data to update.
 * The keys are the column names, and the values are the new values for those columns.
 * @param {object} jsToSql - An object mapping JavaScript object keys to their corresponding column names in the SQL table.
 * keys in a JavaScript object may have different naming conventions or formats than the column names in the SQL table, so we need to 
 * change them for the sql query. Also on each object is the symbol used to evaluate the col and data val (<,>,=)
 * @returns {object} An object with two properties: "whereClause", which is a string containing the SQL WHERE clause for the query,
 * and "queryValues", which is an array of the values to query by in the table.
 * @throws {BadRequestError} Throws an error if the "dataToUpdate" object is empty.
 */

function sqlForFiltering(dataToFilterby, jsToSql) {
  if (Object.keys(dataToFilterby).length === 0) throw new BadRequestError("No Data To Filter By");
  // Construct the WHERE clause based on the input parameters
  // const keys = Object.keys(dataToFilterby);
  // if (keys.length === 0) throw new BadRequestError("No Query");
  // const whereCol = keys.map((colName, idx) => {
  //   const symbol = jsToSql[colName] ? jsToSql[colName].sym : "=";
  //   const col = jsToSql[colName] ? jsToSql[colName].sql : colName
  //   return `${col} ${symbol} $${idx + 1}`
  // });
  const whereCol = [];
  const queryValues = [];
  for (const [idx, [colName, val]] of Object.entries(dataToFilterby).entries()) {
    const symbol = jsToSql[colName] ? jsToSql[colName].sym : "=";
    const col = jsToSql[colName] ? jsToSql[colName].sql : colName;
    whereCol.push(`${col} ${symbol} $${idx + 1}`);
    queryValues.push(symbol === 'LIKE' ? `%${val}%` : val);
  }

  return {
    whereClause: whereCol.join(" AND "),
    queryValues: queryValues
  }
}

// Object.values(dataToFilterby)
module.exports = { sqlForPartialUpdate, sqlForFiltering };
