(function () {
	'use strict';

	var
		// imports
		_ = require('lodash'),

		express = require('express'),
		app = express(),

		http = require('http') || require('https'),

		azure = require('azure'),
		notificationHubService = azure.createNotificationHubService(
			'doormanhub',
			'Endpoint=sb://doormanhub-ns.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=qH4Zz0OXMjRltBXONus6eRZrV+auv6FU3Ogs48sCzAA='
		),

		// config
		PORT = process.env.PORT || 9000,

		EDISON = {
			ip       : '127.0.0.1',   // stub this out now
			port     : PORT,
			endpoint : { takePhoto: '/takePhoto' },
			log      : log.bind(null, "Edison:")
		};


	console.log('\n');

	app.use('/uploads', express.static(__dirname + '/uploads'));

	app.get('/', function (req, res) {
		res.send('doorman in node');
	});

	/**
	* Delivery driver endpoints
	*/

	function getPhoto(onSuccess, onError) {
		onSuccess = onSuccess || console.log;
		onError = onError || console.error;

		var edisonPhotoReq = {
			host   : EDISON.ip,
			path   : EDISON.endpoint.takePhoto,
			port   : EDISON.port,
			method : 'GET'
		};

		http.get(edisonPhotoReq, function (res) {
			res.on('data', onSuccess);
		}).on('error', function () {
			console.log('err');
			onError.apply(null, arguments);
		});
	}

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

		res.send(html);

		androidPushTest();
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


	/*
	* Push notifications
	*/

	function androidPushTest() {
		var payload = {
			data: { msg: 'Hello!' }
		};

		notificationHubService.gcm.send(null, payload, function(error){
			if(!error){ console.log("notification sent"); }
			else {
				console.error("notification failed", error);
			}
		});
	}

	// called after /pkg
	function pushPackageAlertToRecipient() {
	}

	// called after /unlock
	function pushUnlockAlertToDriver() {
	}

	app.listen(PORT);

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

}());
