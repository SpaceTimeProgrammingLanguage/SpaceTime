/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var debug = true;


var $wt = function(msg)
{
  console.log(msg);
};

var $L = function(msg)
{
  if (debug)
  {
    var util = require('util');
    console.log(util.inspect(msg,
    {
      depth: 99,
      colors: true
    }));
  }
};



var MEMORY = 'MEMORY';
var EACH = 'EACH';
var CONSOLE = 'CONSOLE';
var NONE = 'NONE';

var FUNCTION_SEQUENCE = 'FUNCTION_SEQUENCE';
var DATA_SEQUENCE = 'DATA_SEQUENCE';

var FUNCTION_COMPOSITION = [];

var Val = [];
var VAL = function(index)
{
  return Val[index] || (Val[index] = {
    wrapped_value: []
  });
};

var $push = function(arr, data)
{
  arr[arr.length] = data;
};

var $pop = function(arr)
{
  var data = arr[arr.length - 1];
  arr.splice(arr.length - 1, 1);
  return data;
};



//see http://bonsaiden.github.io/JavaScript-Garden/#types.typeof
var $type = function(obj)
{
  return Object
    .prototype
    .toString
    .call(obj)
    .slice(8, -1);
};


var map = function(src, atr)
{
  var atr1 = atr[0];

  if (atr1 === MEMORY)
  {
    return $mapMEMORY(src);
  }
  if (atr1 === EACH)
  {
    return $mapMEMORY(src);
  }
  if (atr1 === CONSOLE)
  {
    return $mapCONSOLE(src);
  }
  if (atr1 === NONE)
  {
    return $mapNONE(src);
  }

};


var isType = function(src, atr)
{
  var clas;

  var isFunction = function(el)
  {
    if (el.length === 0)
    {
      return false;
    }
    else if ($type(el[0]) === 'Function')
    {
      return true;
    }
    else
    {
      if (el[0].length > 1)
      {
        if (el[0][0] === FUNCTION_COMPOSITION)
        {
          return true;
        }
        else
        {
          return false;
        }
      }
      else
      {
        return false;
      }
    }
  };

  if ($type(src) === 'Array')
  {
    if (isFunction(src))
      clas = FUNCTION_SEQUENCE;
    else
      clas = DATA_SEQUENCE;
  }
  else
  {
    clas = $type(src);
  }

  return ((src !== undefined) && (src !== null) && (clas === atr));

};

var isNatveFunction = function(f)
{
  return ($type(f) === 'Function');
};


var $content = function(seq)
{
  return seq[0];
};



