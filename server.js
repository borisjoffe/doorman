(function () {
	'use strict';

	var
		// imports
		express = require('express'),
		app = express(),

		// config
		PORT = process.env.PORT || 9000;

	app.get('/', function (req, res) {
		res.send('doorman in node');
	});

	app.listen(PORT);

}());
