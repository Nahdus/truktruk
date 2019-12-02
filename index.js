var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    
    physics: {
        default: 'arcade',
        arcade: {
            // gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var moving;
var attack;
var playerDead= false

// create game
var game = new Phaser.Game(config);

// load assets
function preload ()
{
    this.load.spritesheet('attack', './assets/attack.png',{ frameWidth: 40, frameHeight: 27 });
    this.load.spritesheet('death', './assets/death.png',{ frameWidth: 80, frameHeight: 80 });
    this.load.spritesheet('idle', './assets/idle2.png',{ frameWidth: 48, frameHeight: 24 });
    this.load.spritesheet('move', './assets/move.png',{ frameWidth: 24, frameHeight: 48 });
    this.load.spritesheet('idle_move', './assets/idle_move_attack_death.png',{ frameWidth: 80, frameHeight: 80 });
    this.load.spritesheet('heart', './assets/heart.png',{ frameWidth: 64, frameHeight: 64 });
    this.load.image('projectile','./assets/projectileimg.png',{ frameWidth: 256, frameHeight: 256 })
    this.load.image('background', './assets/tiling-organs.png');
    this.load.image('ground', './assets/platform1.png');
    this.load.image('star', './assets/Cell.png');
    this.load.image('star1', './assets/Blue_Virus.png');
    this.load.image('star2', './assets/Green_Virus.png');
    this.load.image('star3', './assets/Red_Virus.png');
    this.load.image('star4', './assets/Pink_Virus.png');
    this.load.image('star5', './assets/Yellow_Virus.png');
    this.load.image('pill', './assets/pill.png');
    this.load.audioSprite('sfx', './assets/sounds/fx_mixdown.json', [
        'assets/sounds/fx_mixdown.ogg',
        'assets/sounds/fx_mixdown.mp3'
    ]);
    this.load.audio('heartbeat', ['assets/sounds/heartbeat_slow_reverb.wav',
    'assets/sounds/heartbeat_slow_reverb.ogg'])
  
    
}

function create(){

    //load audio
    var spritemap = this.cache.json.get('sfx').spritemap;
    //play background music

    var music = this.sound.add('heartbeat');

    
    music.play({
        loop: true
      });
    //add background
    this.add.image(400, 300, 'background');
    var Bullet = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function spit (scene)
        {
            console.log(Phaser.GameObjects)
            Phaser.GameObjects.Image.call(this, scene,player.x, player.y, 'projectile');
            this.speed = 0.6
            this.playerdir= player.flipX
            this.playerXpos=player.x
            
        },

        fire: function (x, y)
        {   
            // console.log(this.scene.physics.config.gravity.y)
            // console.log(this.speed)
            this.playerdir= player.flipX
            this.playerXpos=player.x
            this.setPosition(x, y);

            this.setActive(true);
            this.setVisible(true);
        },

        update: function (time, delta)
        {
            // console.log(player.anims.currentFrame) 
           if(this.playerdir===0||this.playerdir===false){
            // console.log(this.playerdir)
            this.x -= this.speed * delta;
             
           }else{
            //    console.log(this.playerdir)
            this.x += this.speed * delta;
            
           }
                
                
                
             
            if (this.x > this.playerXpos+200 || this.x < this.playerXpos-200)
            {
                this.setActive(false);
                this.setVisible(false);
            }
        }
    })
    

    //////////////////////////////////////////////////////////////
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    //create player
    heart =this.physics.add.sprite(400,300,'heart')
    heart.scale=3
    player = this.physics.add.sprite(50, 450, 'idle_move');
    player.setBounce(0.3);
    player.setGravityY(200)
    // player = this.physics.add.sprite(100, 450, 'move');

    //limit player within the world
    player.setCollideWorldBounds(true);
    player.body.x=20
    player.body.y=20
    player.body.offset.x=20
    player.body.offset.y=20
    //      player.body.center=player.body.center-20
    player.body.height=29
    player.body.width=47
    console.log(player.body.transform.scaleX)

    //add falling stars
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    // add falling pills
    pills = this.physics.add.group({
        key:"pill",
        repeat:5,
        setXY:{x:12,y:0, stepX:100}
    })

    viruses = this.physics.add.group({
        key:Phaser.Math.RND.pick(['star2','star3','star4']),
        repeat:5,
        setXY:{x:12,y:0, stepX:100}
    })

    bullets = this.physics.add.group({
        classType: Bullet,
        maxSize: 1 ,
        runChildUpdate: true
    });
    stars.children.iterate(function (child) {
        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.setGravityY('300')
    });
    pills.children.iterate(function(child){
        child.setGravityY(Phaser.Math.FloatBetween(50, 200))
        child.setBounce(1)
        child.setVelocity(Phaser.Math.Between(-200, 200), 20)
        child.setCollideWorldBounds(true)
    })
    viruses.children.iterate(function(child){
        child.setGravityY(Phaser.Math.FloatBetween(50, 200))
        child.setBounce(1)
        child.setVelocity(Phaser.Math.Between(-200, 200), 20)
        child.setCollideWorldBounds(true)
    })
    //player collides with platform
    this.physics.add.collider(player, platforms);
    
    
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(pills,platforms)
    this.physics.add.collider(pills,pills)
     
    
    //create animation
    this.anims.create({
        key: 'still', 
        frames: this.anims.generateFrameNumbers('idle_move', { start: 0, end: 7 }),
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'move', 
        frames: this.anims.generateFrameNumbers('idle_move', { start: 8, end: 15 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'attack', 
        frames: this.anims.generateFrameNumbers('idle_move', { start: 16, end: 23}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'death', 
        frames: this.anims.generateFrameNumbers('idle_move', { start: 24, end: 31 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'beat', 
        frames: this.anims.generateFrameNumbers('heart', { start: 0, end: 4 }),
        frameRate: 10,
        repeat: -1
    });

    //create cursor events
    cursors = this.input.keyboard.createCursorKeys();
    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    this.physics.add.overlap(player, stars, collectStar, null, this)
    this.physics.add.overlap(bullets, pills, destroyPill, null, this)
    this.physics.add.overlap(player, pills, killPlayer, null, this)
    console.log(this.overlap)
    player.on('animationrepeat-death', function () {
        console.log('died')
        player.anims.pause()
        player.disableBody(true, true)

        this.physics.pause()

    }, this)

}






function update(){

    // play sound
    
    // this.sound.playAudioSprite('sfx', 'numkey');
    //  console.log("update")
    heart.anims.play('beat',true)
      player.setVelocityX(0);
    if (!playerDead)  {

        if (cursors.right.isDown)
      {
          player.setVelocityX(160);
          if (player.flipX==0){
              player.flipX=-1
            }
          // player.body.offset.setTo(0,-30)
           player.anims.play('move', true);
          
      }
      if (cursors.left.isDown && !cursors.right.isDown && !spacebar.isDown && !playerDead)
      {
          
          if (player.flipX==-1){
              player.flipX=0
            }
          player.setVelocityX(-160);
          // player.setVelocityY(-100)
  
           player.anims.play('move', true);
      }if(!cursors.right.isDown && !cursors.left.isDown && !spacebar.isDown && !playerDead){
          // player.anims.play('still', true);
          // console.log('idle')
          player.anims.play('still', true);
            
      }
      if(spacebar.isDown ){
          var bullet = bullets.get();
          // console.log(bullet)
          player.anims.play('attack', true)
          
          if (bullet)
          {
              bullet.fire(player.x, player.y);
              this.sound.playAudioSprite('sfx', 'squit');
          }
      }
    }
    else{
        
        
        return;
    }
    
}

function collectStar (player, star)
{
    star.disableBody(true, true);
    this.sound.playAudioSprite('sfx', 'ping');
    console.log(stars.countActive(true))
   
    

    
}

function destroyPill(bullet,pill){
    bullet.setActive(false);
    bullet.setVisible(false);
    pill.disableBody(true, true);
    this.sound.playAudioSprite('sfx', 'shot');
}

function killPlayer(player,pill){
    console.log("player dead")
    // console.log(player.anims.isPlaying)
    player.anims.play('death', true);
    this.sound.playAudioSprite('sfx', 'death');
    playerDead=true
    
     
}
