(function () {
	'use strict';

	var
		// imports
		_ = require('lodash'),

		express = require('express'),
		app = express(),

		http = require('http') || require('https'),

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
	});

	app.post('/pkg/:id', function (req, res) {
		res.json({
			call_url:"http://example.com",
			id: req.params.id
		});

		onPackageId(req, res, pkgId);
	});

	app.get('/unlock/:door', function (req, res) {
		// send signal to edison to unlock
	});


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
