/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var M = require('./_core');

var take = function(src, atr)
{
	var src1 = M.$content(M.map(src, M.MEMORY));
	var atr1 = M.$content(M.map(atr, M.MEMORY));

	if (M.isType(src1, M.DATA_SEQUENCE))
	{
		M.$L('-----take src is Array');
		M.$L('-----src1');
		M.$L(src1);
		M.$L('-----atr1');
		M.$L(atr1);

		return [src1.slice(0, atr1)];
	}
	else
	{
		M.$L('-----take src is Object');
		var i = 0;
		var out = [];

		while (true)
		{
			out[i] = src1.f(i);

			if (out.length === atr1)
				return [out];

			i++;
		}
	}
};

module.exports = take;