// GameOver.js
import { Scene } from "phaser";

export default class Gameover extends Scene{
  constructor(){
    super('game-over');
  }

  create(){
    let width = this.scale.width;
    let height = this.scale.height;

    this.add.text(width/2, height/2, 'GAME OVER', {
      fontsize: 48,
      color: '#fff'
    }).setOrigin(0.5);

    // Jogar de novo
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('startMenu');
    });
  }
}
