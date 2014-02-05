/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var SpaceTime_FunctionsDIR = './SpaceTime_Functions/';
var SpaceTime_coreFile = '_core.js';
console.log('{src f}   src -f-> ??');
console.log('');
console.log('SpaceTime modlue loading...');
var M = require(SpaceTime_FunctionsDIR + SpaceTime_coreFile);
module.exports = M;
console.log('core module');

var loadModules = M.loadModules = function(f)
{
  require("fs")
    .readdir(SpaceTime_FunctionsDIR,
      function(err, files)
      {
        files.forEach(function(file)
        {
          if (file !== SpaceTime_coreFile)
          {
            var name = file.split('.js')[0];
            var filepath = SpaceTime_FunctionsDIR + file;
            M[name] = require(filepath);
            console.log('Function: ' + name);
          }
        });
        console.log('SpaceTime modlue load complete.');
        f();
      });
};

if (typeof describe === 'undefined')
{
  loadModules(function()
  {
    init();
  });
}

//=========================================


var init = function()
{
  M.$W('#################### ready !!#####################');

  var myF1 =
            [
                  M.FUNCTION_COMPOSITION,
                  [M.plus, M.VAL(0)],
                  [M.plus, M.VAL(1)],
                  [M.plus, M.VAL(2)]
            ];

  var code =
            [
                  1,
                 [myF1, [[2], [3], [4]]],
                 [myF1, [[7], [1], [2]]],
                 [M.map, [M.CONSOLE]]
            ];

  M.$mapMEMORY(code);
};