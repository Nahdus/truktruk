class preloader extends Phaser.Scene {
    constructor ()
    {
        super('preloader');
        this.heart
        this.player
        this.cursors
        this.spacebar
        this.stars
        this.bullets 

    }
    preload ()
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
    this.load.image('opening', './assets/opening.png');
    
    }
    create(){
        this.scene.start('PreIntro')
    }
    
    
}