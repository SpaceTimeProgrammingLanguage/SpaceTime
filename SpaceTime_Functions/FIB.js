/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var Seq = [];

var FIB = {
	f: function(i)
	{
		if (i <= 1)
		{
			Seq[i] = 1;
		}
		else
		{
			Seq[i] = Seq[i - 2] + Seq[i - 1];
		}

		return Seq[i];
	}
};

module.exports = FIB;