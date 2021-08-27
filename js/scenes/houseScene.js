class HouseScene extends Phaser.Scene {
    constructor() {
        super('HouseScene');
        this.character;

        //O local onde o personagem será criado ao executar esta cena
        this.spawnPoint = { x: 320, y: 610 };

        this.mapData;

        //Coordenadas das áreas de transiçãoa para sair desta cena
        this.sceneTriggers = [
            {
                pos: { x: 265, y: 620 },
                size: { w: 30, h: 30 },
                scene: 'MainScene'
            },
        ];
    }

    //Callback inicial da cena
    init(data) {
    }

    //Pré carrega todos os assets necessários na Scene
    preload() {
        this.load.spritesheet('character', 'assets/images/character.png', { frameWidth: 48, frameHeight: 64 }, 12);
        //this.load.audio('bgmusic', 'assets/audio/bgmusic.mp3');

        this.load.tilemapTiledJSON('housemap', 'assets/images/tilemaps/housetilemap.json');
        this.load.image('housetiles', 'assets/images/tilemaps/tileset.png');
    }

    //Executa uma única vez quando a Scene é startada
    create() {
        this.buildMap();
        this.buildHUD();
        this.setSceneTriggers();
        //this.sound.play('bgmusic', {volume: 0.05});

        this.character = new Character(this, this.spawnPoint.x, this.spawnPoint.y);

        this.cameras.main.startFollow(this.character);

        //Define um overlap entre o personagem e cada área de ativação de troca de cena
        for (let i = 0; i < this.sceneTriggers.length; i++) {
            this.physics.add.overlap(this.character, this.sceneTriggers[i].trigger, function () {
                this.scene.start(this.sceneTriggers[i].scene, {from: 'House'});
            }, null, this);
        }
    }

    //Executa a cada frame
    update() {
        this.character.update();
    }

    //Cria o mapa a partir do tilemap e tileset
    buildMap() {
        let map = this.make.tilemap({ key: 'housemap' });
        let tileset = map.addTilesetImage('tileset', 'housetiles');
        this.mapData = {
            map: map,
            tileset: tileset,
            groundLayer: map.createLayer('ground', tileset),
            wallLayer: map.createLayer('walls', tileset),
            objectsLayer: map.createLayer('objetos', tileset),
        }
    }

    //Cria os elementos do HUD
    buildHUD() {
        this.cashText = this.add.text(5, 5, '$: ' + 1);
        this.cashText.setScrollFactor(0);
    }

    //Define as áreas gatilhos que ativam a troca de cena
    setSceneTriggers() {
        for (let i = 0; i < this.sceneTriggers.length; i++) {
            let triggerData = this.sceneTriggers[i];
            let trigger = this.physics.add.sprite(triggerData.pos.x, triggerData.pos.y);
            trigger.displayWidth = triggerData.size.w;
            trigger.displayHeight = triggerData.size.h;
            triggerData.trigger = trigger;
        }
    }
}
