package phaser;

import haxe.extern.Rest;

/**
* A collection of useful mathematical functions.
* 
* These are normally accessed through `game.math`.
*/
@:native("Phaser.Math")
extern class Math {

	/**
	* Find the angle of a segment from (x1, y1) -> (x2, y2).
	* 
	* @param x1 The x coordinate of the first value.
	* @param y1 The y coordinate of the first value.
	* @param x2 The x coordinate of the second value.
	* @param y2 The y coordinate of the second value.
	* @return The angle, in radians.
	*/
	static function angleBetween(x1:Float, y1:Float, x2:Float, y2:Float):Float;
	
	/**
	* Find the angle of a segment from (point1.x, point1.y) -> (point2.x, point2.y).
	* 
	* @param point1 The first point.
	* @param point2 The second point.
	* @return The angle between the two points, in radians.
	*/
	static function angleBetweenPoints(point1:phaser.Point, point2:phaser.Point):Float;
	
	/**
	* Find the angle of a segment from (x1, y1) -> (x2, y2).
	* 
	* The difference between this method and Math.angleBetween is that this assumes the y coordinate travels
	* down the screen.
	* 
	* @param x1 The x coordinate of the first value.
	* @param y1 The y coordinate of the first value.
	* @param x2 The x coordinate of the second value.
	* @param y2 The y coordinate of the second value.
	* @return The angle, in radians.
	*/
	static function angleBetweenY(x1:Float, y1:Float, x2:Float, y2:Float):Float;
	
	/**
	* Find the angle of a segment from (point1.x, point1.y) -> (point2.x, point2.y).
	* 
	* @param point1 
	* @param point2 
	* @return The angle, in radians.
	*/
	static function angleBetweenPointsY(point1:phaser.Point, point2:phaser.Point):Float;
	
	/**
	* Averages all values passed to the function and returns the result.
	* 
	* @return The average of all given values.
	*/
	static function average(numbers:Rest<Float>):Float;
	
	/**
	* undefined
	* 
	* @param n 
	* @param i 
	*/
	static function bernstein(n:Float, i:Float):Float;
	
	/**
	* Returns a random float in the range `[min, max)`. If these parameters are not in order than they will be put in order.
	* Default is 0 for `min` and 1 for `max`.
	* 
	* @param min The minimum value. Must be a Number.
	* @param max The maximum value. Must be a Number.
	* @return A floating point number between min (inclusive) and max (exclusive).
	*/
	static function random(min:Float, max:Float):Float;
	
	/**
	* Returns a random integer in the range `[min, max]`. If these parameters are not in order than they will be put in order.
	* Default is 0 for `min` and 1 for `max`.
	* 
	* @param min The minimum value. Must be a Number.
	* @param max The maximum value. Must be a Number.
	* @return An integer between min (inclusive) and max (inclusive).
	*/
	static function between(min:Float, max:Float):Float;
	
	/**
	* A Bezier Interpolation Method, mostly used by Phaser.Tween.
	* 
	* @param v The input array of values to interpolate between.
	* @param k The percentage of interpolation, between 0 and 1.
	* @return The interpolated value
	*/
	static function bezierInterpolation(v:Array<Float>, k:Float):Float;
	
	/**
	* Calculates a catmum rom value.
	* 
	* @param p0 
	* @param p1 
	* @param p2 
	* @param p3 
	* @param t 
	*/
	static function catmullRom(p0:Float, p1:Float, p2:Float, p3:Float, t:Float):Float;
	
	/**
	* A Catmull Rom Interpolation Method, mostly used by Phaser.Tween.
	* 
	* @param v The input array of values to interpolate between.
	* @param k The percentage of interpolation, between 0 and 1.
	* @return The interpolated value
	*/
	static function catmullRomInterpolation(v:Array<Float>, k:Float):Float;
	
	/**
	* Ceils to some place comparative to a `base`, default is 10 for decimal place.
	* The `place` is represented by the power applied to `base` to get that place.
	* 
	* @param value The value to round.
	* @param place The place to round to.
	* @param base The base to round in. Default is 10 for decimal. - Default: 10
	* @return The rounded value.
	*/
	static function ceilTo(value:Float, ?place:Float, ?base:Float):Float;
	
	/**
	* Force a value within the boundaries by clamping it to the range `min`, `max`.
	* 
	* @param v The value to be clamped.
	* @param min The minimum bounds.
	* @param max The maximum bounds.
	* @return The clamped value.
	*/
	static function clamp(x:Float, a:Float, b:Float):Float;
	
	/**
	* Clamp `x` to the range `[a, Infinity)`.
	* Roughly the same as `Math.max(x, a)`, except for NaN handling.
	* 
	* @param x 
	* @param a 
	*/
	static function clampBottom(x:Float, a:Float):Float;
	
	/**
	* Convert degrees to radians.
	* 
	* @param degrees Angle in degrees.
	* @return Angle in radians.
	*/
	static function degToRad(degrees:Float):Float;
	
	/**
	* The absolute difference between two values.
	* 
	* @param a The first value to check.
	* @param b The second value to check.
	* @return The absolute difference between the two values.
	*/
	static function difference(a:Float, b:Float):Float;
	
	/**
	* Returns the euclidian distance between the two given set of coordinates.
	* 
	* @param x1 
	* @param y1 
	* @param x2 
	* @param y2 
	* @return The distance between the two sets of coordinates.
	*/
	static function distance(x1:Float, y1:Float, x2:Float, y2:Float):Float;
	
	/**
	* Returns the euclidean distance squared between the two given set of
	* coordinates (cuts out a square root operation before returning).
	* 
	* @param x1 
	* @param y1 
	* @param x2 
	* @param y2 
	* @return The distance squared between the two sets of coordinates.
	*/
	static function distanceSq(x1:Float, y1:Float, x2:Float, y2:Float):Float;
	
	/**
	* Returns the distance between the two given set of coordinates at the power given.
	* 
	* @param x1 
	* @param y1 
	* @param x2 
	* @param y2 
	* @param pow - Default: 2
	* @return The distance between the two sets of coordinates.
	*/
	static function distancePow(xy:Float, y1:Float, x2:Float, y2:Float, ?pow:Float):Float;
	
	/**
	* undefined
	* 
	* @param value the number you want to evaluate
	*/
	static function factorial(value:Float):Float;
	
	/**
	* Floors to some place comparative to a `base`, default is 10 for decimal place.
	* The `place` is represented by the power applied to `base` to get that place.
	* 
	* @param value The value to round.
	* @param place The place to round to.
	* @param base The base to round in. Default is 10 for decimal. - Default: 10
	* @return The rounded value.
	*/
	static function floorTo(value:Float, place:Float, base:Float):Float;
	
	/**
	* Applies a fuzzy ceil to the given value.
	* 
	* @param val The value to ceil.
	* @param epsilon The epsilon (a small value used in the calculation) - Default: 0.0001
	* @return ceiling(val-epsilon)
	*/
	static function fuzzyCeil(val:Float, ?epsilon:Float):Bool;
	
	/**
	* Two number are fuzzyEqual if their difference is less than epsilon.
	* 
	* @param a The first number to compare.
	* @param b The second number to compare.
	* @param epsilon The epsilon (a small value used in the calculation) - Default: 0.0001
	* @return True if |a-b|<epsilon
	*/
	static function fuzzyEqual(a:Float, b:Float, ?epsilon:Float):Bool;
	
	/**
	* `a` is fuzzyLessThan `b` if it is less than b + epsilon.
	* 
	* @param a The first number to compare.
	* @param b The second number to compare.
	* @param epsilon The epsilon (a small value used in the calculation) - Default: 0.0001
	* @return True if a<b+epsilon
	*/
	@:overload(function(a:Float, b:Float, ?epsilon:Float):Bool{})
	static function fuzzyLessThan(a:Float, b:Float, ?epsilon:Float):Bool;
	
	/**
	* Applies a fuzzy floor to the given value.
	* 
	* @param val The value to floor.
	* @param epsilon The epsilon (a small value used in the calculation) - Default: 0.0001
	* @return floor(val+epsilon)
	*/
	static function fuzzyFloor(val:Float, ?epsilon:Float):Bool;
	
	/**
	* `a` is fuzzyGreaterThan `b` if it is more than b - epsilon.
	* 
	* @param a The first number to compare.
	* @param b The second number to compare.
	* @param epsilon The epsilon (a small value used in the calculation) - Default: 0.0001
	* @return True if a>b+epsilon
	*/
	static function fuzzyGreaterThan(a:Float, b:Float, ?epsilon:Float):Bool;
	
	/**
	* Gets the shortest angle between `angle1` and `angle2`.
	* Both angles must be in the range -180 to 180, which is the same clamped
	* range that `sprite.angle` uses, so you can pass in two sprite angles to
	* this method, and get the shortest angle back between the two of them.
	* 
	* The angle returned will be in the same range. If the returned angle is
	* greater than 0 then it's a counter-clockwise rotation, if < 0 then it's
	* a clockwise rotation.
	* 
	* @param angle1 The first angle. In the range -180 to 180.
	* @param angle2 The second angle. In the range -180 to 180.
	* @return The shortest angle, in degrees. If greater than zero it's a counter-clockwise rotation.
	*/
	static function getShortestAngle(angle1:Float, angle2:Float):Float;
	
	/**
	* Given a number, this function returns the closest number that is a power of two.
	* This function is from the Starling Framework.
	* 
	* @param value The value to get the closest power of two from.
	* @return The closest number that is a power of two.
	*/
	static function getNextPowerOfTwo(value:Float):Float;
	
	/**
	* Returns true if the number given is even.
	* 
	* @param n The number to check.
	* @return True if the given number is even. False if the given number is odd.
	*/
	static function isEven(n:Float):Bool;
	
	/**
	* Returns true if the number given is odd.
	* 
	* @param n The number to check.
	* @return True if the given number is odd. False if the given number is even.
	*/
	static function isOdd(n:Float):Bool;
	
	/**
	* Checks if the given dimensions make a power of two texture.
	* 
	* @param width The width to check.
	* @param height The height to check.
	* @return True if the width and height are a power of two.
	*/
	static function isPowerOfTwo(width:Float, height:Float):Bool;
	
	/**
	* Calculates a linear (interpolation) value over t.
	* 
	* @param p0 
	* @param p1 
	* @param t A value between 0 and 1.
	*/
	static function linear(p0:Float, p1:Float, t:Float):Float;
	
	/**
	* A Linear Interpolation Method, mostly used by Phaser.Tween.
	* 
	* @param v The input array of values to interpolate between.
	* @param k The percentage of interpolation, between 0 and 1.
	* @return The interpolated value
	*/
	static function linearInterpolation(v:Array<Float>, k:Float):Float;
	
	/**
	* Linear mapping from range <a1, a2> to range <b1, b2>
	* 
	* @param x The value to map
	* @param a1 First endpoint of the range <a1, a2>
	* @param a2 Final endpoint of the range <a1, a2>
	* @param b1 First endpoint of the range <b1, b2>
	* @param b2 Final endpoint of the range  <b1, b2>
	*/
	static function mapLinear(x:Float, a1:Float, a2:Float, b1:Float, b2:Float):Float;
	
	/**
	* Variation of Math.max that can be passed either an array of numbers or the numbers as parameters.
	* 
	* Prefer the standard `Math.max` function when appropriate.
	* 
	* @return The largest value from those given.
	*/
	static function max(numbers:Rest<Float>):Float;
	
	/**
	* Adds the given amount to the value, but never lets the value go over the specified maximum.
	* 
	* @param value The value to add the amount to.
	* @param amount The amount to add to the value.
	* @param max The maximum the value is allowed to be.
	* @return The new value.
	*/
	static function maxAdd(value:Float, amount:Float, max:Float):Float;
	
	/**
	* Variation of Math.max that can be passed a property and either an array of objects or the objects as parameters.
	* It will find the largest matching property value from the given objects.
	* 
	* @return The largest value from those given.
	*/
	static function maxProperty(numbers:Rest<Float>):Float;
	
	/**
	* Variation of Math.min that can be passed either an array of numbers or the numbers as parameters.
	* 
	* Prefer the standard `Math.min` function when appropriate.
	* 
	* @return The lowest value from those given.
	*/
	static function min(numbers:Rest<Float>):Float;
	
	/**
	* Variation of Math.min that can be passed a property and either an array of objects or the objects as parameters.
	* It will find the lowest matching property value from the given objects.
	* 
	* @return The lowest value from those given.
	*/
	static function minProperty(numbers:Rest<Float>):Float;
	
	/**
	* Subtracts the given amount from the value, but never lets the value go below the specified minimum.
	* 
	* @param value The base value.
	* @param amount The amount to subtract from the base value.
	* @param min The minimum the value is allowed to be.
	* @return The new value.
	*/
	static function minSub(value:Float, amount:Float, min:Float):Float;
	
	/**
	* Normalizes an angle to the [0,2pi) range.
	* 
	* @param angleRad The angle to normalize, in radians.
	* @return The angle, fit within the [0,2pi] range, in radians.
	*/
	static function normalizeAngle(angle:Float, ?radians:Bool):Float;
	
	/**
	* Work out what percentage value `a` is of value `b` using the given base.
	* 
	* @param a The value to work out the percentage for.
	* @param b The value you wish to get the percentage of.
	* @param base The base value.
	* @return The percentage a is of b, between 0 and 1.
	*/
	static function percent(a:Float, b:Float, ?base:Float):Float;
	
	static function p2px(v:Float):Float;
	
	/**
	* Twice PI.
	* Default: ~6.283
	*/
	static var PI2:Float;
	
	/**
	* Convert radians to degrees.
	* 
	* @param radians Angle in radians.
	* @return Angle in degrees
	*/
	static function radToDeg(radians:Float):Float;
	
	/**
	* Reverses an angle.
	* 
	* @param angleRad The angle to reverse, in radians.
	* @return The reverse angle, in radians.
	*/
	static function reverseAngle(angleRed:Float):Float;
	
	/**
	* Rotates currentAngle towards targetAngle, taking the shortest rotation distance.
	* The lerp argument is the amount to rotate by in this call.
	* 
	* @param currentAngle The current angle, in radians.
	* @param targetAngle The target angle to rotate to, in radians.
	* @param lerp The lerp value to add to the current angle. - Default: 0.05
	* @return The adjusted angle.
	*/
	static function rotateToAngle(currentAngle:Float, targetAngle:Float, ?lerp:Float):Float;
	
	/**
	* Round to the next whole number _away_ from zero.
	* 
	* @param value Any number.
	* @return The rounded value of that number.
	*/
	static function roundAwayFromZero(value:Float):Float;
	
	/**
	* Round to some place comparative to a `base`, default is 10 for decimal place.
	* The `place` is represented by the power applied to `base` to get that place.
	* 
	*      e.g. 2000/7 ~= 285.714285714285714285714 ~= (bin)100011101.1011011011011011
	* 
	*      roundTo(2000/7,3) === 0
	*      roundTo(2000/7,2) == 300
	*      roundTo(2000/7,1) == 290
	*      roundTo(2000/7,0) == 286
	*      roundTo(2000/7,-1) == 285.7
	*      roundTo(2000/7,-2) == 285.71
	*      roundTo(2000/7,-3) == 285.714
	*      roundTo(2000/7,-4) == 285.7143
	*      roundTo(2000/7,-5) == 285.71429
	* 
	*      roundTo(2000/7,3,2)  == 288       -- 100100000
	*      roundTo(2000/7,2,2)  == 284       -- 100011100
	*      roundTo(2000/7,1,2)  == 286       -- 100011110
	*      roundTo(2000/7,0,2)  == 286       -- 100011110
	*      roundTo(2000/7,-1,2) == 285.5     -- 100011101.1
	*      roundTo(2000/7,-2,2) == 285.75    -- 100011101.11
	*      roundTo(2000/7,-3,2) == 285.75    -- 100011101.11
	*      roundTo(2000/7,-4,2) == 285.6875  -- 100011101.1011
	*      roundTo(2000/7,-5,2) == 285.71875 -- 100011101.10111
	* 
	* Note what occurs when we round to the 3rd space (8ths place), 100100000, this is to be assumed
	* because we are rounding 100011.1011011011011011 which rounds up.
	* 
	* @param value The value to round.
	* @param place The place to round to.
	* @param base The base to round in. Default is 10 for decimal. - Default: 10
	* @return The rounded value.
	*/
	static function roundTo(value:Float, ?place:Float, ?base:Float):Float;
	
	/**
	* undefined
	* 
	* @param n 
	* @return n mod 1
	*/
	static function shear(n:Float):Float;
	
	/**
	* A value representing the sign of the value: -1 for negative, +1 for positive, 0 if value is 0.
	* 
	* This works differently from `Math.sign` for values of NaN and -0, etc.
	* 
	* @param x 
	* @return An integer in {-1, 0, 1}
	*/
	static function sign(x:Float):Float;
	
	/**
	* Generate a sine and cosine table simultaneously and extremely quickly.
	* The parameters allow you to specify the length, amplitude and frequency of the wave.
	* This generator is fast enough to be used in real-time.
	* Code based on research by Franky of scene.at
	* 
	* @param length The length of the wave
	* @param sinAmplitude The amplitude to apply to the sine table (default 1.0) if you need values between say -+ 125 then give 125 as the value
	* @param cosAmplitude The amplitude to apply to the cosine table (default 1.0) if you need values between say -+ 125 then give 125 as the value
	* @param frequency The frequency of the sine and cosine table data
	* @return Returns the table data.
	*/
	static function sinCosGenerator(length:Float, ?sinAmplitude:Float, ?cosAmplitude:Float, ?frequency:Float):{sin:Array<Float>, cos:Array<Float>};
	
	/**
	* Returns the length of the hypotenuse connecting two segments of given lengths.
	* 
	* @param a 
	* @param b 
	* @return The length of the hypotenuse connecting the given lengths.
	*/
	static function hypot(a:Float, b:Float):Float;
	
	/**
	* Smootherstep function as detailed at http://en.wikipedia.org/wiki/Smoothstep
	* 
	* @param x The input value.
	* @param min The left edge. Should be smaller than the right edge.
	* @param max The right edge.
	* @return A value between 0 and 1.
	*/
	static function smootherstep(x:Float, min:Float, max:Float):Float;
	
	/**
	* Smoothstep function as detailed at http://en.wikipedia.org/wiki/Smoothstep
	* 
	* @param x The input value.
	* @param min The left edge. Should be smaller than the right edge.
	* @param max The right edge.
	* @return A value between 0 and 1.
	*/
	static function smoothstep(x:Float, min:Float, max:Float):Float;
	
	/**
	* Snap a value to nearest grid slice, using rounding.
	* 
	* Example: if you have an interval gap of 5 and a position of 12... you will snap to 10 whereas 14 will snap to 15.
	* 
	* @param input The value to snap.
	* @param gap The interval gap of the grid.
	* @param start Optional starting offset for gap.
	* @return The snapped value.
	*/
	static function snapTo(input:Float, gap:Float, ?start:Float):Float;
	
	/**
	* Snap a value to nearest grid slice, using ceil.
	* 
	* Example: if you have an interval gap of 5 and a position of 12... you will snap to 15.
	* As will 14 will snap to 15... but 16 will snap to 20.
	* 
	* @param input The value to snap.
	* @param gap The interval gap of the grid.
	* @param start Optional starting offset for gap.
	* @return The snapped value.
	*/
	static function snapToCeil(input:Float, gap:Float, ?start:Float):Float;
	
	/**
	* Snap a value to nearest grid slice, using floor.
	* 
	* Example: if you have an interval gap of 5 and a position of 12... you will snap to 10.
	* As will 14 snap to 10... but 16 will snap to 15.
	* 
	* @param input The value to snap.
	* @param gap The interval gap of the grid.
	* @param start Optional starting offset for gap.
	* @return The snapped value.
	*/
	static function snapToFloor(input:Float, gap:Float, ?start:Float):Float;
	
	/**
	* Checks if two values are within the given tolerance of each other.
	* 
	* @param a The first number to check
	* @param b The second number to check
	* @param tolerance The tolerance. Anything equal to or less than this is considered within the range.
	* @return True if a is <= tolerance of b.
	*/
	static function within(a:Float, b:Float, tolerance:Float):Bool;
	
	/**
	* Ensures that the value always stays between min and max, by wrapping the value around.
	* 
	* If `max` is not larger than `min` the result is 0.
	* 
	* @param value The value to wrap.
	* @param min The minimum the value is allowed to be.
	* @param max The maximum the value is allowed to be, should be larger than `min`.
	* @return The wrapped value.
	*/
	static function wrap(value:Float, min:Float, max:Float):Float;
	
	/**
	* Keeps an angle value between -180 and +180; or -PI and PI if radians.
	* 
	* @param angle The angle value to wrap
	* @param radians Set to `true` if the angle is given in radians, otherwise degrees is expected.
	* @return The new angle value; will be the same as the input angle if it was within bounds.
	*/
	static function wrapAngle(angle:Float, ?radians:Bool):Float;
	
	/**
	* Adds value to amount and ensures that the result always stays between 0 and max, by wrapping the value around.
	* 
	* Values _must_ be positive integers, and are passed through Math.abs. See {@link Phaser.Math#wrap} for an alternative.
	* 
	* @param value The value to add the amount to.
	* @param amount The amount to add to the value.
	* @param max The maximum the value is allowed to be.
	* @return The wrapped value.
	*/
	static function wrapValue(value:Float, amount:Float, max:Float):Float;
	
}

