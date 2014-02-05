/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var M = require('./app.js');

var expect = require('chai')
	.expect;

M.$W('#################### SpaceTime TEST #####################');
M.$W('{src f}   src -f-> ??');


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

						expect(M.$mapMEMORY(code))
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

						expect(M.$mapMEMORY(code))
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

						expect(M.$mapMEMORY(code))
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

						expect(M.$mapMEMORY(code))
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

						expect(M.$mapMEMORY(code))
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

						expect(M.$mapMEMORY(code))
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
                              [M.map, [M.CONSOLE]]
                         ];

						expect(M.$mapMEMORY(code))
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
                              [M.map, [M.CONSOLE]],
                              [M.map, [M.CONSOLE]]
                         ];

						expect(M.$mapMEMORY(code))
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
                              [M.map, [M.CONSOLE]]
                         ];

						expect(M.$mapMEMORY(code))
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
						var code = [1, [M.plus, [2]]];

						expect(M.$mapMEMORY(code))
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
						var code = [1, [M.plus, [2]], [M.map, [M.CONSOLE]]];

						expect(M.$mapMEMORY(code))
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
                               [M.plus, [2]],
                               [M.plus, [3]]
                            ];

						expect(M.$mapMEMORY(code))
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
                               [M.plus, [2]],
                               [M.plus, [3]],
                               [M.plus, [5]]
                            ];

						expect(M.$mapMEMORY(code))
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
                                [M.plus, [5, [M.plus, [3]]]]

                            ];

						expect(M.$mapMEMORY(code))
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
                                [1, [M.plus, [2]]],
                                [M.plus, [2]]
                            ];

						expect(M.$mapMEMORY(code))
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
                                [1, [M.plus, [1, [M.plus, [2]]]]],
                                [M.plus, [2]]
                            ];

						expect(M.$mapMEMORY(code))
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
                                [M.plus, [2]]
                            ];

						expect(M.$mapMEMORY(code))
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
                                [M.take, [3]]
                            ];

						expect(M.$mapMEMORY(code))
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

                                    M.NATURAL,
                                    [M.take, [10]]

                                ];

						expect(M.$mapMEMORY(code))
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
                                    M.FIB,
                                    [M.take, [10]]

                                ];

						expect(M.$mapMEMORY(code))
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

                                    M.FIB,
                                    [M.take, [10]],
                                    [M.map, [M.CONSOLE]]

                                ];

						expect(M.$mapMEMORY(code))
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
                              [M.ifF, [[false], [1]]],
                              [M.ifF, [[true], [2]]]
                          ];

						expect(M.$mapMEMORY(code))
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
                            [M.ifF, [[true], [1]]],
                            [M.ifF, [[true], [2]]]
                         ];

						expect(M.$mapMEMORY(code))
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
                            [M.ifF, [[true], [1]]],
                            [M.ifF, [[false], [2]]]
                         ];

						expect(M.$mapMEMORY(code))
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
                            [M.ifF, [[false], [1]]],
                            [M.ifF, [[false], [2]]]
                         ];

						expect(M.$mapMEMORY(code))
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

						expect(M.$mapMEMORY(code))
							.to.eql([20]);
					});
			});

	});

var samplecode =
[
     99,
     [M.plus, [1]],
     [M.map, [M.CONSOLE]]
];


describe('===================================================================================',
	function()
	{
		describe(' doNothing does nothing else but return ()',
			function()
			{
				it('( AnySequence (doNothing ()) ) = () ',
					function()
					{
						var code = [
                              0,
                              [M.ifF, [[false], [1]]],
                              [M.ifF, [[true], [2]]], // won't be evaluated
                              [M.doNothing, []]
                          ];

						expect(M.$mapMEMORY(code))
							.to.eql([]);
					});
			});
	});