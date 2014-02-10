/* jslint node: true */
/* global jQuery,$, window, document, alert, describe, it, before, beforeEach, after, afterEach */

'use strict';

var debug = false;

var M = require('../../app.js');

$(document)
	.ready(function()
	{
		init();
	});

var init = function()
{

	setTimeout(function()
	{
		$('#input1')
			.val('("Hello world"  (map (CONSOLE)) )');
		$('#input1')
			.focusEnd();

		evaluation();
	}, 2000);

	$(document)
		.on('input propertychange', '#input1', function()
		{
			evaluation();
		});

	var evaluation = function()
	{
		$('#console1')
			.val('');

		var src = $('#input1')
			.val();

		var src1 = M.$parse(M.$trim(src));

		//console.log('src1 to mamMemory');
		//console.log(src1);

		var result = M.map(src1, [M.MEMORY], '#console1');

		$('#evaluation1')
			.val(M.$construct(result));
	};

};


$.fn.focusEnd = function()
{
	var value = $(this)
		.val();
	$(this)
		.val('');
	$(this)
		.focus();
	$(this)
		.val(value);
	return this;
}