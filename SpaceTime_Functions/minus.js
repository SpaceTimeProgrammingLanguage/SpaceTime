/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var core = require('./_core');

var minus = function(src, atr)
{
	var result = src - atr;

	return result;
};

module.exports = minus;