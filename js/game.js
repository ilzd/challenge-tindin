var game;
var config;

window.onload = function () {
    config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: [MainScene],
        physics: {
            default: 'arcade', //the physics engine the game will use
            arcade: {
                debug: false
            }
        }
    }

    game = new Phaser.Game(config);
}