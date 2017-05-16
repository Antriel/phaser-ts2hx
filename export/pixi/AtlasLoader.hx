package pixi;

@:native("PIXI.AtlasLoader")
extern class AtlasLoader implements Mixin {

	var url:String;
	
	var baseUrl:String;
	
	var crossorigin:Bool;
	
	var loaded:Bool;
	
	function new(url:String, crossorigin:Bool);
	
	function listeners(eventName:String):Array<Dynamic>;
	
	function emit(eventName:String, ?data:Dynamic):Bool;
	
	function dispatchEvent(eventName:String, ?data:Dynamic):Bool;
	
	function on(eventName:String, fn:Dynamic):Dynamic;
	
	function addEventListener(eventName:String, fn:Dynamic):Dynamic;
	
	function once(eventName:String, fn:Dynamic):Dynamic;
	
	function off(eventName:String, fn:Dynamic):Dynamic;
	
	function removeAllEventListeners(eventName:String):Void;
	
	function load():Void;
	
}