var $mapMEMORY = function(src)
{
  $L('############## mapMEM ################');
  $L('----------- src --------------');
  $L(src);
  $L('------------------------------');

  if (isType(src, FUNCTION_SEQUENCE))
  {
    $L('@@@@@========  FUNCTION_SEQUENCE ======= @@@@@');
    $L(src);
    return src;
  }
  else if (isType(src, DATA_SEQUENCE))
  {
    $L('@@@@@======== DATA_SEQUENCE =========@@@@@');
    if (src.length === 0) //empty pair
    {
      return [];
    }
    else if ((src.length === 1) && (src[0] === FUNCTION_COMPOSITION))
    {
      $L('!!!!!!!!!!!!!!=====================src === [FUNCTION_COMPOSITION]!!!!!!!!!!!!!!');
      return $mapMEMORY($pop(FUNCTION_COMPOSITION));
    }
    else
    {
      $L('----------------------------------');
      var lastElement = src[src.length - 1];
      $L('!!!!!!!!!!!!!!lastElement');
      $L(lastElement);

      if (!isType(lastElement, FUNCTION_SEQUENCE))
      {
        $L('@@@@@ unOperatable DATA_SEQUENCE @@@@@');
        $L(src);
        return src;
      }
      else
      {
        $L('@@@@@ Operatable DATA_SEQUENCE (the lastElement== f)@@@@@');
        // src = [SRC, [plus, ATR]]
        var _f = lastElement[0];
        var atr = lastElement[1];

        var srcsrc = src.slice(0, src.length - 1);

        var f;

        var result;
        if (isNatveFunction(_f)) // _f = plus
        {
          f = _f;
          if (!isType(srcsrc, DATA_SEQUENCE))
            throw 'Invalid Format';
          //$L('---srcsrc--------');
          //$L(srcsrc);  [SRC]

          result = f(srcsrc, atr); //plus([1],[2])

          $L('---result--------');
          $L(result);
          return result;
        }
        else // _f = [FUNCTION_COMPOSITION,[plus, [1]],[plus, [2]]]
        {
          $L('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& Custom Function &&&&&');
          $L(_f);

          // [FUNCTION_COMPOSITION] = srcsrc;

          $push(FUNCTION_COMPOSITION, srcsrc);

          for (var i = 0; i < atr.length; i++)
          {
            $push(VAL(i)
              .wrapped_value, atr[i]);
          }

          // f = _f[0][1][0];
          // result = f(srcsrc, atr); //plus([1],[2])

          result = $mapMEMORY(_f);

          $L('---result--------');
          $L(result);
          return result;
        }

      }

    }
  }
  else
  {
    $L('@@@@@========= ATOM/OBJECT ========@@@@@');
    $L('---result--------');
    $L(src);

    if (src.hasOwnProperty('wrapped_value'))
    {
      return $pop(src.wrapped_value);
    }
    else
    {
      return src;
    }
  }

};


var $mapEACH = function(src, atr)
{
  $L('---$mapEACH ');
  $L(src);
  for (var i = 0; i < src.length; i++)
  {
    $mapMEMORY(src[i]);
  }　
  return true;
};


var $mapCONSOLE = function(src)
{
  $L(' ---$mapCONSOLE  fn ----- ');

  var result = $mapMEMORY(src);

  $L('<@@@@@@@@@@@@@@@@@ $mapCONSOLE OUTPUT @@@@@@@@@@@@@@@@@>');
  $wt($content(result)); //side effect

  return result;
};

var $mapNONE = function(src)
{
  $L('!!!!!!!!!!!NONE');
  //do nothing, won't map/dig src
  return true;
};


var plus = function(src, atr) //plus([1], [2]) = [3]
{
  $L('==========plus');
  $L('---src');
  $L(src);
  $L('---atr');
  $L(atr);

  var src1 = $mapMEMORY(src);
  var atr1 = $mapMEMORY(atr);

  $L('@@@src1');
  $L(src1);
  $L('@@@atr1');
  $L(atr1);

  if (!isType(atr1, DATA_SEQUENCE))
  {

    throw 'Invalid Format';
  }
  else if (atr1.length === 0)
  {
    throw 'atr is null Sequence (empty pair), invalid format  ';
  }
  else
  {


    if (atr1.length === 1)
    {
      var result;

      if (!isType($content(src1), DATA_SEQUENCE))
      {
        result = $content(src1) + $content(atr1);
        // $L(result);  
        return [result];
      }
      else
      {
        var src2 = $mapMEMORY($content(src1));
        result = [];
        for (var i = 0; i < src2.length; i++)
        {
          result[i] = src2[i] + $content(atr1);
        }

        // $L('+++++++++++++++++++++++++++++');
        //$L(result)  
        return [result];
      }



    }
    else
    {
      //??
    }
  }


};

var minus = function(src, atr)
{
  var result = src - atr;

  return result;
};



var take = function(src, atr)
{
  var src1 = $content($mapMEMORY(src));
  var atr1 = $content($mapMEMORY(atr));

  if (isType(src1, DATA_SEQUENCE))
  {
    $L('-----take src is Array');
    $L('-----src1');
    $L(src1);
    $L('-----atr1');
    $L(atr1);

    return [src1.slice(0, atr1)];
  }
  else
  {
    $L('-----take src is Object');
    var i = 0;
    var out = [];

    while (true)
    {
      out[i] = src1.f(i);

      if (out.length === atr1)
        return [out];

      i++;
    }
  }
};



