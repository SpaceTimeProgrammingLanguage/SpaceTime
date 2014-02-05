/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var M = require('./_core');

var map = function(src, atr)
{
	var atr1 = atr[0];

	if (atr1 === M.MEMORY)
	{
		return M.$mapMEMORY(src);
	}
	if (atr1 === M.EACH)
	{
		return M.$mapMEMORY(src);
	}
	if (atr1 === M.CONSOLE)
	{
		return M.$mapCONSOLE(src);
	}

};

module.exports = map;