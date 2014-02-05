/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var M = require('./_core');

var plus = function(src, atr) //plus([1], [2]) = [3]
{
	M.$L('==========plus');
	M.$L('---src');
	M.$L(src);
	M.$L('---atr');
	M.$L(atr);

	var src1 = M.$mapMEMORY(src);
	var atr1 = M.$mapMEMORY(atr);

	M.$L('@@@src1');
	M.$L(src1);
	M.$L('@@@atr1');
	M.$L(atr1);

	if (!M.isType(atr1, M.DATA_SEQUENCE))
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

			if (!M.isType(M.$content(src1), M.DATA_SEQUENCE))
			{
				result = M.$content(src1) + M.$content(atr1);
				// $L(result);  
				return [result];
			}
			else
			{
				var src2 = M.$mapMEMORY(M.$content(src1));
				result = [];
				for (var i = 0; i < src2.length; i++)
				{
					result[i] = src2[i] + M.$content(atr1);
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