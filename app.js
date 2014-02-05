/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var SpaceTime_FunctionsDIR = './SpaceTime_Functions/';
var SpaceTime_coreFile = '_core.js';

var M = require(SpaceTime_FunctionsDIR + SpaceTime_coreFile);

require("fs")
  .readdirSync(SpaceTime_FunctionsDIR)
  .forEach(function(file)
  {
    if (file !== SpaceTime_coreFile)
    {
      var name = file.split('.js')[0];

      var filepath = SpaceTime_FunctionsDIR + file;
      M[name] = require(filepath);

      M.$W('Function: ' + name);
    }
  });

module.exports = M;
//=========================================