/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var M = require('./map');

var take = function(src, atr)
{
	var src1 = M.$content(M.map(src, [M.MEMORY]));
	var atr1 = M.$content(M.map(atr, [M.MEMORY]));

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

		M.SEQ.i = 0;
		var out = [];

		while (true)
		{
			out[M.SEQ.i] = M.SEQ[M.SEQ.i] = src1();

			if (out.length === atr1)
				return [out];

			M.SEQ.i++;
		}
	}
};

module.exports = take;