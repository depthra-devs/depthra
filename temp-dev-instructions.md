
## for devs (temporary)

### installing requirements :-

to run the project on your local machine you need to install **Node.js** and **npm** on your system

you can download it [here](https://nodejs.org/en/download/).

to verify node installation:-

`node -v` for node.js
`npm -v` for npm

both of which should give their respective versions

---

### preliminary cmd commands :-

to clone the project :-

    git clone https://github.com/depthra-devs/depthra.git

> **Note :** make sure to change the directory to the preffered before cloning, as it will copy all the files and folders to your local.

next to change the folder to where the server file is execute :-

    cd depthra/src/backend

install dependencies :-

    npm init -y
    npm install express
    npm install node-fetch
    npm install cors

---

### Run the server and try out the testing file :-
after dependencies are installed run the server by :-

    node server.js

> **Note :** dont close the cmd window as the server will be up only as long as the cmd window is open.

now open the `testing.html` file in the same folder in your web browser to see the testing. The file is temporary and is only for testing functions and methods