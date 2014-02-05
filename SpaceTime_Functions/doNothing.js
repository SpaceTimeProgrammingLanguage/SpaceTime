/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var M = require('./_core');

var doNothing = M.doNothing = function(src, atr)
{
	return [];
};

module.exports = doNothing;