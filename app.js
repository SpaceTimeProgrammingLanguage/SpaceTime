/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var SpaceTime_FunctionsDIR = './SpaceTime_Functions/';
var SpaceTime_coreFile = '_core.js';
console.log('{src f}   src -f-> ??');
console.log('');
console.log('SpaceTime modlue loading...');
//var M = require(SpaceTime_FunctionsDIR + SpaceTime_coreFile);
var M = require('./SpaceTime_Functions/_core.js');
module.exports = M;
console.log('core module');

var loadModulesFactory;

//=======Comment/Out for node or browserify
loadModulesFactory = require('./loadModulesFactory');
//loadModulesFactory = require('./loadModulesFactoryBrowser');

var obj = loadModulesFactory(SpaceTime_FunctionsDIR, SpaceTime_coreFile, M);
M = obj.M;
var loadModules = M.loadModules = obj.func;

if (typeof describe === 'undefined')
{
  loadModules(function()
  {
    M.$W('------------- SpaceTime ready ----------------');

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


    //------------------------------------------------------------------
  });
}

//=========================================