/* jslint node: true */
/* global jQuery,$, window, document, alert, describe, it, before, beforeEach, after, afterEach */

'use strict';

var debug = false;

var M = require('../../app.js');

var src = ' (SEQ  (iterate ())  (take(10)) (map(CONSOLE))) ';

// var src = ' (NATURAL  (take(10)) (map(CONSOLE))) ';

/*  (
             FUNCTION_COMPOSITION VAL0(get(i(-(2))))(+(VAL0(get(i(-(1))))))
             (ifF((i <= 1)(1))))

         )*/

M.debug = false;
var src1 = M.parse(M.trim(src));
M.$L('src1 to mamMemory');
M.$L(src1);
M.map(src1, [M.MEMORY]);

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
			.focusEnd();
	}, 2000);

	$(document)
		.on('click', '#btn1', function()
		{
			$('#output1')
				.text('');

			var src = $('#input1')
				.text();

			var src1 = M.parse(M.trim(src));
			var result = M.map(src1, [M.MEMORY], '#output1');

			$('#input1')
				.focusEnd();

		})
		.on('click', '#btn2', function()
		{
			$('#output1')
				.text('');

			$('#input1')
				.focusEnd();
		});

};


$.fn.focusEnd = function()
{
	$(this)
		.focus();
	var tmp = $('<span />')
		.appendTo($(this)),
		node = tmp.get(0),
		range = null,
		sel = null;

	if (document.selection)
	{
		range = document.body.createTextRange();
		range.moveToElementText(node);
		range.select();
	}
	else if (window.getSelection)
	{
		range = document.createRange();
		range.selectNode(node);
		sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	}
	tmp.remove();
	return this;
}