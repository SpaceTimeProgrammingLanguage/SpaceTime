/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var core = require('./_core');

var plus = function(src, atr) //plus([1], [2]) = [3]
{
	core.$L('==========plus');
	core.$L('---src');
	core.$L(src);
	core.$L('---atr');
	core.$L(atr);

	var src1 = core.$mapMEMORY(src);
	var atr1 = core.$mapMEMORY(atr);

	core.$L('@@@src1');
	core.$L(src1);
	core.$L('@@@atr1');
	core.$L(atr1);

	if (!core.isType(atr1, core.DATA_SEQUENCE))
	{

		throw 'Invalid Format';
	}
	else if (atr1.length === 0)
	{
		throw 'atr is null Sequence (empty pair), invalid format  ';
	}
	else
	{


		if (atr1.length === 1)
		{
			var result;

			if (!core.isType(core.$content(src1), core.DATA_SEQUENCE))
			{
				result = core.$content(src1) + core.$content(atr1);
				// $L(result);  
				return [result];
			}
			else
			{
				var src2 = core.$mapMEMORY(core.$content(src1));
				result = [];
				for (var i = 0; i < src2.length; i++)
				{
					result[i] = src2[i] + core.$content(atr1);
				}

				// $L('+++++++++++++++++++++++++++++');
				//$L(result)  
				return [result];
			}



		}
		else
		{
			//??
		}
	}


};

module.exports = plus;