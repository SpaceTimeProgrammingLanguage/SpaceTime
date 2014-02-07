/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var M = require('./_core');

var map = function(src, atr)
{
	var atr1 = atr[0];
	var $mapEACH = function(src)
	{
		//$L('---$mapEACH ');
		//$L(src);
		for (var i = 0; i < src.length; i++)
		{
			M.$mapMEMORY(src[i]);
		}　
		return true;
	};

	var $mapCONSOLE = function(src)
	{
		//$L(' ---$mapCONSOLE  fn ----- ');

		var result = M.$mapMEMORY(src);

		M.$L('<@@@@@@@@@@@@@@@@@ $mapCONSOLE OUTPUT @@@@@@@@@@@@@@@@@>');
		M.$W(M.$content(result)); //side effect

		return result;
	};

	if (atr1 === M.MEMORY)
	{
		return M.$mapMEMORY(src);
	}
	if (atr1 === M.EACH)
	{
		return M.$mapEACH(src);
	}
	if (atr1 === M.CONSOLE)
	{
		return $mapCONSOLE(src);
	}

};

module.exports = map;