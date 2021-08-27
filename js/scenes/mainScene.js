class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    //Pré carrega todos os assets necessários na Scene
    preload() {
        this.load.spritesheet('character', 'assets/images/character.png', { frameWidth: 48, frameHeight: 64 }, 12);
        this.load.audio('bgmusic', 'assets/audio/bgmusic.mp3');
    }

    //Executa uma única vez quando a Scene é startada
    create() {
        //this.sound.play('bgmusic', {volume: 0.05});
        this.character = new Character(this, 100, 100);

        this.cameras.main.startFollow(this.character);
    }

    //Executa a cada frame
    update() {
        this.character.update();
    }
}