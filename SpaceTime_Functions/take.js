/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var M = require('./map');

var take = function(src, atr)
{
	console.log('----take src---------');
	M.$WL(src);

	console.log('-------------');

	var src1 = M.$content(M.map(src, [M.EVAL]));
	var atr1 = M.$content(M.map(atr, [M.EVAL]));

	console.log('----take src1---------');
	M.$WL(src1);

	if (!src1.hasOwnProperty('iterate'))
	{
		M.$WL('-----take src is Array');
		M.$L('-----src1');
		M.$L(src1);
		M.$L('-----atr1');
		M.$L(atr1);
		return [src1.slice(0, atr1)];
	}
	else
	{
		var src2 = src1.iterate;
		M.$WL('-----take src is Object');
		M.$L('' + src2);

		M.I.valOfI = 0;
		var out = [];


		while (true)
		{
			console.log('-------------');
			console.log(M.I.valOfI);
			console.log(M.$mapEVAL(src2));
			console.log('-------------');

			out[M.I.valOfI] =
				M.sequence[M.I.valOfI] = M.$content(M.$mapEVAL(src2));
			//src1(i);

			if (out.length === atr1)
				return [out];

			M.I.valOfI++;
		}
	}
};

module.exports = take;