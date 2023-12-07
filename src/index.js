import Phaser from 'phaser';
import fundo from './assets/fundo.jpg';
import playerIMG from './assets/Spaceship/player.png';
import balaPNG from './assets/Spaceship/bala.png';
import shoot2 from './assets/Spaceship/spark.png';
import invader from './assets/Aliens/invader.png';
import alien2 from './assets/Aliens/alien2.png';
import enemyShoot from './assets/Aliens/enemyShoot.png';
import bossShoot from './assets/Aliens/bossSpecialShoot.png';
import shootHorde2 from './assets/Aliens/shootHorde2.png';
import heart from './assets/Spaceship/heart.png';
import { controles } from './cursors.js';
import bossImg from './assets/Aliens/boss.png';

class MyGame extends Phaser.Scene {
    constructor() {
        super();
        this.moreAliens = false;
        this.addBoss = false;
    }

    preload() {
        this.load.image('fundo', fundo);
        this.load.image('player', playerIMG);
        this.load.image('bala', balaPNG);
        this.load.image('invader', invader);
        this.load.image('enemyShoot', enemyShoot);
        this.load.image('heart', heart);
        this.load.image('boss', bossImg);
        this.load.image('bossShoot', bossShoot)
        this.load.image('shootHorde2', shootHorde2);
        this.load.image('alien2', alien2);
        this.load.image('shoot2', shoot2);
    }

    create() {
        //configuração da "cena" do game
        screenWidth = this.sys.game.config.width;
        screenHeight = this.sys.game.config.height;
        const fundo = this.add.image(screenWidth / 2, screenHeight / 2, 'fundo');
        fundo.setScale(screenWidth / fundo.width, screenHeight / fundo.height);
        
        //cria o Score na tela inicial
        scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
        let livesText = this.add.text(screenWidth - 230, 16, `Vidas:`, { fontSize: '32px', fill: '#fff' });
        //3 vidas
        lives = 3;
        //score em 0
        score = 0;
        //cria os corações na tela inicial
        hearts = this.physics.add.group({
            key: 'heart',
            repeat: 2,
            setXY: { x: screenWidth - 100, y: 40, stepX: 30 },
        });
        //cria o player na tela inicial
        player = this.physics.add.sprite(screenWidth / 2, screenHeight / 1.1, 'player');
        player.setCollideWorldBounds(true);
        player.setScale(0.7);
        //cria os aliens chamados invaders
        this.hordeOfAliens();

    }

    update() {
        //importando a função de controles do cursors.js
        controles(this, player, cursors);
        
        //reseta o tiro do player
        function resetShoot() {
            canShoot = true;
        }
        //cria o tiro do player
        this.input.keyboard.on('keydown-SPACE', function () {
            if (canShoot) {
                this.spaceShipShoot();
                canShoot = false;
                this.time.delayedCall(shootInterval, resetShoot, [], this);
            }
        }, this); 
        //chama a segunda horda de aliens
        if (score === 2000 && !this.moreAliens) {
            this.hordeOfAliens2();
            this.moreAliens = true;
        }
        //mudança do intervalo do tiro
        if(score === 2000){
            shootInterval = 300;
        }
        //chama o boss
        if (score === 6000 && !this.addBoss) {
            this.bossFight();
            this.addBoss = true;
        }
        
    }

    spaceShipShoot() {      
        if(score < 2000){
            // Somente atire se o jogador estiver ativo
        if (player.active) {
            bala = this.physics.add.sprite(player.x, player.y, 'bala');
            bala.setVelocityY(-800);
            // Adicione a colisão entre a bala, aliens e o boss
            this.physics.add.collider(bala, aliens, this.playerHit, null, this);
            this.physics.add.overlap(bala, boss, this.playerHitBoss, null, this);
            this.physics.add.overlap(bala, aliens2, this.playerHitAlien2, null, this);           
            
        }}else if (score >= 2000){
            if (player.active) {
                //novo padrão de tiro ao atingir 2000 pontos
                shootUpdate = this.physics.add.sprite(Phaser.Math.Between(player.x+40, player.x-40), player.y, 'shoot2');
                shootUpdate.setVelocityY(-1600);
                /// Adicione a colisão entre a bala, aliens e o boss
                this.physics.add.collider(shootUpdate, aliens, this.playerHit, null, this);
                this.physics.add.overlap(shootUpdate, boss, this.playerHitBoss, null, this);
                this.physics.add.overlap(shootUpdate, aliens2, this.playerHitAlien2, null, this);
                 
            }
        }
    }

    playerHit(bala, alien) {
        // Remova a bala e o alien
        alien.destroy();
        bala.destroy();
        // Desative o alienígena
        alien.setActive(false);
        // Aumente o placar em 100 pontos
        score += 100;
        // Atualize o texto do placar
        scoreText.setText(`Score: ${score}`);
    }

