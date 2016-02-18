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
    var fireball;
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

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        //initialize health
        //health = 3;
        
        //initialize sound
//        hurtSound = this.add.audio('hurt');
//        jumpSound = this.add.audio('jump');
        lightSound = this.add.audio('light');
        doorSound = this.add.audio('open');
//        music = this.add.audio('music', 1, true,true);
//        music.play('', 0,1,true, true);
        
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
        
        //initialize the player
//        player = this.add.sprite(100, 560, 'player');
//        this.physics.enable(player, Phaser.Physics.ARCADE);
//        player.body.collideWorldBounds = true;
//        player.body.setSize(30, 40);
//        //player animations
//        player.animations.add('run-normal-right', [1,2,3], 10, true);
//        player.animations.add('run-normal-left', [8,7,6], 10, true);
//        player.animations.add('run-hot-right', [11,12,13], 10, true);
//        player.animations.add('run-hot-left', [18,17,16], 10, true);
//        player.animations.add('run-burning-right', [21,22,23], 10, true);
//        player.animations.add('run-burning-left', [28,27,26], 10, true);
        BasicGame.player.add(100,560);
        //for when scrolling is added
        this.camera.follow(BasicGame.player.sprite);
        
        //initialize fireball
        fireball = this.add.sprite( 20, 560, 'fireball' );
        fireball.anchor.setTo( 0.5, 0.5 );
        fireball.animations.add('standard', [0, 1, 2, 1], 5, true);
        fireball.animations.play('standard');
        this.physics.enable( fireball, Phaser.Physics.ARCADE );
        fireball.body.allowGravity = false;
        fireball.body.setSize(20,20);

        
        
        //initalize gravity
        this.physics.arcade.gravity.y = 400;
        
        //initialize inputs
//        cursors = this.input.keyboard.createCursorKeys();
//        jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.UP);
    },

    update: function () {

        BasicGame.player.update();
//        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
//        //stop the player
//        player.body.velocity.x = 0;
//    
//        //check inputs to move the player and handle animations
//        if (cursors.left.isDown){
//            move = true; //for use in moving the fireball only aftet player has moved
//            player.body.velocity.x = -150;
//            if (facing != 'left' && player.body.onFloor()){
//                //3 different sets of the same animations with different color player
//                if (health == 3){
//                    player.animations.play('run-normal-left');
//                }
//                else if (health == 2){
//                    player.animations.play('run-hot-left');
//                }
//                else {
//                    player.animations.play('run-burning-left');
//                }
//                facing = 'left';
//            }
//        }
//        else if (cursors.right.isDown){
//            move = true;
//            player.body.velocity.x = 150;  
//            if (facing != 'right' && player.body.onFloor()){
//                if (health == 3){
//                    player.animations.play('run-normal-right');
//                }
//                else if (health == 2){
//                    player.animations.play('run-hot-right');
//                }
//                else {
//                    player.animations.play('run-burning-right');
//                }
//                facing = 'right';
//            }
//
//        }
//        else{
//            //check if standing still instead of moving
//            if (facing != 'idle'){
//                player.animations.stop();
//                //decide in which direction to stand still
//                if (facing == 'right'){
//                    if (health == 3){
//                        player.frame = 0;
//                    }
//                    else if (health == 2){
//                        player.frame = 10;
//                    }
//                    else {
//                        player.frame = 20;
//                    }
//                }
//                else{
//                    if (health == 3){
//                        player.frame = 9;
//                    }
//                    else if (health == 2){
//                        player.frame = 19;
//                    }
//                    else {
//                        player.frame = 29;
//                    }
//                }
//                facing = 'idle';
//            }
//        }
//
//        //jump when on the ground
//        if (jumpButton.isDown && player.body.onFloor() && this.time.now > jumpTimer)
//        {
//            player.animations.stop();
//            jumpSound.play();
//            if (facing == 'right')
//            {
//                if (health == 3){
//                    player.frame = 4;
//                }
//                else if (health == 2){
//                    player.frame = 14;
//                }
//                else {
//                    player.frame = 24;
//                }
//            }
//            else
//            {
//                if (health == 3){
//                    player.frame = 5;
//                }
//                else if (health == 2){
//                    player.frame = 15;
//                }
//                else {
//                    player.frame = 25;
//                }
//            }
//            player.body.velocity.y = -250;
//            jumpTimer = this.time.now + 750;
//        }
        
        //move fireball towards player
        if (BasicGame.player.hasMoved){
            fireball.rotation = this.physics.arcade.accelerateToObject(fireball, BasicGame.player.sprite, 170, 170, 80);
        }
        
        //could have used timer, but didn't
        cooldown -= 1;
        
        //check if fireball has hit the player if so, damamge and bounce player
        if (this.physics.arcade.intersects(BasicGame.player.sprite.body, fireball.body) && cooldown <= 0){
            BasicGame.player.hurtSound.play();
            BasicGame.player.health -= 1;
            cooldown = 20;
            //BasicGame.player.sprite.body.velocity.x += fireball.body.acceleration.x ;
            BasicGame.player.sprite.body.velocity.y += fireball.body.acceleration.y * 2;
            if (BasicGame.player.health == 2){
                BasicGame.player.sprite.frame = 15;
            }
            else {
                BasicGame.player.sprite.frame = 25
            }
        }
    
        //check lantern collisions
        var lantern;
        var check = true;
        for (var i = 0; i < lanterns.length; i++){
            lantern = lanterns.getChildAt(i);
            //if still the first frame then it hasn't been lit
            if (lantern.frame == 0){
                check = false;
                //light this latern if fireball colides with it
                if (this.physics.arcade.intersects(fireball.body, lantern.body)){
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
            doorOpen = true;
        }
        
        //check if player leaves through the door end game
        if (door != null){
            if (this.physics.arcade.intersects(BasicGame.player.sprite.body, door.body)){
                this.playerExit();
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
        fireball.body.velocity.x = 0;
        fireball.body.velocity.y = 0;
        BasicGame.player.sprite.kill();
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = this.add.text( this.world.centerX, 15, "Level Complete", style );
        text.anchor.setTo( 0.5, 0.0 );
    },
    
    //function that occurs on player death. 
    gameOver: function(){
        BasicGame.player.hasMoved = false;
        fireball.body.velocity.x = 0;
        fireball.body.velocity.y = 0;
        BasicGame.player.sprite.kill();
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = this.add.text( this.world.centerX, 15, "Game Over", style );
        text.anchor.setTo( 0.5, 0.0 );
        
    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }
};