import { Scene } from "phaser";

export default class StarMenu extends Scene{

    constructor(){
      super('startMenu');
    }

    preload(){
      this.load.image('bg','assets/background.png');
      this.load.image('start', 'assets/mariostart.png');
    }

    create(){
      this.bg = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'bg').setOrigin(0).setScrollFactor(0);

      this.add.image(240,320, 'start').setScale(.5);

      this.input.keyboard.once('keydown-SPACE', () => {this.scene.start('level');})
    }
    
    update(){

      this.bg.tilePositionX = this.cameras.main.scrollX * 0.3;
    }
}