    playerHitAlien2(bala, alien2) {
        // Remova a bala e o alien
        alien2.destroy();
        bala.destroy();
        // Desative o alienígena
        alien2.setActive(false);
        // Aumente o placar em 200 pontos
        score += 200;
        // Atualize o texto do placar
        scoreText.setText(`Score: ${score}`);
    }

    playerHitBoss(bala, boss) {
        //a cada tiro remove uma barra de vida do boss e adiciona 100 pontos por barra
        if (bossHealthBars.length > 0) {
            bala.destroy();
            const lastHealthBar = bossHealthBars.pop();
            lastHealthBar.destroy();
            score += 100;
        // Atualize o score
            scoreText.setText(`Score: ${score}`);
            // Se as barras chegarem a zero destrói o boss e chama a função de vitória e logo após reinicia o game
            if (bossHealthBars.length === 0) {
                boss.destroy();
                player.destroy();
                this.bossDefeated();
                this.startRestartTimer();
            }
        }                     

    }

    enemyShoot(alien) {
        // Somente atire se o alienígena estiver ativo
        if (alien.active) {
            let enemyBullet = this.physics.add.sprite(alien.x, alien.y, 'enemyShoot');
            enemyBullet.setVelocityY(200); // Ajuste a velocidade conforme necessário
            enemyBullet.setScale(0.3);
            //colisão entre o tiro do inimigo e o jogador
            this.physics.add.collider(enemyBullet, player, this.enemyHit, null, this);
           
        }
    }

    enemyHit(enemyShoot, player) {
        // Remova o tiro do inimigo
        enemyShoot.destroy();
        if (lives > 0) {
            //remove um coração do grupo
            const heartsArray = hearts.getChildren();
            heartsArray[heartsArray.length - 1].destroy();
            //decrementa o contador de vidas
            lives--;
        }

        if (lives === 0) {
            //se as vidas chegarem a zero, destrói o player e seta como inativo
            //chama a função de game over e logo após reinicia o game
            player.destroy();
            player.setActive(false);
            this.showGameOver();
            this.startRestartTimer();
        }
    }

    shootAlienHorde2(alien2){
        if(alien2.active){
            //Tiro do alien2 para a diagonal direita
            let alienShootRight = this.physics.add.sprite(alien2.x, alien2.y, 'shootHorde2');
            alienShootRight.setVelocityY(200); 
            alienShootRight.setVelocityX(100); 
            alienShootRight.setScale(0.7);
            //Tiro do alien2 para a diagonal esquerda
            let alienShootLeft = this.physics.add.sprite(alien2.x, alien2.y, 'shootHorde2');
            alienShootLeft.setVelocityY(200); 
            alienShootLeft.setVelocityX(-100); 
            alienShootLeft.setScale(0.7);
            //colisão entre o tiro do inimigo e o jogador
            this.physics.add.collider([alienShootLeft,alienShootRight], player, this.enemyHit, null, this);
        }

    }

    hordeOfAliens() {
        //Faz um grupo de aliens e coloca um espaço entre eles
        aliens = this.physics.add.group();
        numAliens = 10;
        spaceBetweenAliens = 50; 
        //cria a fileira de inimigos
        for (let i = 0; i < numAliens; i++) {
            const alien = this.physics.add.sprite(i * spaceBetweenAliens + spaceBetweenAliens, 100, 'invader');
            aliens.add(alien);
            alien.setCollideWorldBounds(true);
            alien.setScale(1.5);

            //lógica para o alien atirar aleatoriamente
            alien.shootTimer = this.time.addEvent({
                delay: Phaser.Math.Between(1000, 15000),
                callback: () => {
                    this.enemyShoot(alien);
                },
                loop: true,
            });
        }
        //cria a segunda fileira de inimigos
        for (let j = 0; j < numAliens; j++) {
            const alien = this.physics.add.sprite(j * spaceBetweenAliens + spaceBetweenAliens, 200, 'invader');
            aliens.add(alien);
            alien.setCollideWorldBounds(true);
            alien.setScale(1.5);

            //lógica para o alien atirar aleatoriamente
            alien.shootTimer = this.time.addEvent({
                delay: Phaser.Math.Between(1000, 15000),
                callback: () => {
                    this.enemyShoot(alien);
                },
                loop: true,
            });
        }

        //Configuração do movimento dos aliens com tweens
        //cada alien se move da direita para a esquerda e vice-versa
        //até o final da tela e em relação ao espaço entre eles e ao alien do lado
        aliens.getChildren().forEach(alien => {
            this.tweens.add({
                targets: alien,
                x: `+=${screenWidth - spaceBetweenAliens}`,
                onStart: function () {
                    alien.setData('direction', 1);
                },
                x: `+=${700 - spaceBetweenAliens}`,
                onComplete: function () {
                    alien.setData('direction', -1);
                },
                yoyo: true,
                repeat: -1,
                ease: 'Linear',
                duration: 3000,
            });
        });
    }

