window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load background and player
        game.load.image( 'bg', 'assets/background.png' );
        game.load.image('wall', 'assets/wall.png');
        game.load.spritesheet('lantern', 'assets/Lantern.png', 80, 80);
        game.load.spritesheet('fireball', 'assets/fireball.png', 20, 20);
        game.load.spritesheet( 'player', 'assets/playerAnim.png', 30, 40);
        game.load.image('door', 'assets/door.png');
        game.load.audio('hurt', 'assets/Hit_Hurt.ogg');
        game.load.audio('light', 'assets/fire.ogg');
        game.load.audio('jump', 'assets/Jump.ogg');
        game.load.audio('open', 'assets/door_open.ogg');
    }
    
    var fireball;
    var player;
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
    
    function create() {
        health = 3;
        
        hurtSound = game.add.audio('hurt');
        jumpSound = game.add.audio('jump');
        lightSound = game.add.audio('light');
        doorSound = game.add.audio('open');
        
        background = game.add.tileSprite(0, 0, 800, 600, 'bg');
        background.fixedToCamera = true;
        wall = game.add.tileSprite(0, 400, 800, 200, 'wall');
        wall.fixedToCamera = true;
        
        lanterns = game.add.group();
        lanterns.enableBody = true;
        lanterns.physicsBodyType = Phaser.Physics.ARCADE;
        
        //lanterns.body.immovable = true;
        var lantern;
        for (var i = 0; i < 3; i++){
            lantern = lanterns.create( 200 + i * 100, 550, 'lantern');
            lantern.body.immovable = true;
            lantern.body.allowGravity = false;
            lantern.body.setSize(40,40);
            lantern.anchor.setTo(0.5,0.5);
            lantern.animations.add('lit', [1,2], 5, true);
        }
        lantern = lanterns.create( 300, 450, 'lantern');
        lantern.body.immovable = true;
        lantern.body.allowGravity = false;
        lantern.body.setSize(40,40);
        lantern.anchor.setTo(0.5,0.5);
        lantern.animations.add('lit', [1,2], 5, true);
        
        
        player = game.add.sprite(100, 560, 'player');
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.collideWorldBounds = true;
        player.body.setSize(30, 40);
        player.animations.add('run-normal-right', [1,2,3], 10, true);
        player.animations.add('run-normal-left', [8,7,6], 10, true);
        player.animations.add('run-hot-right', [11,12,13], 10, true);
        player.animations.add('run-hot-left', [18,17,16], 10, true);
        player.animations.add('run-burning-right', [21,22,23], 10, true);
        player.animations.add('run-burning-left', [28,27,26], 10, true);
        
        fireball = game.add.sprite( 20, 560, 'fireball' );
        fireball.anchor.setTo( 0.5, 0.5 );
        fireball.animations.add('standard', [0, 1, 2, 1], 5, true);
        fireball.animations.play('standard');
        game.physics.enable( fireball, Phaser.Physics.ARCADE );
        fireball.body.allowGravity = false;
        fireball.body.setSize(20,20);

        
        game.camera.follow(player);
        
        game.physics.arcade.gravity.y = 400;
        
        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        
    
        // Make it bounce off of the world bounds.
        //fireball.body.collideWorldBounds = true;
        
    
    }
    
    function update() {
        //game.physics.arcade.collide(player, layer);
        
        player.body.velocity.x = 0;
    
        //control movement
        if (cursors.left.isDown)
        {
            move = true;
            player.body.velocity.x = -150;
            
            if (facing != 'left' && player.body.onFloor())
            {
                if (health == 3){
                    player.animations.play('run-normal-left');
                }
                else if (health == 2){
                    player.animations.play('run-hot-left');
                }
                else {
                    player.animations.play('run-burning-left');
                }
                facing = 'left';
            }

        }
        else if (cursors.right.isDown)
        {
            move = true;
            player.body.velocity.x = 150;
            
            if (facing != 'right' && player.body.onFloor())
            {
                if (health == 3){
                    player.animations.play('run-normal-right');
                }
                else if (health == 2){
                    player.animations.play('run-hot-right');
                }
                else {
                    player.animations.play('run-burning-right');
                }
                facing = 'right';
            }

        }
        else
        {
            if (facing != 'idle')
            {
                player.animations.stop();

                if (facing == 'right')
                {
                    if (health == 3){
                        player.frame = 0;
                    }
                    else if (health == 2){
                        player.frame = 10;
                    }
                    else {
                        player.frame = 20;
                    }
                }
                else
                {
                    if (health == 3){
                        player.frame = 9;
                    }
                    else if (health == 2){
                        player.frame = 19;
                    }
                    else {
                        player.frame = 29;
                    }
                }

                facing = 'idle';
            }
        }

        //control jump
        if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
        {
            player.animations.stop();
            jumpSound.play();
            if (facing == 'right')
            {
                if (health == 3){
                    player.frame = 4;
                }
                else if (health == 2){
                    player.frame = 14;
                }
                else {
                    player.frame = 24;
                }
            }
            else
            {
                if (health == 3){
                    player.frame = 5;
                }
                else if (health == 2){
                    player.frame = 15;
                }
                else {
                    player.frame = 25;
                }
            }
            player.body.velocity.y = -250;
            jumpTimer = game.time.now + 750;
        }
        
        //move fireball
        if (move){
            fireball.rotation = game.physics.arcade.accelerateToObject(fireball, player, 170, 170, 80);
            //game.physics.arcade.moveToObject(fireball, player, 100);
        }
        
        //fireball.rotation = game.physics.arcade.accelerateToPointer( fireball, player, 500, 500, 500 );
        
        //game.physics.arcade.collide(fireball, lanterns, fireHitLantern, null, this);
        
        cooldown -= 1;
        
        if (game.physics.arcade.intersects(player.body, fireball.body) && cooldown <= 0){
            hurtSound.play();
            health -= 1;
            cooldown = 20;
            player.body.velocity.x += fireball.body.acceleration.x ;
            player.body.velocity.y += fireball.body.acceleration.y * 2;
            if (health == 2){
                player.frame = 15;
            }
            else {
                player.frame = 25
            }
        }
    
        //check lantern collisions
        var lantern;
        var check = true;
        for (var i = 0; i < lanterns.length; i++){
            lantern = lanterns.getChildAt(i);
            if (lantern.frame == 0){
                check = false;
                //game.physics.arcade.collide(fireball, lantern, fireHitLantern, null, this);
                if (game.physics.arcade.intersects(fireball.body, lantern.body)){
                    lightSound.play();
                    lantern.frame = 1;
                    lantern.animations.play('lit');
                }
            } 
        }
        //check if all lanterns lit
        if (check && !doorOpen){
            doorSound.play();
            door = game.add.sprite(700, 520, 'door');
            game.physics.enable(door, Phaser.Physics.ARCADE);
            door.body.immovable = true;
            door.body.allowGravity = false;
            doorOpen = true;
        }
        
        //check if player leaves through the door.
        if (door != null){
            //game.physics.arcade.collide(player, door, playerExit, null, this);
            if (game.physics.arcade.intersects(player.body, door.body)){
                playerExit();
            }
        }
        
        if (health <= 0){
            gameOver();
        }
    }
    
    function fireHitLantern(_fireball, _lantern){
        //litLanterns.create(_lantern.x, _lantern.y, 'lit lantern');
        if (_lantern.frame == 0){
            _lantern.frame = 1;
        }
    }
    
    function playerExit(){
        move = false;
        fireball.body.velocity.x = 0;
        fireball.body.velocity.y = 0;
        player.kill();
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = game.add.text( game.world.centerX, 15, "Level Complete", style );
        text.anchor.setTo( 0.5, 0.0 );
    }
    
    function gameOver(){
        move = false;
        fireball.body.velocity.x = 0;
        fireball.body.velocity.y = 0;
        player.kill();
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = game.add.text( game.world.centerX, 15, "Game Over", style );
        text.anchor.setTo( 0.5, 0.0 );
        
    }
};
