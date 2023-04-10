import { Math, Scene } from "phaser";
import Coin from '../objects/Coin';

export default class Level extends Scene{
    /** @type {Phaser.Physics.Arcade.Sprite}*/
    player;
    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    platforms;
    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors;
    /** @type {Phaser.Physics.Arcade.Group} */
    coins;
    /** @type {Phaser.Sound.BaseSound} */
    jumpSound;

    points = 0;
    /** @type {Phaser.GameObjects.Text} */
    pointsText;

    constructor() {
      super('level');
    }

    preload() {
      this.load.image('bg', 'assets/background.png');
      this.load.image('pipeUp', 'assets/pipe-greenUp.png');
      this.load.image('pipeDown', 'assets/pipe-greenDown.png');
      this.load.image('mariostand', 'assets/mariostand.png');
      this.load.image('mariofly', 'assets/mariofly.png');
      this.load.audio('game-over', 'assets/sfx/super-mario-death.mp3');
      this.load.audio('jump', 'assets/sfx/jump.wav');
      this.load.image('coin', 'assets/coin.png');
    }

    create() {
      //Background
      // Cria um tileSprite para o background
      this.bg = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'bg').setOrigin(0).setScrollFactor(0);

      // Configura a escala do tileSprite para que preencha a largura da cena
      this.bg.setScale(this.cameras.main.width / this.bg.width);

      //Animation
      this.anims.create({key: 'flying', frames: [{key: 'mariofly', frame: 0}, {key: 'mariostand', frame: 0}], frameRate: 10, repeat: -1});

      //Pipes
      this.pipeDown = this.physics.add.staticGroup();
      this.pipeUp = this.physics.add.staticGroup();
      for (let i = 0; i < 5; i++) {
        const x = 400 + (250 * i);
        const y = Math.Between(320, 500);

        /** @type {Phaser.Physics.Arcade.Sprite} */
        const pipeDown = this.pipeDown.create(x, y, 'pipeDown');
        pipeDown.setScale(1.5);
        pipeDown.setOrigin(0.5, 0);
        pipeDown.body.updateFromGameObject();

        const pipeUp = this.pipeUp.create(x, y - 150, 'pipeUp')
        pipeUp.setScale(1.5)
        pipeUp.setOrigin(0.5, 1);
        pipeUp.body.updateFromGameObject();
      }

      //Player
      this.player = this.physics.add.sprite(100,200, 'mariostand');
      //Add Player Horizontal Movement
      this.player.setVelocityX(100);

      //Camera
      this.cameras.main.startFollow(this.player);
      this.cameras.main.setDeadzone(undefined ,this.scale.x-200);

      
      //Get Keyboard Commands
      this.cursors = this.input.keyboard.createCursorKeys();

      //Coins
      this.coins = this.physics.add.group({classType: Coin});

      //Collider
      this.physics.add.collider(this.player, this.pipeUp);
      this.physics.add.collider(this.player, this.pipeDown);
      this.physics.add.collider(this.coins, this.platforms);

      //Coins collected
      // const style = {color: '#fff', fontSize: 24};
      // this.pointsText = this.add.text(240, 10, '0', style);
      // this.pointsText.setScrollFactor(0).setOrigin(0.5, 0);
    }

    update(time, delta) {
      // Get the keyboard press and start animation
       if (this.cursors.space.isDown) {
        this.player.setVelocityY(-200);

        if (this.player.body.velocity.y < 0) {
          this.player.anims.play('flying', true).setScale(1.5);
        }
      } else {
         this.player.anims.play('flying', false).setScale(1.5);
        }
      //Background repeats
      //Move tilesprite according to the camera
      this.bg.tilePositionX = this.cameras.main.scrollX * 0.3;

      //Recycle pipes
      this.pipeUp.children.iterate( child => {
        /** @type {Phaser.Physics.Arcade.Sprite} */
        const pipeUp = child;

        // Position pipes X
        const scrollX = this.cameras.main.scrollX;
        if( pipeUp.x + 400 <= scrollX){
          pipeUp.y +150 <= Math.Between(320,500);
          pipeUp.x = scrollX + 870;
          pipeUp.body.updateFromGameObject();
        }
      })
      this.pipeDown.children.iterate( child => {
        /** @type {Phaser.Physics.Arcade.Sprite} */
        const pipeDown = child;

        // Position pipes X
        const scrollX = this.cameras.main.scrollX;
        if( pipeDown.x +400 <= scrollX){ 
          pipeDown.y -150 <= Math.Between(320,500)
          pipeDown.x = scrollX + 870;
          pipeDown.body.updateFromGameObject();
          // if(this.player.body.x == pipeDown.x){
          //   this.points++;
          //   this.pointsText.text = this.points;
          // }
        }
      })

      //Game Over
      if( this.player.y >= this.scale.height-120 || this.player.body.velocity.x <= 0){
        this.sound.play('game-over');
        this.scene.start('game-over');
      }
    }
}
