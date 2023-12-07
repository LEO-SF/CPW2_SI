export function controles(scene, player, cursors) {
    cursors = scene.input.keyboard.createCursorKeys();

    const posicaoY = scene.sys.game.config.height / 1.7;

    // Verifica se o jogador ou o corpo do jogador é indefinido
    if (!player || !player.body) {
        return cursors;
    }

    // Inicialmente, defina as velocidades do jogador como zero
    let velocityX = 0;
    let velocityY = 0;

    if (cursors.left.isDown) {
        velocityX = -300;
    } else if (cursors.right.isDown) {
        velocityX = 300;
    }

    if (cursors.up.isDown && player.y >= posicaoY) {
        velocityY = -300;
    } else if (cursors.down.isDown) {
        velocityY = 300;
    }

    // Atribua as velocidades após avaliar todas as teclas
    player.setVelocityX(velocityX);
    player.setVelocityY(velocityY);

    return cursors;
}
