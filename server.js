(function () {
	'use strict';

	var
		// imports
		_ = require('lodash'),

		express = require('express'),
		app = express(),
		https = require('https'),

		// config
		PORT = process.env.PORT || 9000,

		EDISON = {
			ip: '127.0.0.1' + ':' + PORT,   // stub this out now
			takePhotoEndpoint: '/takePhoto'
		};


	console.log('\n');

	app.get('/', function (req, res) {
		res.send('doorman in node');
	});

	function getPhoto(onSuccess, onError) {
		onSuccess = onSuccess || console.log;
		onError = onError || console.error;

		var edisonPhotoReq = {
			host   : EDISON.ip,
			path   : EDISON.takePhotoEndpoint,
			method : 'GET'
		};
		console.log('getPhoto');

		https.get(edisonPhotoReq, function (res) {
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

		res.send(msg);
	});
	
	app.post('/pkg/:id', function (req, res) {
		res.json({
			call_url:"http://example.com",
			id: req.params.id
		});

		onPackageId();
	});

	app.get('/unlock/:door', function (req, res) {
		// send signal to edison to unlock
	});

	app.listen(PORT);

	/*
	* EDISON DEVICE STUB
	*/

	function logEdison() {
		console.log.apply(null, arguments);
	}

	app.get('takePhoto', function (req, res) {
		var msg = 'Edison took a photo of the delivery person';
		logEdison(msg);
		res.send(msg);
	});

}());
