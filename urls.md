// request to /jobs not logged in
http://localhost:3001/jobs/

// query jobs by title, minsalary, hasEquity
http://localhost:3001/jobs?title=tech
http://localhost:3001/jobs?title=chief
http://localhost:3001/jobs?title=chief&minSalary=65000

// job routes for creating, updating, deleting are protected by isAdmin middleware

same for users... protected by isAdmin
http://localhost:3001/users

register first 
http://localhost:3001/auth/register

json body
{
"username": "Mickey100",
"firstName": "Mickey",
"lastName": "Mouse",
"password": "mmouse123",
"email": "mmouse@gmail.com"
}

// Now the users route should show a new errow that says you are not Admin
http://localhost:3001/users

// An admin user can update another user to admin but its faster to do it in sql database
psql jobly
SELECT username, is_admin FROM users;
UPDATE users SET is_admin = true WHERE username = 'Mickey100';

// request new token
http://localhost:3001/auth/token

// request to get companies is not protected
http://localhost:3001/companies

// you can query by name, minEmployees, maxEmployees
http://localhost:3001/companies?name=smith
http://localhost:3001/companies?name=smith&minEmployees=900

// if query is wrong the route ignores it and returns all employees
http://localhost:3001/companies?name=smith&Employees=900

// searching jobs by handle give more information about the jobs the company has avalible
http://localhost:3001/companies/scott-smith

// login users can apply for jobs and users information will show applictions and their status
http://localhost:3001/users/Mickey100/jobs/123
http://localhost:3001/users/Mickey100/jobs/155
http://localhost:3001/users/Mickey100/jobs/100

// you can not apply for a job twice

// right now you will need to update the status in psql. No route for this yet
SELECT * FROM applications;

UPDATE applications SET status = 'rejected' WHERE username = 'Mickey100' AND job_id = 123;
UPDATE applications SET status = 'accepted' WHERE username = 'Mickey100' AND job_id = 100;

