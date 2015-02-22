(function () {
	'use strict';

	var
		// imports
		express = require('express'),
		app = express(),

		// config
		PORT = process.env.PORT || 9000,

		EDISON_IP = '127.0.0.1';

	app.get('/', function (req, res) {
		res.send('doorman in node');
	});

	app.get('/pkg/:id', function (req, res) {
		var pkgId = req.params.id;
		res.send('Your package id was: ' + pkgId);

		// request edison to take a picture
		// send pkg id and picture to user
	});

	app.get('/unlock/:door', function (req, res) {
		// send signal to edison to unlock
	});

	app.listen(PORT);

}());
