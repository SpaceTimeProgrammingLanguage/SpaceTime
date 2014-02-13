var loadModulesFactory = function(SpaceTime_FunctionsDIR, SpaceTime_coreFile, M)
{
  return {
    M: M,
    func: function(f)
    {
      M.bool = require('./SpaceTime_Functions/bool.js');
      M.boolEqual = require('./SpaceTime_Functions/boolEqual.js');
      M.boolGreater = require('./SpaceTime_Functions/boolGreater.js');
      M.boolGreaterEqual = require('./SpaceTime_Functions/boolGreaterEqual.js');
      M.boolLess = require('./SpaceTime_Functions/boolLess.js');
      M.boolLessEqual = require('./SpaceTime_Functions/boolLessEqual.js');
      M.doNothing = require('./SpaceTime_Functions/doNothing.js');
      M.FIB = require('./SpaceTime_Functions/FIB.js');
      M.ifF = require('./SpaceTime_Functions/ifF.js');
      M.iterate = require('./SpaceTime_Functions/iterate.js');
      M.minus = require('./SpaceTime_Functions/minus.js');
      M.NATURAL = require('./SpaceTime_Functions/NATURAL.js');
      M.plus = require('./SpaceTime_Functions/plus.js');
      M.take = require('./SpaceTime_Functions/take.js');

      console.log('SpaceTime modlue load complete.');
      f();
    }
  };
};

module.exports = loadModulesFactory;