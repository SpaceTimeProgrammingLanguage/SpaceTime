var loadModulesFactory = function(SpaceTime_FunctionsDIR, SpaceTime_coreFile, M)
{
  return {
    M: M,
    func: function(f)
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
                M[name] = require(SpaceTime_FunctionsDIR + file);
                console.log('Function: ' + name);
              }
            });
            console.log('SpaceTime modlue load complete.');
            f();
          });
    }
  };
};

module.exports = loadModulesFactory;