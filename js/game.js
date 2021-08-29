var game;
var config;
this.save = {
    money: 1000,
    itensBought: {
        tables: [],
        beds: [],
    }
}

window.onload = function () {
    config = {
        type: Phaser.AUTO,
        parent: 'phaser-game',
        width: 1000,
        height: 600,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
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