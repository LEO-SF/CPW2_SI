import Phaser from 'phaser';
import fundo from './assets/fundo.jpg';
import playerIMG from './assets/Spaceship/player.png';
import balaPNG from './assets/Spaceship/bala.png';

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

        cursors = this.input.keyboard.createCursorKeys(); 

        

        

        if (cursors.left.isDown)
        {
            player.setVelocityX(-200);
        }
        else if (cursors.right.isDown )
        {
            player.setVelocityX(200);
        }
        else if(cursors.up.isDown){
            player.setVelocityY(-200);
        }else if(cursors.down.isDown){
            player.setVelocityY(200);
        }
        else
        {
            player.setVelocityX(0);
            player.setVelocityY(0);
        }

        

        if(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).isDown){
            this.spaceShipShoot();
            

        }
        

    }

    

}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1300,
    height: 800,
    physics:{
        default: 'arcade',
        gravity: {y: 0},
      },
    scene: MyGame
};

const game = new Phaser.Game(config);
let player;
var cursors;


