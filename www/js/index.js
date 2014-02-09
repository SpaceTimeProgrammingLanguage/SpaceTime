/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var debug = false;

var M = require('../../app.js');

var src = ' (SEQ  (iterate ())  (take(10)) (map(CONSOLE))) ';

// var src = ' (NATURAL  (take(10)) (map(CONSOLE))) ';

/*  (
             FUNCTION_COMPOSITION VAL0(get(i(-(2))))(+(VAL0(get(i(-(1))))))
             (ifF((i <= 1)(1))))

         )*/

M.debug = false;
var src1 = M.parse(M.trim(src));
M.$L('src1 to mamMemory');
M.$L(src1);
M.map(src1, [M.MEMORY]);