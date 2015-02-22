(function () {
	'use strict';

	var _ = require('lodash');
	var express = require('express');
	var app = express();
	var fs = require("fs");
	var http = require('http') || require('https');
	var socketio;
	var azure = require('azure');
	var notificationHubService = azure.createNotificationHubService(
		'doormanhub',
		'Endpoint=sb://doormanhub-ns.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=qH4Zz0OXMjRltBXONus6eRZrV+auv6FU3Ogs48sCzAA='
	);

	function guid() {
	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	      .toString(16)
	      .substring(1);
	  }
	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	    s4() + '-' + s4() + s4() + s4();
	}

		// config
	var PORT = process.env.PORT || 5000,
		NO_NOTIFICATIONS = false;

	var EDISON = {
		ip       : '127.0.0.1',   // stub this out now
		port     : PORT,
		endpoint : { takePhoto: '/takePhoto' },
		log      : log.bind(null, "Edison:")
	};

	console.log('\n');

	app.use('/uploads', express.static(__dirname + '/uploads'));
	app.use('/public', express.static(__dirname + '/public'));
	app.use('/rtc', express.static(__dirname + '/node-sample/public'));

	app.get('/', function (req, res) {
		res.send('doorman in node');
	});


	function onPackageId(req, res, pkgId) {
		console.log('Package ID:', pkgId, 'received');

		// request edison to take a picture
		getPhoto(function __success(data) {
			console.log("got photo");

		});

		// send pkg id and picture to user
	}

	// debug pkg delivery endpoint
	app.get('/pkg/:id', function (req, res) {
		var
			pkgId = req.params.id,
			msg = 'Your package id was: ' + pkgId;

		console.log('/pkg/:id');

		onPackageId(req, res, pkgId);

		var
			//html = [msg, DELIVERY_IMG].join("<br><br>");
			html = msg;
		var payload = {
			data: {
				msg: "Hellow Push!!!"
			}
		};
		androidPushNotification(payload);

		res.send(html);
	});

	// production pkg delivery endpoint
	app.post('/pkg/:id', function (req, res) {
		res.json({
			call_url:"http://example.com",
			id: req.params.id
		});

		onPackageId(req, res, pkgId);
	});

	/**
	* Recipient endpoints
	*/

	app.get('/unlock/:door', function (req, res) {
		// send signal to edison to unlock
		// send WebRTC URL to recipient
	});

	app.post("/door/open",function(requ,res){
		socketio.emit("door_messages", {open: true});
	});

	app.post("/door/close",function(requ,res){
		socketio.emit("door_messages", {open: false});
	});


	/*
	* Push notifications
	*/

	function androidPushNotification(payload) {

		if (NO_NOTIFICATIONS) {
			console.log("Dry run of push notification - not sending");
			return;
		}

		notificationHubService.gcm.send(null, payload, function(error){
			if (!error) { console.log("notification sent"); }
			else {
				console.error("notification failed", error);
			}
		});
	}

	// called after /pkg - send webrtc page
	function pushPackageAlertToRecipient() {
	}

	// called after /unlock - send webrtc page
	function pushUnlockAlertToDriver() {
	}

	/*
	* EDISON DEVICE STUB
	*/
	var
		UPLOAD_DIR = __dirname + '/uploads',
		DELIVERY_PERSON_PHOTO_FILENAME = UPLOAD_DIR + '/upsguy.jpg',
		DELIVERY_IMG = '<img src="/uploads/upsguy.jpg"/>';

	function log() { console.log.apply(null, arguments); }

	app.get('/takePhoto', function (req, res) {
		var
			//photo = fs.readFile('/upload/
			msg = 'took a photo of the delivery person';

		EDISON.log(msg);
		res.sendFile(DELIVERY_PERSON_PHOTO_FILENAME);
	});


	/*
	* Webhooks and Callback URLs
	*/

	app.get('/att-oauth', function (req, res) {
		log("ATT params:", req.params);
		log("ATT body:", req.body);
		res.send("success");
	});
	console.log("Launching Server...");
	var server = app.listen(PORT);

	var io = require('socket.io').listen(server);
	console.log("Opening Socket...");
	io.sockets.on('connection', function(socket){
		console.log("New Connection...");
		socketio = socket;
	  socketio.on('package_picture', function(socket_data){
	  	var base64Data = socket_data.image.base64String;
	  	//console.log(base64Data);
	  	var fileFormat = socket_data.image.contentType.split("/")[1];
	  	var fileName = guid() + "." + fileFormat;
	  	var fileFullName = "./uploads/" + fileName;
	  	var fileURL = "http://localhost:9000/uploads" + fileName
	  	if(base64Data!= "" && base64Data != null){
		  	fs.writeFile(fileFullName, base64Data, 'base64', function(err) {
		  		if(!err){
		  			console.log(err);
		  		}
				  else{
				  	var payload{
				  		data:{
				  			imageUrl: "https://doorman.azurewebsite.net/uploads/" + "fileName"
				  		}
				  	}
				  	androidPushNotification(payload);
				  	//console.log("The URL is: " + fileURL);
				  }
				});
	  	}
	  });
	});

}());
