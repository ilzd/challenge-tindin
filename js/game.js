var game;
var config;
this.save = {
    money: 2000,
    itensBought: {
        tables: [],
        beds: [],
        tvs: [],
        desks: [],
        mats: [],
        closets: [],
    },
    itensUsing: {
        table: null,
        bed: null,
        tv: null,
        desk: null,
        mat: null,
        closet: null,
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
