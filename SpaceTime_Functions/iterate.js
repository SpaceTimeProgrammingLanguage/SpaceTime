/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var M = require('./map');

var iterate = function(src, likeFibf)
{
	//var Seq = M.$content(SEQ);

	M.$L('=======ITERATE================');
	M.$L(M.SEQ);

	var F = function()
	{
		if (M.SEQ.i <= 1)
		{
			return 1;
		}
		else
		{
			return M.SEQ.n(-2) + M.SEQ.n(-1);
		}
	};


	return [F];
};

module.exports = iterate;