/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

//

'use strict';
var MEMORY = 'MEMORY';
var EACH = 'EACH';
var CONSOLE = 'CONSOLE';
var NONE = 'NONE';

var FUNCTION_SEQUENCE = 'FUNCTION_SEQUENCE';
var DATA_SEQUENCE = 'DATA_SEQUENCE';

//see http://bonsaiden.github.io/JavaScript-Garden/#types.typeof
var $type = function(obj)
{
    return Object
        .prototype
        .toString
        .call(obj)
        .slice(8, -1);
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
        else if ($type(el[0]) !== 'Function')
        {
            return false;
        }
        else
        {
            return true;
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



var $wt = function(msg)
{
    console.log(msg);
};

var $log = function(msg)
{
    // console.log(msg);
};

var $content = function(seq)
{
    return seq[0];
};


var $mapNONE = function(src)
{
    $log('!!!!!!!!!!!NONE');
    //do nothing, won't map/dig src
    return true;
};

var $mapCONSOLE = function(src)
{
    $log(' ---$mapCONSOLE  fn ----- ');
    $log('<-----------$mapCONSOLE OUTPUT---------->');
    var result = $mapMEMORY(src);

    $wt($content(result)); //side effect

    return result;
};

var $mapMEMORY = function(src)
{
    $log('-----mapMEM-----');
    $log('src is ...');
    $log(src);

    if (isType(src, FUNCTION_SEQUENCE))
    {
        $log('---result----FUNCTION_SEQUENCE----');
        $log(src);
        return src;
    }
    else if (isType(src, DATA_SEQUENCE))
    {
        if (src.length === 0) //empty pair
        {
            return [];
        }
        else
        {
            var lastElement = src[src.length - 1];

            if (!isType(lastElement, FUNCTION_SEQUENCE))
            {
                $log('---result---unoperatable DATA_SEQUENCE-----');
                $log(src);
                return src;
            }
            else
            {
                var f = lastElement[0];
                var atr = lastElement[1];

                var srcsrc = src.slice(0, src.length - 1);

                if (!isType(srcsrc, DATA_SEQUENCE))
                    throw 'Invalid Format';
                //$log('---srcsrc--------');
                //$log(srcsrc);

                var result = f(srcsrc, atr);

                $log('---result--------');
                $log(result);
                return result;
            }

        }
    }
    else
    {
        $log('ATOM/OBJECT');
        $log('---result--------');
        $log(src);
        return src;
    }

};


var $mapEACH = function(src, atr)
{
    $log('---invoke ');
    $log(src);
    for (var i = 0; i < src.length; i++)
    {
        $mapMEMORY(src[i]);
    }

    return true;
};

var plus = function(src, atr)
{
    $log('==========plus');
    $log(src);
    $log(atr);

    if (!isType(atr, DATA_SEQUENCE))
    {
        throw 'Invalid Format';
    }
    else if (atr.length === 0)
    {
        throw 'atr is null Sequence (empty pair), invalid format  ';
    }
    else
    {
        var src1 = $mapMEMORY(src);
        var atr1 = $mapMEMORY(atr);

        $log('@@@src1');
        $log(src1);
        $log('@@@atr1');
        $log(atr1);

        if (atr1.length === 1)
        {
            var result;

            if (!isType($content(src1), DATA_SEQUENCE))
            {
                result = $content(src1) + $content(atr1);
                // $log(result);  
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

                // $log('+++++++++++++++++++++++++++++');
                //$log(result)  
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
        return $mapCONSOLE(src); //side effect

    }
    if (atr1 === NONE)
    {
        return $mapNONE(src);
    }

};



var take = function(src, atr)
{
    var src1 = $content($mapMEMORY(src));
    var atr1 = $content($mapMEMORY(atr));

    if (isType(src1, DATA_SEQUENCE))
    {
        $log('-----take src is Array');
        $log('-----src1');
        $log(src1);
        $log('-----atr1');
        $log(atr1);

        return [src1.slice(0, atr1)];
    }
    else
    {
        $log('-----take src is Object');
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

var vals = [];
var bind = function(src, atr)
{
    if (!vals[src])
        vals[src] = bindClass(atr);
    else
        $log('error to bind: already exist');
};

var val = function(src, atr)
{
    return vals[src].val();
};



var Sharp = function()
{
    var Code;

    var Src = {};
    var Atr = {};

    var obj = {
        setCode: function(code)
        {
            Code = code;
        },
        src: Src,
        atr: Atr,
        f: function(src, atr)
        {
            $log('----f');
            $log(src);
            $log(atr);

            Src._wrappedVal = src;
            Atr._wrappedVal = atr;

            return $mapMEMORY(Code);
        }
    };
    return obj;
};



var ifF = function(src, atr)
{
    //var bool = atr[0];
    $log('!!!!!!!!!! ifF   !!!!!!!!!!!!!!!!!!!!!!!!!!!');
    $log(src);
    $log($type(src) === 'Array');

    $log('!!atr!!');
    $log(atr[0]); // [true]
    //$mapMEMORY( [true] )
    //atr[0])[0] = true;
    if ($mapMEMORY(atr[0])[0])
    {
        return $mapMEMORY(atr[1]);
    }
    else
    {
        return $mapMEMORY(src);
    }

};


//################ TEST #####################


var expect = require('chai')
    .expect;

// works only on mocha command, otherwise error->catch
try
{
    describe('mapMEMORY',
        function()
        {

            $wt('#################### SpaceTime TEST #####################');

            $wt('{src f}   src -f-> ??');

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
            //------------------------------------------------------
        });

}
catch (e)
{

}