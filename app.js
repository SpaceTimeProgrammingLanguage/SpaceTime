/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var SpaceTime_FunctionsDIR = './SpaceTime_Functions/';
var SpaceTime_MFunctionFile = '_core.js';

var M = require(SpaceTime_FunctionsDIR + SpaceTime_MFunctionFile);

require("fs")
  .readdirSync(SpaceTime_FunctionsDIR)
  .forEach(function(file)
  {
    if (file !== SpaceTime_MFunctionFile)
    {
      var name = file.split('.js')[0];

      var filepath = SpaceTime_FunctionsDIR + file;
      M[name] = require(filepath);


      M.$W('Function: ' + name);
    }
  });

module.exports = M;
//=========================================