var Seq = [];

var NATURAL = {
  f: function(i)
  {
    return i;
  }
};

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



var bindClass = function(a)
{
  var x = a;

  var obj = {
    val: function()
    {
      return x;
    }
  };

  return obj;

};



var ifF = function(src, atr)
{
  //var bool = atr[0];
  $L('!!!!!!!!!! ifF   !!!!!!!!!!!!!!!!!!!!!!!!!!!');
  $L(src);
  $L($type(src) === 'Array');

  $L('!!atr!!');
  $L(atr[0]); // [true]


  if ($content($mapMEMORY(atr[0])))
  {
    return $mapMEMORY(atr[1]);
  }
  else
  {
    return $mapMEMORY(src);
  }

};

//=========================================



//################ TEST #####################

if (typeof describe !== "undefined")
{
  var expect = require('chai')
    .expect;

  $wt('#################### SpaceTime TEST #####################');
  $wt('{src f}   src -f-> ??');


  describe('===================================================================================',
    function()
    {
      describe('{{...} {...}} = empty pair  {} -{}-> {{} {}} = {} = ()',
        function()
        {
          it('() = ()',
            function()
            {
              var code = [];

              expect($mapMEMORY(code))
                .to.eql([]);
            });

        });
    });

  describe('===================================================================================',
    function()
    {

      describe('{{} 5} = (5)    {} -5-> {{} 5}  =  (5)',
        function()
        {
          it('(5) = (5)',
            function()
            {
              var code = [5];

              expect($mapMEMORY(code))
                .to.eql([5]);
            });
        });
    });

  describe('===================================================================================',
    function()
    {
      describe('{{{} 5} 7} = (5 7)    (5) -7-> {(5) 7}  =  (5 7)',
        function()
        {
          it('(5 7) = (5 7)',
            function()
            {
              var code = [5, 7];

              expect($mapMEMORY(code))
                .to.eql([5, 7]);
            });
        });
    });

  describe('===================================================================================',
    function()
    {
      describe('{{{{} 5} 7} 3} = (5 7 3)    (5 7) -3-> {(5 7) 3}  =  (5 7 3)',
        function()
        {
          it('(5 7 3) = (5 7 3)',
            function()
            {
              var code = [5, 7, 3];

              expect($mapMEMORY(code))
                .to.eql([5, 7, 3]);
            });
        });

    });

  describe('===================================================================================',
    function()
    {

      describe('(1 (2 3))    (1) -(2 3)-> {(1) (2 3)}  =  (1 (2 3)) ',
        function()
        {
          it('(1 (2 3)) = (1 (2 3))',
            function()
            {
              var code = [1, [2, 3]];

              expect($mapMEMORY(code))
                .to.eql([1, [2, 3]]);
            });
        });

    });

  describe('===================================================================================',
    function()
    {
      describe('("hello world")  ',
        function()
        {
          it('("hello world") = ("hello world")',
            function()
            {
              var code = ["hello world"];

              expect($mapMEMORY(code))
                .to.eql(["hello world"]);
            });
        });

    });

  describe('===================================================================================',
    function()
    {
      describe('("hello world" (map (CONSOLE)))  ',
        function()
        {
          it('("hello world" (map (CONSOLE))) = ("hello world")',
            function()
            {
              var code = [
                              "hello world",
                              [map, [CONSOLE]]
                         ];

              expect($mapMEMORY(code))
                .to.eql(["hello world"]);
            });
        });
    });

  describe('===================================================================================',
    function()
    {
      describe('("hello world" (map (CONSOLE)) (map (CONSOLE)))',
        function()
        {
          it('("hello world"  (map (CONSOLE))  (map (CONSOLE))) = ("hello world")',
            function()
            {
              var code = [
                              "hello world",
                              [map, [CONSOLE]],
                              [map, [CONSOLE]]
                         ];

              expect($mapMEMORY(code))
                .to.eql(["hello world"]);
            });
        });
    });

  describe('===================================================================================',
    function()
    {
      describe('((1 2 3) (map (CONSOLE)) ) ',
        function()
        {
          it('((1 2 3) (map (CONSOLE))) = ((1 2 3))',
            function()
            {
              var code = [
                              [1, 2, 3],
                              [map, [CONSOLE]]
                         ];

              expect($mapMEMORY(code))
                .to.eql([[1, 2, 3]]);
            });
        });

    });

  describe('===================================================================================',
    function()
    {

      describe(' (    1    (plus (2))     )   =(3)',
        function()
        {
          it('(1 (plus (2)))   =(3)',
            function()
            {
              var code = [1, [plus, [2]]];

              expect($mapMEMORY(code))
                .to.eql([3]);
            });
        });
    });

  describe('===================================================================================',
    function()
    {
      describe(' (    1    (plus (2))   (map (CONSOLE)) )   =(3)',
        function()
        {
          it('(1 (plus (2)) (map (CONSOLE)))  =(3)',
            function()
            {
              var code = [1, [plus, [2]], [map, [CONSOLE]]];

              expect($mapMEMORY(code))
                .to.eql([3]);
            });
        });
    });

  describe('===================================================================================',
    function()
    {

      describe(' (    1    (plus (2))    (plus (3))  )   =(6)',
        function()
        {
          it('(1 (plus (2)) (plus (3)))   =(6)',
            function()
            {
              var code =
                            [
                               1,
                               [plus, [2]],
                               [plus, [3]]
                            ];

              expect($mapMEMORY(code))
                .to.eql([6]);
            });
        });
    });

  describe('===================================================================================',
    function()
    {
      describe(' (    1    (plus (2))    (plus (3))   (plus (5)) )   =(11)',
        function()
        {
          it('(1 (plus (2)) (plus (3)) (plus (5)))   =(11)',
            function()
            {
              var code =
                            [
                               1,
                               [plus, [2]],
                               [plus, [3]],
                               [plus, [5]]
                            ];

              expect($mapMEMORY(code))
                .to.eql([11]);
            });
        });

    });

  describe('===================================================================================',
    function()
    {
      describe(' (    1    (plus ( 5    (plus (3))     )  )     )   =(9)',
        function()
        {
          it('(1 (plus (5 (plus (3)))))   =(9)',
            function()
            {
              var code =
                            [
                                1,
                                [plus, [5, [plus, [3]]]]

                            ];

              expect($mapMEMORY(code))
                .to.eql([9]);
            });
        });
    });

  describe('===================================================================================',
    function()
    {

      describe(' (     (    1    (plus (2))     )    (plus (2))     )   =((5))',
        function()
        {
          it('((1 (plus (2))) (plus (2)))   =((5))',
            function()
            {
              var code =
                            [
                                [1, [plus, [2]]],
                                [plus, [2]]
                            ];

              expect($mapMEMORY(code))
                .to.eql([[5]]);
            });
        });

    });

  describe('===================================================================================',
    function()
    {

      describe(' (     (    1    (plus  (    1    (plus (2))     ) )     )    (plus (2))     )   =((6))',
        function()
        {
          it('((1 (plus (1 (plus (2))))) (plus (2)))   =((6))',
            function()
            {
              var code =
                            [
                                [1, [plus, [1, [plus, [2]]]]],
                                [plus, [2]]
                            ];

              expect($mapMEMORY(code))
                .to.eql([[6]]);
            });
        });

    });

  describe('===================================================================================',
    function()
    {

      describe(' (     ( 1 2 3 )    (plus (2))     )   =((3 4 5))',
        function()
        {
          it('((1 2 3) (plus (2)))   =((3 4 5))',
            function()
            {
              var code =
                            [
                                [1, 2, 3],
                                [plus, [2]]
                            ];

              expect($mapMEMORY(code))
                .to.eql([[3, 4, 5]]);
            });
        });

    });

  describe('===================================================================================',
    function()
    {

      describe(' (   ( 1 2 3 4 5 )    (take (3))     )   =((1 2 3))',
        function()
        {
          it('((1 2 3 4 5) (take (3)))   =((1 2 3))',
            function()
            {
              var code =
                            [
                                [1, 2, 3, 4, 5],
                                [take, [3]]
                            ];

              expect($mapMEMORY(code))
                .to.eql([[1, 2, 3]]);
            });
        });
    });

  describe('===================================================================================',
    function()
    {


      describe(' (   NATURAL   (take (10))     ) ',
        function()
        {
          it('(NATURAL (take (10)))   =((0 1 2 3 4 5 6 7 8 9))',
            function()
            {
              var code =
                                [

                                    NATURAL,
                                    [take, [10]]

                                ];

              expect($mapMEMORY(code))
                .to.eql([[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]]);
            });
        });
    });

  describe('===================================================================================',
    function()
    {

      describe(' (   FIB   (take (10))     )  ',
        function()
        {
          it('(FIB (take (10)))   =((1 1 2 3 5 8 13 21 34 55))',
            function()
            {
              var code =
                                [
                                    FIB,
                                    [take, [10]]

                                ];

              expect($mapMEMORY(code))
                .to.eql([[1, 1, 2, 3, 5, 8, 13, 21, 34, 55]]);
            });
        });

    });

  describe('===================================================================================',
    function()
    {
      describe(' (   FIB   (take (10))     )  & output ',
        function()
        {
          it('( FIB (take (10)) (map (CONSOLE)) )  = ((1 1 2 3 5 8 13 21 34 55)) ',
            function()
            {
              var code =
                                [

                                    FIB,
                                    [take, [10]],
                                    [map, [CONSOLE]]

                                ];

              expect($mapMEMORY(code))
                .to.eql(
                                [[1, 1, 2, 3, 5, 8, 13, 21, 34, 55]]);
            });
        });
    });

  describe('===================================================================================',
    function()
    {
      describe(' if ',
        function()
        {
          it('to write ',
            function()
            {
              var code = [
                              0,
                              [ifF, [[false], [1]]],
                              [ifF, [[true], [2]]]
                          ];

              expect($mapMEMORY(code))
                .to.eql([2]);
            });
        });
    });

  describe('===================================================================================',
    function()
    {
      describe(' if ',
        function()
        {
          it('to write ',
            function()
            {
              var code = [
                            0,
                            [ifF, [[true], [1]]],
                            [ifF, [[true], [2]]]
                         ];

              expect($mapMEMORY(code))
                .to.eql([2]);
            });
        });
    });

  describe('===================================================================================',
    function()
    {
      describe(' if ',
        function()
        {
          it('to write ',
            function()
            {
              var code = [
                            0,
                            [ifF, [[true], [1]]],
                            [ifF, [[false], [2]]]
                         ];

              expect($mapMEMORY(code))
                .to.eql([1]);
            });
        });
    });

  describe('===================================================================================',
    function()
    {
      describe(' if ',
        function()
        {
          it('to write ',
            function()
            {
              var code = [
                            0,
                            [ifF, [[false], [1]]],
                            [ifF, [[false], [2]]]
                         ];

              expect($mapMEMORY(code))
                .to.eql([0]);
            });
        });

    });

  describe('===================================================================================',
    function()
    {
      describe('Function Composition',
        function()
        {
          it('to write ',
            function()
            {
              var myF1 =
                    [
                          FUNCTION_COMPOSITION,
                          [plus, VAL(0)],
                          [plus, VAL(1)],
                          [plus, VAL(2)]
                    ];

              var code =
                    [
                         1,
                         [myF1, [[2], [3], [4]]],
                         [myF1, [[7], [1], [2]]],
                         [map, [CONSOLE]]
                    ];

              expect($mapMEMORY(code))
                .to.eql([20]);
            });
        });

    });

  var samplecode =
[
     99,
     [plus, [1]],
     [map, [CONSOLE]]
];



  //------------------------------------------------------
  //------------------------------------------------------
}