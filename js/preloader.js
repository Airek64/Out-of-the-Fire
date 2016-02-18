BasicGame.Preloader = function (game) {

	//this.background = null;
	//this.preloadBar = null;

    this.game = game;
	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

//		//	These are the assets we loaded in Boot.js
//		//	A nice sparkly background and a loading progress bar
//		this.background = this.add.sprite(0, 0, 'preloaderBackground');
//		this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');
//
//		//	This sets the preloadBar sprite as a loader sprite.
//		//	What that does is automatically crop the sprite from 0 to full-width
//		//	as the files below are loaded in.
//		this.load.setPreloadSprite(this.preloadBar);
//
//		//	Here we load the rest of the assets our game needs.
//		//	As this is just a Project Template I've not provided these assets, swap them for your own.
//		this.load.image('titlepage', 'images/title.jpg');
//		this.load.atlas('playButton', 'images/play_button.png', 'images/play_button.json');
//		this.load.audio('titleMusic', ['audio/main_menu.mp3']);
//		this.load.bitmapFont('caslon', 'fonts/caslon.png', 'fonts/caslon.xml');
//		//	+ lots of other required assets here
        this.load.image( 'bg', 'assets/background.png' );
        this.load.image('wall', 'assets/wall.png');
        this.load.spritesheet('lantern', 'assets/Lantern.png', 80, 80);
        this.load.spritesheet('fireball', 'assets/fireball.png', 20, 20);
        this.load.spritesheet( 'player', 'assets/playerAnim.png', 30, 40);
        this.load.image('door', 'assets/door.png');
        this.load.audio('hurt', 'assets/Hit_Hurt.ogg');
        this.load.audio('light', 'assets/fire.ogg');
        this.load.audio('jump', 'assets/Jump.ogg');
        this.load.audio('open', 'assets/door_open.ogg');
        this.load.audio('music', 'assets/LevelTheme01.ogg');
        this.load.image('button', 'assets/start.png');

	},

	create: function () {
        BasicGame.player = new BasicGame.Player(this.game);
        BasicGame.fireball = new BasicGame.Fireball(this.game);
        
        this.music = this.add.audio('music');
        this.music.loop = true;
		this.music.play();
        this.music.onLoop.add(this.playLevelMusic, this);

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		//this.preloadBar.cropEnabled = false;

	},
    
    playLevelMusic: function(){
        this.music.play();  
    },

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
//		if (this.cache.isSoundDecoded('music') && this.ready == false)
//		{
			this.ready = true;
			this.state.start('MainMenu');
//		}

	}

};