# Bug List 🦋

## Access to XMLHttpRequest at 'http://localhost:4000/' from origin 'http://localhost:8000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

This error appeared while making a request with axios, by validating a form in the login page. It is due to the front-end and back-end being accessed on different urls. To solve this, using cors is needed to say it allows this request.

I therefore added this code in the back end:

```Javascript
const cors = require("cors");

const corsOptions = {
  origin: true,
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
```

## xhr.js:187 POST http://localhost:4000/ 400 (Bad Request)

I didn't format the request properly, it worked with this one:

```JavaScript
const result = await axios({
    url: process.env.GATSBY_API,
    method: "post",
    data: {
      query: `mutation {
      createUser(user: {email: "email", password: "password"}){
        email
      }
    }
      `
    },
  })
```

## Use dynamic values in a graphQl mutation

dynamic values can not directly be used inside a graphQl query, they need to be stocked inside variables, in the axios request, like so:

```Javascript
const result = await axios({
    url: process.env.GATSBY_API,
    method: "post",
    data: {
      query: `mutation createUser($email: String!, $password: String!) {
      createUser(user: {email: $email, password: $password}){
        email
      }
    }
      `,
      variables: {
        email: email,
        password: password,
      },
    },
  })
```