    hordeOfAliens2() {
        //Faz um grupo de aliens e coloca um espaço entre eles
        aliens2 = this.physics.add.group();
        numAliens = 10;
        spaceBetweenAliens = 50;
        //cria a primeira fileira de inimigos
        for (let i = 0; i < numAliens; i++) {
            const alien = this.physics.add.sprite(i * spaceBetweenAliens + spaceBetweenAliens, 100, 'alien2');
            aliens2.add(alien);
            alien.setCollideWorldBounds(true);
            alien.setScale(0.5);

            //lógica para o alien atirar aleatoriamente
            alien.shootTimer = this.time.addEvent({
                delay: Phaser.Math.Between(1000, 10000),
                callback: () => {
                    this.shootAlienHorde2(alien);
                },
                loop: true,
            });
        }
        //cria a segunda fileira de inimigos
        for (let j = 0; j < numAliens; j++) {
            const alien = this.physics.add.sprite(j * spaceBetweenAliens + spaceBetweenAliens, 200, 'alien2');
            aliens2.add(alien);
            alien.setCollideWorldBounds(true);
            alien.setScale(0.5);

            //lógica para o alien atirar aleatoriamente
            alien.shootTimer = this.time.addEvent({
                delay: Phaser.Math.Between(1000, 10000),
                callback: () => {
                    this.shootAlienHorde2(alien);
                },
                loop: true,
            });
        }

        //Configuração do movimento dos aliens com tweens
        //cada alien se move da direita para a esquerda e vice-versa
        //até o final da tela e em relação ao espaço entre eles e ao alien do lado
        aliens2.getChildren().forEach(alien => {
            this.tweens.add({
                targets: alien,
                x: `+=${screenWidth - spaceBetweenAliens}`,
                onStart: function () {
                    alien.setData('direction', 1);
                },
                x: `+=${700 - spaceBetweenAliens}`,
                onComplete: function () {
                    alien.setData('direction', -1);
                },
                yoyo: true,
                repeat: -1,
                ease: 'Linear',
                duration: 3000,
            });
        });
    }

    bossShoot(boss) {
        // Somente atire se o boss estiver ativo
        if (boss.active) {
            //Cria o tiro com base no tiro da primeira horda de aliens
            let bossBullet = this.physics.add.sprite(boss.x, boss.y, 'enemyShoot');
            bossBullet.setVelocityY(200);
            bossBullet.setScale(0.3);
            //colisão entre o tiro do inimigo e o jogador
            this.physics.add.collider(bossBullet, player, this.bossHit, null, this);
        }
    }

    bossHit(bossShoot, player) {
        //remove o tiro do boss se atingir o player
        bossShoot.destroy();

        if (lives > 0) {
            // Remova um coração do grupo
            const heartsArray = hearts.getChildren();
            heartsArray[heartsArray.length - 1].destroy();
            // Decrementa o contador de vidas
            lives--;
        }

        if (lives === 0) {
            player.destroy();
            player.setActive(false);
            this.showGameOver();
            this.startRestartTimer();
        }
    }

    bossSpecialHit(bossSpecialShoot, player) {
        //remove o tiro especial do boss se atingir o player
        bossSpecialShoot.destroy();
        if (lives > 0) {
            // Remova um coração do grupo
            const heartsArray = hearts.getChildren();
            heartsArray[heartsArray.length - 1].destroy();
            // Decrementa o contador de vidas
            lives--;
        }

        if (lives === 0) {
            player.destroy();
            player.setActive(false);
            this.showGameOver();
            this.startRestartTimer();
        }
    }

