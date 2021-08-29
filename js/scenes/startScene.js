class StartScene extends Phaser.Scene {
    constructor(){
        super('StartScene');
    }

    preload(){}

    create(){
        let gameTitle = this.add.text(100, 100,  'Desafio Tindin', { fontSize: 65, color: '#FFF', backgroundColor: '#000A' });

        let gameInstructions = this.add.text(100, 300,  'Trabalhe e ganhe dinheiro para mobiliar a sua casa.\n\nControles:\nSETAS: Movimentação\nE: Interagir', { fontSize: 20, color: '#FFF', backgroundColor: '#000A' });

        let howToStart = this.add.text(100, 500,  'Pressione E para começar', { fontSize: 20, color: '#FFF', backgroundColor: '#000A' });

        //Tween para char atenção a como iniciar o jogo
        this.tweens.add({
            targets: howToStart,
            scale: {from: 1, to: 1.1},
            loop: -1,
            yoyo: true 
        });

        //Se o jogador pressionar a tecla E, ele começa a trabalhar
        var keyObj = this.input.keyboard.addKey('E');
        keyObj.on('down', function () {
            this.scene.start('MainScene');
        }, this);
    }

    update(){}
}