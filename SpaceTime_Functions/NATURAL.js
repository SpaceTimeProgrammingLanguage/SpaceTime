/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';
var M = require('./map');

var NATURAL = {
	f: function()
	{
		return M.SEQ.i;
	}
};

module.exports = NATURAL;