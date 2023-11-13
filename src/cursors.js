export function controles(scene, player, cursors) {
    cursors = scene.input.keyboard.createCursorKeys();

    const posicaoY = scene.sys.game.config.height / 1.7;

    // Inicialmente, defina as velocidades do jogador como zero
    let velocityX = 0;
    let velocityY = 0;

    if (cursors.left.isDown) {
        velocityX = -200;
    } else if (cursors.right.isDown) {
        velocityX = 200;
    }

    if (cursors.up.isDown && player.y >= posicaoY) {
        velocityY = -200;
    } else if (cursors.down.isDown) {
        velocityY = 200;
    }

    // Atribua as velocidades após avaliar todas as teclas
    player.setVelocityX(velocityX);
    player.setVelocityY(velocityY);

    return cursors;
}
