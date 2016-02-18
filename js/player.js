BasicGame.Player = function(game) {
    
    this.game = game;
    this.health = 3;
    this.sprite = null;
    this.facing;
    this.jumpButton;
    this.cursors;
    this.hasMoved;
    this.jumpTimer;
    this.hurtSound;
    this.jumpSound;
    
}

BasicGame.Player.prototype = {
 
    add: function (x,y){
        //add sprite
        this.sprite = this.game.add.sprite(100, 560, 'player');
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.setSize(30, 40);
        
        //player animations
        this.sprite.animations.add('run-normal-right', [1,2,3], 10, true);
        this.sprite.animations.add('run-normal-left', [8,7,6], 10, true);
        this.sprite.animations.add('run-hot-right', [11,12,13], 10, true);
        this.sprite.animations.add('run-hot-left', [18,17,16], 10, true);
        this.sprite.animations.add('run-burning-right', [21,22,23], 10, true);
        this.sprite.animations.add('run-burning-left', [28,27,26], 10, true);
        
        this.hurtSound = this.game.add.audio('hurt');
        this.jumpSound = this.game.add.audio('jump');
        
        this.facing = 'left';
        
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        
        this.hasMoved = false;
        this.jumpTimer = 0;
        
    },
    
    update: function() {
        this.sprite.body.velocity.x = 0;
    
        //check inputs to move the player and handle animations
        if (this.cursors.left.isDown){
            this.hasMoved = true; //for use in moving the fireball only aftet player has moved
            this.sprite.body.velocity.x = -150;
            if (this.facing != 'left' && this.sprite.body.onFloor()){
                //3 different sets of the same animations with different color player
                if (this.health == 3){
                    this.sprite.animations.play('run-normal-left');
                }
                else if (this.health == 2){
                    this.sprite.animations.play('run-hot-left');
                }
                else {
                    this.sprite.animations.play('run-burning-left');
                }
                this.facing = 'left';
            }
        }
        else if (this.cursors.right.isDown){
            this.hasMoved = true;
            this.sprite.body.velocity.x = 150;  
            if (this.facing != 'right' && this.sprite.body.onFloor()){
                if (this.health == 3){
                    this.sprite.animations.play('run-normal-right');
                }
                else if (this.health == 2){
                    this.sprite.animations.play('run-hot-right');
                }
                else {
                    this.sprite.animations.play('run-burning-right');
                }
                this.facing = 'right';
            }

        }
        else{
            //check if standing still instead of moving
            if (this.facing != 'idle'){
                this.sprite.animations.stop();
                //decide in which direction to stand still
                if (this.facing == 'right'){
                    if (this.health == 3){
                        this.sprite.frame = 0;
                    }
                    else if (this.health == 2){
                        this.sprite.frame = 10;
                    }
                    else {
                        this.sprite.frame = 20;
                    }
                }
                else{
                    if (this.health == 3){
                        this.sprite.frame = 9;
                    }
                    else if (this.health == 2){
                        this.sprite.frame = 19;
                    }
                    else {
                        this.sprite.frame = 29;
                    }
                }
                this.facing = 'idle';
            }
        }

        //jump when on the ground
        if (this.jumpButton.isDown && this.sprite.body.onFloor() && this.game.time.now > this.jumpTimer)
        {
            this.sprite.animations.stop();
            this.jumpSound.play();
            if (this.facing == 'right')
            {
                if (this.health == 3){
                    this.sprite.frame = 4;
                }
                else if (this.health == 2){
                    this.sprite.frame = 14;
                }
                else {
                    this.sprite.frame = 24;
                }
            }
            else
            {
                if (this.health == 3){
                    this.sprite.frame = 5;
                }
                else if (this.health == 2){
                    this.sprite.frame = 15;
                }
                else {
                    this.sprite.frame = 25;
                }
            }
            this.sprite.body.velocity.y = -250;
            this.jumpTimer = this.game.time.now + 750;
        }
        
    }
    
}