var game;
var config;

window.onload = function () {
    config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: [MainScene]
    }

    game = new Phaser.Game(config);
}