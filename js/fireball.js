BasicGame.Fireball = function(game) {
    this.game = game;
    this.sprite = null;
    
    
    
}

BasicGame.Fireball.prototype = {

    add: function (x, y) {
        
        this.sprite = this.game.add.sprite( x, y, 'fireball' );
        this.sprite.anchor.setTo( 0.5, 0.5 );
        this.sprite.animations.add('standard', [0, 1, 2, 1], 5, true);
        this.sprite.animations.play('standard');
        this.game.physics.enable( this.sprite, Phaser.Physics.ARCADE );
        this.sprite.body.allowGravity = false;
        this.sprite.body.setSize(20,20);
        
        
    },
    
    update: function () {
    
         //move fireball towards player
        if (BasicGame.player.hasMoved){
            this.sprite.rotation = this.game.physics.arcade.accelerateToObject(this.sprite, BasicGame.player.sprite, 170, 170, 80);
        }
        
        //check if fireball has hit the player if so, damamge and bounce player
        if (this.game.physics.arcade.intersects(BasicGame.player.sprite.body, this.sprite.body) && BasicGame.player.damageTimer < 
            this.game.time.now){
            BasicGame.player.damage();
            BasicGame.player.sprite.body.velocity.y += this.sprite.body.acceleration.y * 2;
        }
    }
}