    bossFight() {
        //cria o boss
        boss = this.physics.add.sprite(screenWidth / 2, screenHeight / 5, 'boss');
        boss.setCollideWorldBounds(true);
        boss.setScale(0.7);
        
        // Crie as barras de vida do boss
        bossHealthBars = [];
        const bossHealthBarWidth = 20; // Ajuste a largura conforme necessário
        const bossHealthBarHeight = 10;
        const bossHealthBarSpacing = 2; // Ajuste o espaçamento conforme necessário
        const bossHealthBarX = screenWidth / 2 - ((bossHealthBarWidth + bossHealthBarSpacing) * 50) / 2;
        const bossHealthBarY = 60; // Posição ajustada
        
        // Crie 50 barras de vida do boss com a cor verde e agrupa
        for (let i = 0; i < 50; i++) {
            const bossHealthBar = this.add.rectangle(
                bossHealthBarX + i * (bossHealthBarWidth + bossHealthBarSpacing),
                bossHealthBarY,
                bossHealthBarWidth,
                bossHealthBarHeight,
                0x00ff00
            );
            bossHealthBars.push(bossHealthBar);
        }

        // movimento do boss usando tweens
        this.tweens.add({
            targets: boss,
            x: boss.x + screenWidth / 2.5,
            onStart: function () {
                boss.setData('direction', 1);
            },
            onStart: function () {
                boss.x += -screenWidth / 2.5;
                boss.setData('direction', -1);
            },
            yoyo: true,
            repeat: -1,
            ease: 'Linear',
            duration: 5000,
        });
        
        //lógica para o boss atirar a cada 500ms
        boss.shootTimer = this.time.addEvent({
            delay:500,
            callback: () => {
                this.bossShoot(boss);
            },
            loop: true,
        });
        //lógica para o boss atirar o tiro especial a cada 1000ms
        specialShootTimer = this.time.addEvent({
            delay: 1000, // 10 segundos
            callback: () => {
                this.bossSpecialShoot(boss);
            },
            loop: true,
        }); 
    }

    bossSpecialShoot() {
        // Somente atire se o boss estiver ativo
        if(boss.active){
        //Cria o tiro especial do boss com 3 tiros para frente e 2 para as diagonais    
        let tiroReto = this.physics.add.sprite(boss.x, boss.y, 'bossShoot');
        let diagonalEsq= this.physics.add.sprite(boss.x, boss.y, 'bossShoot');
        let diagonalDir = this.physics.add.sprite(boss.x, boss.y, 'bossShoot');
        //ajustes do tiro reto
        tiroReto.setVelocityY(200); // Ajuste a velocidade conforme necessário
        tiroReto.setVelocityX(0); // Ajuste a velocidade conforme necessário
        tiroReto.setScale(0.3);
        //ajustes do tiro diagonal esquerda
        diagonalEsq.setVelocityY(200); // Ajuste a velocidade conforme necessário
        diagonalEsq.setVelocityX(-100); // Ajuste a velocidade conforme necessário
        diagonalEsq.setScale(0.3);
        //ajustes do tiro diagonal direita
        diagonalDir.setVelocityY(200); // Ajuste a velocidade conforme necessário
        diagonalDir.setVelocityX(100); // Ajuste a velocidade conforme necessário
        diagonalDir.setScale(0.3); 
        //colisão entre os tiros e o player
        this.physics.add.collider([diagonalDir, diagonalEsq], player, this.bossSpecialHit, null, this);
        }
    }

    bossDefeated() {
        //adicione uma tela escura
        this.gameOverScreen = this.add.graphics();
        this.gameOverScreen.fillStyle(0x000000, 0.7); // Cor e opacidade da tela escura
        this.gameOverScreen.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height);
        //adicione o texto "Game Over"
        const gameOverText = this.add.text(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2,
            'PARABÉNS, VOCÊ GANHOU!',
            {
                fontSize: '72px',
                fill: '#FFD700', // Dourado
                fontWeight: 'bold',
                align: 'center'
            }
        );
        gameOverText.setOrigin(0.5);
    }

    showGameOver() {
        //adiciona uma tela escura
        this.gameOverScreen = this.add.graphics();
        this.gameOverScreen.fillStyle(0x000000, 0.7); // Cor e opacidade da tela escura
        this.gameOverScreen.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height);

        //adiciona o texto "Game Over"
        const gameOverText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'Game Over', {
            fontSize: '48px',
            fill: '#fff',
            fontWeight: 'bold',
            align: 'center'
        });
        gameOverText.setOrigin(0.5);
    }

    startRestartTimer() {
        // Temporiador para reiniciar o jogo
        this.restartTimer = this.time.delayedCall(5000, this.restartGame, [], this);
    }

    restartGame() {
        //reinicia o jogo
        window.location.reload();
    }

}

const config = {
    //Configuração do game
    //A tela se ajusta de acordo com o tamanho da janela
    type: Phaser.AUTO,
    parent: 'phaser-example',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1200,
    height: 700,
    physics: {
        default: 'arcade',
        gravity: { y: 0 },
    },
    scale: {
        parent: 'phaser-example',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 800,
            height: 600,
        },
        max: {
            width: 1600,
            height: 1200,
        },
        zoom: 1,
    },
    autoRound: false,
    scene: MyGame,
};

const game = new Phaser.Game(config);
//Variáveis globais
let player;
let boss;
let cursors;
let canShoot = true;
let shootInterval = 500;
let bala;
let shootUpdate;
let aliens;
let aliens2;
let score;
let scoreText;
let lives;
let hearts;
let numAliens;
let spaceBetweenAliens;
let screenHeight;
let screenWidth;
let bossHealthBars;
let specialShootTimer;
