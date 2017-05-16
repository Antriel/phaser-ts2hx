package phaser;

import haxe.extern.Rest;

/**
* This is a base State class which can be extended if you are creating your own game.
* It provides quick access to common functions such as the camera, cache, input, match, sound and more.
*/
@:native("Phaser.State")
extern class State {

	/**
	* A reference to the GameObjectFactory which can be used to add new objects to the World.
	*/
	var add:phaser.GameObjectFactory;
	
	/**
	* A reference to the game cache which contains any loaded or generated assets, such as images, sound and more.
	*/
	var cache:phaser.Cache;
	
	/**
	* A handy reference to World.camera.
	*/
	var camera:phaser.Camera;
	
	/**
	* This is a reference to the currently running Game.
	*/
	var game:phaser.Game;
	
	/**
	* A reference to the Input Manager.
	*/
	var input:phaser.Input;
	
	/**
	* The string based identifier given to the State when added into the State Manager.
	*/
	var key:String;
	
	/**
	* A reference to the Loader, which you mostly use in the preload method of your state to load external assets.
	*/
	var load:phaser.Loader;
	
	/**
	* A reference to the GameObjectCreator which can be used to make new objects.
	*/
	var make:phaser.GameObjectCreator;
	
	/**
	* The Particle Manager. It is called during the core gameloop and updates any Particle Emitters it has created.
	*/
	var particles:phaser.Particles;
	
	/**
	* A reference to the physics manager which looks after the different physics systems available within Phaser.
	*/
	var physics:phaser.Physics;
	
	/**
	* A reference to the seeded and repeatable random data generator.
	*/
	var rnd:phaser.RandomDataGenerator;
	
	/**
	* A reference to the Scale Manager which controls the way the game scales on different displays.
	*/
	var scale:phaser.ScaleManager;
	
	/**
	* A reference to the Sound Manager which can create, play and stop sounds, as well as adjust global volume.
	*/
	var sound:phaser.SoundManager;
	
	/**
	* A reference to the Stage.
	*/
	var stage:phaser.Stage;
	
	/**
	* A reference to the State Manager, which controls state changes.
	*/
	var state:phaser.StateManager;
	
	/**
	* A reference to the game clock and timed events system.
	*/
	var time:phaser.Time;
	
	/**
	* A reference to the tween manager.
	*/
	var tweens:phaser.TweenManager;
	
	/**
	* A reference to the game world. All objects live in the Game World and its size is not bound by the display resolution.
	*/
	var world:phaser.World;
	
	/**
	* create is called once preload has completed, this includes the loading of any assets from the Loader.
	* If you don't have a preload method then create is the first method called in your State.
	*/
	function create():Void;
	
	/**
	* init is the very first function called when your State starts up. It's called before preload, create or anything else.
	* If you need to route the game away to another State you could do so here, or if you need to prepare a set of variables
	* or objects before the preloading starts.
	*/
	@:overload(function(args:Rest<Dynamic>):Void{})
	function init():Void;
	
	/**
	* loadRender is called during the Loader process. This only happens if you've set one or more assets to load in the preload method.
	* The difference between loadRender and render is that any objects you render in this method you must be sure their assets exist.
	*/
	function loadRender():Void;
	
	/**
	* loadUpdate is called during the Loader process. This only happens if you've set one or more assets to load in the preload method.
	*/
	function loadUpdate():Void;
	
	/**
	* This method will be called if the core game loop is paused.
	*/
	function paused():Void;
	
	/**
	* pauseUpdate is called while the game is paused instead of preUpdate, update and postUpdate.
	*/
	function pauseUpdate():Void;
	
	/**
	* preload is called first. Normally you'd use this to load your game assets (or those needed for the current State)
	* You shouldn't create any objects in this method that require assets that you're also loading in this method, as
	* they won't yet be available.
	*/
	function preload():Void;
	
	/**
	* The preRender method is called after all Game Objects have been updated, but before any rendering takes place.
	*/
	function preRender():Void;
	
	/**
	* Nearly all display objects in Phaser render automatically, you don't need to tell them to render.
	* However the render method is called AFTER the game renderer and plugins have rendered, so you're able to do any
	* final post-processing style effects here. Note that this happens before plugins postRender takes place.
	*/
	function render():Void;
	
	/**
	* If your game is set to Scalemode RESIZE then each time the browser resizes it will call this function, passing in the new width and height.
	*/
	function resize():Void;
	
	/**
	* This method will be called when the core game loop resumes from a paused state.
	*/
	function resumed():Void;
	
	/**
	* This method will be called when the State is shutdown (i.e. you switch to another state from this one).
	*/
	function shutdown():Void;
	
	/**
	* The update method is left empty for your own use.
	* It is called during the core game loop AFTER debug, physics, plugins and the Stage have had their preUpdate methods called.
	* It is called BEFORE Stage, Tweens, Sounds, Input, Physics, Particles and Plugins have had their postUpdate methods called.
	*/
	function update():Void;
	
}

