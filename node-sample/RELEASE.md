# Node.js Sample App for the AT&T Enhanced WebRTC JavaScript SDK

This sample app is a Node.js Web application for demonstrating the features of AT&T Enhanced WebRTC, and includes the following functionality:
* User management
* OAuth endpoint for Mobile Number authorization and callback
* Login and logout functionality for Virtual Number and Account ID users

## v1.0.0
December 7, 2014

* **New:** Step-by-step sample applications (Recipes) link in the main sample application.
This is a set of simple examples including code snippets. Just launch the main
NodeJS sample application and go to https://127.0.0.1:9001/recipes/

* **Features:**
  * RESTful API:
    * `/users` - User management
    * `/login` & `/logout` - Authentication (session management)
    * `/oauth/authorize` - Device authorization
    * `/oauth/callback` - Redirection to the sample app

### Known Issues

* Error Registering Users (HTTP 409) - `POST https://127.0.0.1:9001/users 409 (Conflict)`
  * **Workaround:** Delete the file `/node-sample/users.json` and restart the sample app.
