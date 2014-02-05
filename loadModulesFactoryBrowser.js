var loadModulesFactory = function(SpaceTime_FunctionsDIR, SpaceTime_coreFile, M)
{
  return {
    M: M,
    func: function(f)
    {
      M.doNothing = require('./SpaceTime_Functions/doNothing.js');
      M.FIB = require('./SpaceTime_Functions/FIB.js');
      M.ifF = require('./SpaceTime_Functions/ifF.js');
      M.map = require('./SpaceTime_Functions/map.js');
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