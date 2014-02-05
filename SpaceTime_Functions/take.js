/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var core = require('./_core');

var take = function(src, atr)
{
	var src1 = core.$content(core.$mapMEMORY(src));
	var atr1 = core.$content(core.$mapMEMORY(atr));

	if (core.isType(src1, core.DATA_SEQUENCE))
	{
		core.$L('-----take src is Array');
		core.$L('-----src1');
		core.$L(src1);
		core.$L('-----atr1');
		core.$L(atr1);

		return [src1.slice(0, atr1)];
	}
	else
	{
		core.$L('-----take src is Object');
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