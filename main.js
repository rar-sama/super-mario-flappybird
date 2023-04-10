import { AUTO, Game } from 'phaser';
import Level from './src/scenes/Level';
import GameOver from './src/scenes/GameOver';
import StartMenu from './src/scenes/StartMenu';

const config = {
  width: 480,  // Largura
  height: 640, // Altura
  type: AUTO,
  scene: [StartMenu ,Level, GameOver],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 500
      },
      debug: true
    }
  }
}

  new Game(config);
