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

	app.get('/pkg/:id', function (req, res) {
		var pkgId = req.params.id;
		res.send(pkgId);
	});

	app.listen(PORT);

}());
