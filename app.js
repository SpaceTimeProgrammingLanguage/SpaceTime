     var SpaceTime_FunctionsDIR = './SpaceTime_Functions/';
     var SpaceTime_coreFile = 'map.js';
     console.log('{src f}   src -f-> ??');
     console.log('');
     console.log('SpaceTime modlue loading...');
      //var M = require(SpaceTime_FunctionsDIR + SpaceTime_coreFile);
      //require(STRING) must be raw STRING to be read by Browserify
     var M = require('./SpaceTime_Functions/map.js');
     module.exports = M;
     console.log('Function: map(core)');

     var loadModulesFactory;
     if (typeof window === 'undefined')
     {
       var modulePathHiddenFromBrowserify = './loadModulesFactory';
       loadModulesFactory = require(modulePathHiddenFromBrowserify);
     }
     else
     {
       loadModulesFactory = require('./loadModulesFactoryBrowserify');
     }

     var obj = loadModulesFactory(SpaceTime_FunctionsDIR, SpaceTime_coreFile, M);
     M = obj.M;
     var loadModules = M.loadModules = obj.func;


      //=====================================
     String.prototype.replaceAll = function(org, dest)
     {
       return this
         .split(org)
         .join(dest);
     };

     var sqSymbol = '_____sq_____';
     var sqKey = 'sq___';

      //==========================
     var cmtprts = ['//', '/*', '*/', '(', ')', '\n', ' ', '　'];
     var cmtprtsE = cmtprts.map(function(s, i)
     {
       return '______mark______' + i;
     });
      //==========================

     var restoreMark = function(src)
     {
       // "thisisareplacement"+i  restore to normal string
       var src1 = [];

       cmtprtsE.map(function(mark, mark_i)
       {
         var data;
         if (mark_i === 0)
         {
           data = src;
         }
         else
         {
           data = src1[mark_i - 1];
         }
         src1[mark_i] = data.replaceAll(mark, cmtprts[mark_i]);

       });
       return src1[src1.length - 1];
     };

     var trim = function(src)
     {

       var strgs = src.match(/"(?:[^\\"]|\\.)*"/ig);
       var strgs1 = [];
       var src1 = [];

       var src2;
       // escape cmtprts  during each Strings
       if (strgs)
       {
         strgs.map(function(str, str_i)
         {
           var str1 = [];
           cmtprts.map(function(mark, mark_i)
           {
             var data;
             if (mark_i === 0)
             {
               data = str;
             }
             else
             {
               data = str1[mark_i - 1];
             }

             str1[mark_i] = data.replaceAll(mark, cmtprtsE[mark_i]);
           });

           strgs1[str_i] = str1[str1.length - 1];

           var data1;

           if (str_i === 0)
           {
             data1 = src;
           }
           else
           {
             data1 = src1[str_i - 1];
           }

           src1[str_i] = data1.replaceAll(strgs[str_i], strgs1[str_i]);

         });

         src2 = src1[src1.length - 1];
       }
       else
       {
         src2 = src;
       }

       // comment out removing
       var re2 = new RegExp('//.*?(?=[\\n\\r]+|$)|/[*](.|\n)*?[*]/', 'g');
       var src3 = src2
         .replace(re2, '');

       //beautifly
       var src4 = src3.replaceAll('　', ' '); //zenkaku>hankaku

       var src5 = src4.replaceAll('\n', ' '); //linebreak -> single space

       var src6 = src5.replace(/(\S)\(/g, '$1 ('); //foo(  -> foo (
       var src7 = src6.replace(/\)(\S)/g, ') $1'); //)foo  -> ) foo

       var src8 = src7.replace(/[　\s]+/g, ' '); // trim extra spaces
       var src9 = src8.replace(/(\()\s+|\s+(\))/g, '$1$2'); //trim a space after '(' and before ')'.
       var src10 = src9.replace(/(\[)\s+|\s+(\])/g, '$1$2'); //trim a space after '[' and before ']'.



       return src10;

     };



     var arrays = function(src)
     {
       M.$W('------------- parse ----------------');
       M.$W(src);


       var f1 = function(src)
       {
         //   M.$W('some seq');
         //    M.$W(src);

         var indexHead;
         var indexTail;
         var count = [];
         var previousCount;

         var space = [];
         for (var i = 0; i < src.length; i++)
         {
           // wt('> ' + src[i]);
           if (i === 0)
             previousCount = 0;
           else
             previousCount = count[i - 1];

           if ((previousCount === 1) && (src[i] === ' '))
             space[space.length] = i;

           if (src[i] === '(')
             count[i] = previousCount + 1;
           else if (src[i] === ')')
             count[i] = previousCount - 1;
           else
             count[i] = previousCount;

           if ((previousCount === 0) && (count[i] === 1))
           {
             indexHead = i;
           }

           if ((previousCount === 1) && (count[i] === 0))
           {
             indexTail = i;
           }

           //   wt('count ' + count[i]);

         }

         //   M.$W(indexHead);
         //   M.$W(indexTail);
         //  M.$W(space);

         var src1 = src.substring(indexHead + 1, indexTail);


         var array = [];

         if (space.length === 0)
         {
           array[0] = arrays(src1);
           // M.$W('---return');
           //  M.$W(array);
           return array;
         }
         else
         {
           for (var j = 0; j < space.length; j++)
           {
             if (j === 0)
             {
               array[array.length] = arrays(src.substring(indexHead + 1, space[j]));
             }
             if (j === space.length - 1)
             {
               array[array.length] = arrays(src.substring(space[j] + 1, indexTail));
             }
             else
             {
               array[array.length] = arrays(src.substring(space[j] + 1, space[j + 1]));
             }
           }
           //  M.$W('---return');
           //   M.$W(array);

           return array;
         }
       };


       //------------------
       if (src === '')
         return src;
       else if (!src)
         return src;
       else if (src.indexOf('(') === -1)
       {
         return src;
       }
       else
       {

         var count = 0;
         var otherCharactor = false;
         for (var i = 0; i < src.length; i++)
         {
           if (src[i] === '(')
           {
             count++;
           }
           else if (src[i] === ')')
           {
             count--;
           }
           else if (src[i] === ' ')
           {

           }
           else
           {
             otherCharactor = true;
           }
         }

         if (count !== 0)
         {
           return 'error';
         }
         else if (otherCharactor)
         {
           return f1(src);
         }
         else
         {
           return [];
         }

       }
     };

     var maybeNumberString = function(src)
     {
       console.log('maybeNumberString');
       console.log(src);

       var s1 = src * 1;
       var s2 = '' + s1;
       if (src === s2) // naked number
       {
         return s1;
       }
       else if (src.indexOf('"') !== -1) // '"some string"'
       {
         return restoreMark(src.substring(1, src.length - 1));
       }
       else
       {
         var src1;

         if (src === '+')
           src1 = 'plus';
         else if (src === '-')
           src1 = 'minus';
         else if (src === 'if')
           src1 = 'ifF';
         else if (src === '==')
           src1 = 'boolEqual';
         else if (src === '>')
           src1 = 'boolGreater';
         else if (src === '<')
           src1 = 'boolLess';
         else if (src === '>=')
           src1 = 'boolGreaterEqual';
         else if (src === '<=')
           src1 = 'boolLessEqual';
         else
           src1 = src;

         console.log(src1);
         return M[src1];
       }

     };



     var walk = function(src)
     {
       //  console.log('=======');
       // console.log(src);

       if (M.$type(src) !== 'Array')
       {
         return maybeNumberString(src);
       }
       else
       {
         var array = [];
         for (var i = 0; i < src.length; i++)
         {
           //  console.log('-------');
           //  console.log(src[i]);
           array[i] = walk(src[i]);
         }

         return array;
       }
     };


     var $parse = M.$parse = function(src)
     {
       return walk(arrays(trim(src)));
     };
      //======================================

     var $construct = M.$construct = function(result)
     {
       var result1;
       if (M.$type(result) === 'Array')
       {
         result1 = '( ';
         for (var i = 0; i < result.length; i++)
         {
           result1 += $construct(result[i]);
           result1 += ' ';
         }

         result1 += ')';
       }
       else if (M.$type(result) === 'String')
       {
         result1 = '"' + result + '"';
       }
       else if (M.$type(result) === 'Function')
       {
         result1 = 'Function';
       }
       else
       {
         result1 = result;
       }

       return result1;
     };

     if (typeof describe === 'undefined')
     {
       loadModules(function()
       {
         M.$W('------------- SpaceTime Module is Ready ----------------');



         //============================================
         // var src = [1, [M.plus, [2]], [M.map, [M.CONSOLE]]];
         //var src = '    ( ((  ) )  8 ) ';
         // var src = '';
         // var src = '(("hello   world"))';
         // var src = '  ( 2 (+(9)) )    ';
         //  var src = ' (FIB (take(10)) (map(CONSOLE))) ';
         //var src = ' (SEQ  (iterate ())  (take(10)) (map(CONSOLE))) ';

         // var src = ' (NATURAL  (take(10)) (map(CONSOLE))) ';

         /*  (
             FUNCTION_COMPOSITION VAL0(get(i(-(2))))(+(VAL0(get(i(-(1))))))
             (ifF((i <= 1)(1))))

         )*/
         //  var src = '( (1 2 3 4 5)      (take(4))   (take(2)))';
         // var src = '( () (iterate ( I ) ) (take(10)) )';
         var src = '( 3 (==(1))　  (  if (  ("match")  ("unmatch")   )  ) )';

         //  var src = '( () (iterate (I (if ((I (<= (4) ))  (1))   )  ) ) (take(10)) )';

         //var src = '(3 (== (3)))';
         // var src = '("foo" if(true) ("bar") ))';

         M.debug = false;
         var src1 = $parse(src);

         /*  src1 = [
          5,
          [M.ifF, [[false], [1]]]
        ];*/

         //  src1 = [10, [M.bool, [M.GREATEREQUAL, [10]]]];
         console.log(src1);
         var result = M.map(src1, [M.EVAL]);
         M.$W(' === result === ');
         M.$W(result);
         M.$W($construct(result));

         //------------------------------------------------------------------
       });
     }

      //=========================================
