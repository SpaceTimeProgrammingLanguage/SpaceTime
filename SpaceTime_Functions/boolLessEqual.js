/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var M = require('./map');

var boolLessEqual = function(src, atr)
{
	var valL = M.$content(M.$mapEVAL(src));
	var valR = M.$content(M.$mapEVAL(atr));

	return [(valL <= valR)];
};

module.exports = boolLessEqual;