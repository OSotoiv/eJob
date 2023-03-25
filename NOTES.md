### #001
    The function first checks if the request contains an authorization header. If it does, it extracts the JWT from the header, removes the "Bearer " prefix, and verifies it using the jwt.verify() method with the SECRET_KEY variable. If the token is valid, the function sets the res.locals.user property to the decoded payload of the token, which can then be accessed by subsequent middleware functions or route handlers. Finally, the function calls the next() function to pass control to the next middleware function in the request-response cycle.

    If the token is invalid or missing, the function catches any errors thrown by the jwt.verify() method and simply calls the next() function without setting any user information in res.locals.user.

    Note: jwt.verify() method is used to decode and verify a JWT using the secret key. The SECRET_KEY variable is not shown in the code provided and should be defined elsewhere in the codebase.

    In the context of HTTP authentication, "Bearer" is a type of authentication scheme that is used to authenticate requests using a bearer token, such as a JSON Web Token (JWT).

    The format for a "Bearer" token authentication scheme is as follows:
```
Authorization: Bearer <token>
```
    The <token> in the above format refers to the actual token being used for authentication, such as a JWT. The word "Bearer" is used to indicate that the token being used is a bearer token, which means that it can be used to gain access to resources without presenting any additional credentials.

    When a client sends a request to a server with an "Authorization" header containing a "Bearer" token, the server can use the token to authenticate the request and authorize the client to access the requested resources. The server can decode and verify the token, extract the user information from the token's payload, and use that information to process the request.

    In summary, "Bearer" is a type of authentication scheme that uses bearer tokens, such as JWTs, to authenticate and authorize requests in HTTP-based applications.
    To set the Authorization header in Insomnia, you can follow these steps:

    Open Insomnia and create a new request or open an existing request.
    In the request editor, click on the "Headers" tab to view the request headers.
    Click the "Add Header" button to add a new header.
    In the "Header Name" field, enter "Authorization" (without the quotes).
    In the "Header Value" field, enter the value of the Authorization header in the format Bearer <token> (without the quotes), where <token> is the actual JWT or bearer token you want to use for authentication.
    Click the "Save" button to save the header.
    After setting the Authorization header, you can send the request to the server. The server will check the Authorization header and authenticate the request based on the contents of the bearer token.


## Question? What happens when you delete a user, does the token still work?



### #002
    console.assert() is a method provided by the JavaScript Console API that is used for debugging and testing. It takes a single expression as its first parameter and an optional message as its second parameter.

    The console.assert() method evaluates the expression and checks if it is true or false. If the expression is true, nothing happens and the method returns undefined. If the expression is false, an error message is logged to the console, along with the optional message parameter (if provided).

    For example, consider the following code:
```js
let x = 5;
console.assert(x === 10, "x is not equal to 10");

```
    In this code, the console.assert() method is used to check if the variable x is equal to 10. Since x is not equal to 10, the method logs an error message to the console, along with the optional message "x is not equal to 10".

    console.assert() is often used in development and testing to ensure that certain conditions are met during the execution of the code. If an assertion fails, it can help the developer identify the cause of the error and fix it more quickly.

### #003
    Our User model never returns a User instance. As in the case with User.register, It returns an object with user credentials.
    

### Part Four: JOBS
#### Our database uses the NUMERIC field type. Do some research on why we chose this, rather than a FLOAT type. Discover what the pg library returns when that field type is queried, and form a theory on why.


    The NUMERIC data type is often used for storing decimal values with a high degree of precision and accuracy. In the case of the jobs table, the equity column is defined as NUMERIC with a CHECK constraint that ensures the equity value is less than or equal to 1.0. This suggests that the equity value is being stored as a decimal value between 0 and 1, which is a common way to represent equity percentages in finance and accounting.

    Using the NUMERIC data type allows for precise and accurate storage of decimal values, which is important for financial calculations and reporting. It ensures that the equity values are stored and manipulated accurately and consistently, without any loss of precision due to rounding errors or other issues that can arise when using other data types, such as FLOAT or DOUBLE.

    Overall, the use of the NUMERIC data type for the equity column in the jobs table is a good choice, as it provides a high degree of precision and accuracy for storing and manipulating equity values, which is important for financial and accounting purposes.
    FLOAT is a data type that can be used to store decimal numbers with a certain degree of precision. However, FLOAT has some limitations that make it less suitable for storing monetary values, such as equity percentages.

    One major issue with FLOAT is that it can suffer from rounding errors due to the way that it stores numbers. This can lead to inconsistencies in financial calculations and reporting, which can be a serious problem in accounting and finance applications.

    In contrast, the NUMERIC data type is designed specifically for storing decimal numbers with a high degree of precision and accuracy, without the risk of rounding errors or other issues. This makes it a better choice for storing monetary values like equity percentages, which require a high degree of accuracy and consistency in financial calculations and reporting.

    Overall, while FLOAT may be suitable for some applications that do not require a high degree of precision or consistency in financial calculations, the NUMERIC data type is a better choice for storing monetary values like equity percentages, which require a high degree of precision and consistency in financial reporting and analysis.

#### PG and NUMERIC data type
    When using pg, you can interact with NUMERIC columns in the same way that you would interact with other numeric columns, such as INTEGER or FLOAT.
    One thing to note is that NUMERIC values in PostgreSQL can have a high degree of precision and can be represented using a large number of digits. This means that NUMERIC values can take up more space in the database and may require more processing power to manipulate than other numeric data types.