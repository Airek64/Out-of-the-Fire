BasicGame.Level1 = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

//global variables
    //var fireball;
    //var player;
    var background;
    var wall;
    var facing = 'left';
    var jumpTimer = 0;
    var cursors;
    var jumpButton;
    var move = false;
    var lanterns;
    var door;
    var health;
    var doorOpen = false;
    var cooldown = 0;
    var hurtSound;
    var jumpSound;
    var lightSound;
    var doorSound;
    var music;
    

BasicGame.Level1.prototype = {

    create: function () {
        
        //initialize sound
        lightSound = this.add.audio('light');
        doorSound = this.add.audio('open');
        doorOpen = false;

        
        //initialize background (and wall)
        background = this.add.tileSprite(0, 0, 800, 600, 'bg');
        background.fixedToCamera = true;
        wall = this.add.tileSprite(0, 400, 800, 200, 'wall');
        wall.fixedToCamera = true;
        
        //initialize lantern group
        lanterns = this.add.group();
        lanterns.enableBody = true;
        lanterns.physicsBodyType = Phaser.Physics.ARCADE;
        
        //loop 3 times to create evenly spaced lanterns
        var lantern;
        for (var i = 0; i < 3; i++){
            lantern = lanterns.create( 200 + i * 100, 550, 'lantern');
            lantern.body.immovable = true;
            lantern.body.allowGravity = false; 
            lantern.body.setSize(40,40);
            lantern.anchor.setTo(0.5,0.5);
            lantern.animations.add('lit', [1,2], 5, true);
        }
        //add one more latern above the rest
        lantern = lanterns.create( 300, 450, 'lantern');
        lantern.body.immovable = true;
        lantern.body.allowGravity = false;
        lantern.body.setSize(40,40);
        lantern.anchor.setTo(0.5,0.5);
        lantern.animations.add('lit', [1,2], 5, true);
        
        //initialize player
        BasicGame.player.add(100,560);
        //for when scrolling is added
        this.camera.follow(BasicGame.player.sprite);
        
        //initialize fireball
        BasicGame.fireball.add(20,560);
        
        //initalize gravity
        this.physics.arcade.gravity.y = 400;
        
    },

    update: function () {

        BasicGame.player.update();
        BasicGame.fireball.update();
    
        //check lantern collisions
        var lantern;
        var check = true;
        for (var i = 0; i < lanterns.length; i++){
            lantern = lanterns.getChildAt(i);
            //if still the first frame then it hasn't been lit
            if (lantern.frame == 0){
                check = false;
                //light this latern if fireball colides with it
                if (this.physics.arcade.intersects(BasicGame.fireball.sprite.body, lantern.body)){
                    lightSound.play();
                    lantern.frame = 1;
                    lantern.animations.play('lit');
                }
            } 
        }
        //check if all lanterns lit and then create door
        if (check && !doorOpen){
            doorSound.play();
            door = this.add.sprite(700, 520, 'door');
            this.physics.enable(door, Phaser.Physics.ARCADE);
            door.body.immovable = true;
            door.body.allowGravity = false;
//            door.anchor.setTo(0.5,0.5);
//            door.body.setSize(1,10);
            doorOpen = true;
        }
        
        //check if player leaves through the door end game
        if (doorOpen){
            if (this.physics.arcade.intersects(BasicGame.player.sprite.body, door.body)){
                this.playerExit();
            }
            if (this.physics.arcade.intersects(BasicGame.fireball.sprite.body, door.body)){
                BasicGame.fireball.sprite.kill();
                this.state.start('Level2');
            }
        }
        
        //end game if player health gone
        if (BasicGame.player.health <= 0){
            this.gameOver();
        }
        
        
    },
    
    //function to end the level. currently kills player, because 
    playerExit: function(){
        BasicGame.player.hasMoved = false;
//        BasicGame.fireball.sprite.body.velocity.x = 0;
//        BasicGame.fireball.sprite.body.velocity.y = 0;
        BasicGame.player.sprite.kill();
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = this.add.text( this.world.centerX, 15, "Level Complete", style );
        text.anchor.setTo( 0.5, 0.0 );
    },
    
    //function that occurs on player death. 
    gameOver: function(){
        BasicGame.player.hasMoved = false;
        BasicGame.fireball.sprite.body.velocity.x = 0;
        BasicGame.fireball.sprite.body.velocity.y = 0;
        BasicGame.player.sprite.kill();
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = this.add.text( this.world.centerX, 15, "Game Over", style );
        text.anchor.setTo( 0.5, 0.0 );
        this.quitGame();
        
    },

    quitGame: function () {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }
};