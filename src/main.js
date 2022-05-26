import PlayScene from '/src/scenes/Play.js';
import PreloadScene from '/src/scenes/Preload.js';
import TestScene from '/src/scenes/EnvironnementTest.js';


const WIDTH = 896;
const HEIGHT = 448;
const ZOOM_FACTOR = 2.0; 

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  zoomFactor: ZOOM_FACTOR,
  leftTopCorner: {
    x: (WIDTH - (WIDTH / ZOOM_FACTOR)) / 2,
    y: (HEIGHT - (HEIGHT / ZOOM_FACTOR)) / 2
  }
}

const Scenes = [PreloadScene, PlayScene, TestScene];
const createScene = Scene => new Scene(SHARED_CONFIG) //A voir
const initScenes = () => Scenes.map(createScene) 

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    }
  },
  fps: {
    target: 60,
    forceSetTimeOut: true
  },
  scene: initScenes()
}

new Phaser.Game(config);