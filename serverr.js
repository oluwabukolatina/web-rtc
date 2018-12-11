// Load required modules
var http = require("http"); // http server core module
var express = require("express"); // web framework external module
var serveStatic = require('serve-static'); // serve static files
var socketIo = require("socket.io"); // web socket external module

// This sample is using the easyrtc from parent folder.
// To use this server_example folder only without parent folder:
// 1. you need to replace this "require("../");" by "require("easyrtc");"
// 2. install easyrtc (npm i easyrtc --save) in server_example/package.json
const easyrtc = require("easyrtc");

/* var easyrtc = require("../"); // EasyRTC internal module */

// Set process name
//process.title = "node-easyrtc";

// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var app = express();
/* app.use (serveStatic ('static', {index: ['index.html']})); */


//Statically serve files in these directories
/* app.use('/js', express.static(__dirname + '/easyrtc/js'));
app.use('/images', express.static(__dirname + '/easyrtc/images'));
app.use('/css', express.static(__dirname + '/easyrtc/css')); */


// Start Express http server on port 8080
var webServer = http.createServer(app.listen(8080));

// Start Socket.io so it attaches itself to Express server
var socketServer = socketIo.listen(webServer, {
    'log level': 1
});

//start easy rtc server
const rtc = easyrtc.listen(app, socketServer);



/* app.use(serveStatic('static', {'index': ['index.html']}));




easyrtc.setOption("logLevel", "debug");

// Overriding the default easyrtcAuth listener, only so we can directly access its callback
easyrtc.events.on("easyrtcAuth", function(socket, easyrtcid, msg, socketCallback, callback) {
    easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function(err, connectionObj){
        if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
            callback(err, connectionObj);
            return;
        }

        connectionObj.setField("credential", msg.msgData.credential, {"isShared":false});

        console.log("["+easyrtcid+"] Credential saved!", connectionObj.getFieldValueSync("credential"));

        callback(err, connectionObj);
    });
});

// To test, lets print the credential to the console for every room join!
easyrtc.events.on("roomJoin", function(connectionObj, roomName, roomParameter, callback) {
    console.log("["+connectionObj.getEasyrtcid()+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
});

// Start EasyRTC server
var rtc = easyrtc.listen(app, socketServer, null, function(err, rtcRef) {
    console.log("Initiated");

    rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
        console.log("roomCreate fired! Trying to create: " + roomName);

        appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
    });
});

// Listen on port 8080
webServer.listen(8080, function () {
    console.log('listening on http://localhost:8080');
}); */
app.use(express.bodyParser());

const loggedIn = false,
    password = 'password';

//home page
app.get('/', (req, res) => {

    res.send('welcome');

});

//serve static page if not logged
app.get('/login', (req, res) => {
    console.log('login attempted');
    if (loggedIn == true) {
        res.send('allready login')
    } else {
        res.sendfile(__dirname + '/public/login.html');
    }

})

app.post('/login', function (req, res) {
    console.log('post to /login');
    if (loggedIn == true) {
        res.send('Already logged in.');
    } else {
        console.log('Posted data:' + JSON.stringify(req.body));
        if (req.body.pw == password) {
            loggedIn = true;
            res.send('You are logged in.');

            //start rtc server
            const easyrtcServer = easyrtc.listen(app, socketIo)
        } else {
            res.send('Incorrect password.');
        }
    }
});

//Serve a static logout page
app.get('/logout', function (req, res) {
    res.sendfile(__dirname + '/public/logout.html');
});

app.post('/logout', function (req, res) {
    console.log('Posted data:' + JSON.stringify(req.body));
    if (req.body.pw == password) {
        if (loggedIn == true) {
            loggedIn = false;
            res.send('Logged out');
            console.log('logged out');

            //Consider killing all active sessions here
            easyrtc.setOption('apiEnable', 'false');
        } else {
            res.send('You were already logged out');
            console.log('Attempt to logout when not logged in');
        }
    } else {
        console.log('Bad password attempt');
        res.send('Incorrect password');
    }
});

//Initiate a call
app.get('/call', function (req, res) {

    if (loggedIn == true) {
        res.send('Starting call');
    } else {
        res.send('I no dey. Please try later.');
    }
});

// Start server on port 8080
app.listen(8080);
console.log('Listening on port ' + 8080);