var game;
var config;

window.onload = function () {
    config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: [MainScene, ShopScene, JobScene, HouseScene]
    }

    game = new Phaser.Game(config);
}