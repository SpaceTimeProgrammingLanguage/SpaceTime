/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var M = require('./map');

var take = function(src, atr)
{
	var src1 = M.$content(M.map(src, [M.EVAL]));
	var atr1 = M.$content(M.map(atr, [M.EVAL]));

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
		M.$L('' + src1);

		M.I = 0;
		var out = [];

		while (true)
		{
			out[M.I] = M.SEQ[M.I] = src1();

			if (out.length === atr1)
				return [out];

			M.I++;
		}
	}
};

module.exports = take;