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
    