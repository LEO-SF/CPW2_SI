import Phaser from 'phaser';
import fundo from './assets/fundo.jpg';
import playerIMG from './assets/Spaceship/player.png';
import balaPNG from './assets/Spaceship/bala.png';
import { controles } from './cursors.js';

class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        //  This is an example of a bundled image:
        this.load.image('fundo', fundo);
        this.load.image('player', playerIMG);
        this.load.image('bala', balaPNG);
        
    }
      
    create ()
    {
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;
    const fundo = this.add.image(screenWidth / 2, screenHeight / 2, 'fundo');

    // Defina a escala da imagem para preencher a tela
    fundo.setScale(screenWidth / fundo.width, screenHeight / fundo.height);

    const y = this.sys.game.config.height / 2;
    
    player = this.physics.add.sprite(100, 450, 'player');
    player.setCollideWorldBounds(true);


    }


    spaceShipShoot() {  
            let bala = this.physics.add.sprite(player.x, player.y, 'bala');
            bala.setVelocityY(-200); // Bala se move para cima
         
    }


    update(){

    let cursors;    
    controles(this,  player, cursors);

    if(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).isDown){
        this.spaceShipShoot();
        
    }

    }

    

}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1200,
    height: 700,
    
    physics:{
        default: 'arcade',
        gravity: {y: 0},
      },
      scale: {
        // Or set parent divId here
        parent: 'phaser-example',

        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,

        // Or put game size here
        // width: 1024,
        // height: 768,

        // Minimum size
        min: {
            width: 800,
            height: 600
        },
        // Or set minimum size like these
        // minWidth: 800,
        // minHeight: 600,

        // Maximum size
        max: {
            width: 1600,
            height: 1200
        },
        // Or set maximum size like these
        // maxWidth: 1600,
        // maxHeight: 1200,

        zoom: 1,  // Size of game canvas = game size * zoom
    },
    autoRound: false,
    scene: MyGame
};

const game = new Phaser.Game(config);
let player;



