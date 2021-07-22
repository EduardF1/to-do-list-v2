# After downloading/cloning the project
- Run `npm i` or `npm install` to install the node modules (dependencies).
- Run the mongoDB server `mongod` in a separate shell.
- Open the mongo shell, run `mongo` in a separate shell.
- Navigate (use `cd`) to the app.js location and run `node app.js`.

# How to deploy Web Apps that have DBs
- Differences between a workstation and a server:
1) A server is online 24/7.
2) Depending on the ISP, it might not be allowed to serve the application from the local address.
    - The solution is to use Heroku for deploying the web server, and the database on MongoDB's cloud solution, Atlas. 

```
LOCAL STATION                  HEROKU             MongoDB's Atlas
     |                           |                       |
     *-------DEPLOY-WEB-SERVER-->*-------DEPLOY-DB------>*
                                 |                       |
               https://appName.herokuapp.com/      mongodb://cluster0.mongodb.net:27017               
```
- Users will interact with the Web App deployed on Heroku which will conduct `C.R.U.D` operations with the MongoDB Atlas cloud
behind the scenes. This eliminates the need for the app being hosted locally.