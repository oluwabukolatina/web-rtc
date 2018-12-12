// Load required modules
var http = require("http"); // http server core module
var express = require("express"); // web framework external module
var app = express();
var serveStatic = require('serve-static'); // serve static files
var socketIo = require("socket.io"); // web socket external module
const easyrtc = require("easyrtc");
var bodyParser = require('body-parser')


//process name
process.title = require("easyrtc");
// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var app = express();

app.use(serveStatic('static', {'index': ['index.html']}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//Statically serve files in these directories
app.use("/js", express.static(__dirname + '/demos/js'));
app.use("/images", express.static(__dirname + '/demos/images'));
app.use("/css", express.static(__dirname + '/demos/css'));

var loggedIn = false,
    password = 'password';

//home page
app.get('/', (req, res) => {

    res.send('welcome');

});

//serve static page if not logged
app.get('/login', function (req, res) {
    console.log('login attempted');
    if (loggedIn == true) {
       res.sendFile(__dirname + '/demos/demo_multiparty.html')
    } else {
        res.sendFile(__dirname + '/public/login.html');
    }

})

app.post('/login', function (req, res) {
  // const password = req.body.password;
  //   console.log('post to /login');
    if (loggedIn == true) {
        res.send('Already logged in.');
    } else {
        console.log('Posted data:' + JSON.stringify(req.body));
        if (req.body.password === "password") {
            loggedIn = true;
            res.send('You are logged in.');

            //start rtc server
            const easyrtcServer = easyrtc.listen(app, socketServer)
        } else {
            res.send('Incorrect password.');
        }
    }
});

//Serve a static logout page
app.get('/logout', function (req, res) {
    res.sendFile(__dirname + '/public/logout.html');
});

app.post('/logout', function (req, res) {
    console.log('Posted data:' + JSON.stringify(req.body));
    if (req.body.password == password) {
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
             // res.sendFile(__dirname + '/demos/demo_multiparty.html')
             res.sendFile(__dirname + '/demos/demo_audio_only.html')
    } else {
        res.send('I no dey. Please try later.');
    }
});

var webServer = http.createServer(app);
var socketServer = socketIo.listen(webServer);

// Start Socket.io so it attaches itself to Express server
var socketServer = socketIo.listen(webServer, {
    'log level': 1
});

easyrtc.setOption("logLevel", "debug");

// easyrtc.events.on("easyrtcAuth", function(socket, easyrtcid, msg, socketCallback, callback) {
//     easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function(err, connectionObj){
//         if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
//             callback(err, connectionObj);
//             return;
//         }
//
//         connectionObj.setField("credential", msg.msgData.credential, {"isShared":false});
//
//         console.log("["+easyrtcid+"] Credential saved!", connectionObj.getFieldValueSync("credential"));
//
//         callback(err, connectionObj);
//     });
// });
//
// // To test, lets print the credential to the console for every room join!
// easyrtc.events.on("roomJoin", function(connectionObj, roomName, roomParameter, callback) {
//     console.log("["+connectionObj.getEasyrtcid()+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
//     easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
// });
//
// // Start EasyRTC server
// var rtc = easyrtc.listen(app, socketServer, null, function(err, rtcRef) {
//     console.log("Initiated");
//
//     rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
//         console.log("roomCreate fired! Trying to create: " + roomName);
//
//         appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
//     });
// });

//start easy rtc serverapp.use(express.bodyParser());

// Listen on port 8080
webServer.listen(process.env.PORT || 8080, function(){
    console.log('Your node js server is running');
});
