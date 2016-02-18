BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;
    //this.wall = null;
};

BasicGame.MainMenu.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

//		this.music = this.add.audio('music');
//        this.music.loop = true;
//		this.music.play();
//        this.music.onLoop.add(this.playLevelMusic, this);

		this.add.sprite(0, 0, 'bg');
        this.add.tileSprite(0, 400, 800, 200, 'wall');

		this.playButton = this.add.button(100, 200, 'button', this.startGame, this);

	},

	update: function () {

//        if (!this.music.isPlaying){
//            this.music.play();
//        }
		//	Do some nice funky main menu effect here

	},
    
//    playLevelMusic: function(){
//        this.music.play();  
//    },

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		//this.music.stop();

		//	And start the actual game
		this.state.start('Level1');
        

	}

};