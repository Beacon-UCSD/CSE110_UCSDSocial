# UCSD Social

This is a project where we are developing a web application where UCSD students can create, find and join social/academic events.


## Prerequisites for local deployment (Not for grader)

In order to run this project node.js and npm both need to have been installed.


## Deployment for development (not for grader)

- Local deployment will not work for graders since the database and e3 bucket keys will not be on this public repository
- Graders please refer to below sections
1. Clone this repo
2. Run `npm run installall` from the root directory to install both the backend and frontend.
2. Run `npm run dev` from the root directory to start the backend and frontend.
3. Visit http://localhost:3000/


#### Want to start only the backend or frontend? (Not for grader)

- To only start the backend, you may run `npm run backend` from the root directory.
- To only start the frontend, you may run `npm run frontend` from the root directory.
- You may also run `npm run startclient` from the client directory to only start the frontend.


## Built With

* [React.js](https://reactjs.org/)
* [Express.js](https://expressjs.com/)
* [React-Router](https://reacttraining.com/react-router/core/guides/philosophy)

## Login Credentials (For Graders)

- Tester can access the login page through our hosted URL, ucsdsocial.club
1. The tester can use their own UCSD account credentials to login to the website but they must also have their Duo authentication method ready. Through the login page click on the "Google Sign-in" button and type in your @ucsd.edu account details
2. The tester can also use our two tester accounts which bypasses the Google API login. They are accessed by going to the URL, ucsdsocial.club/loginTester1 and ucsdsocial.club/loginTester2


## Requirements

-Preferably Google Chrome for the choice of web browser to access our website


## Installation Insctructions

- None since it is hosted on ucsdsocial.club

## How to run 

- Using Google Chrome, access the website ucsdsocial.club


## Known Bugs

- If the grader encounters weird output please refer to one of the two below
1. Reclick the "Events" link on the sidebar (after login) to redirect the user to the Event Feed page
2. Close the browser and relog back in since your session may have expired
