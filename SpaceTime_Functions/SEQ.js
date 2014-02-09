/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';
var SEQ = {};

SEQ.i = 0;
SEQ.n = function(i)
{
	return SEQ[SEQ.i + i];
};

module.exports = SEQ;