class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.character;
        this.money = 0;
        this.tileSetFile = 'tileset.png';

        //Possíveis areas de surgimento dependendo de onde o jogador veio
        this.spawnPoints = {
            fromShop: { x: 200, y: 335 },
            fromJob: { x: 450, y: 135 },
            fromHouse: { x: 645, y: 370 }
        }

        //O local onde o personagem será criado ao executar esta cena
        this.spawnPoint = { x: 415, y: 500 };

        this.mapData;

        //Coordenadas das áreas de transiçãoa para sair desta cena
        this.sceneTriggers = [
            {
                pos: { x: 150, y: 352 },
                size: { w: 30, h: 50 },
                scene: 'ShopScene'
            },
            {
                pos: { x: 448, y: 120 },
                size: { w: 50, h: 30 },
                scene: 'JobScene'
            },
            {
                pos: { x: 683, y: 384 },
                size: { w: 30, h: 50 },
                scene: 'HouseScene'
            },
        ];
    }

    //Callback inicial da cena
    init(data) {
        if (data != null) {
            switch (data.from) {
                case 'Shop':
                    this.spawnPoint = this.spawnPoints.fromShop;
                    break;
                case 'Job':
                    this.spawnPoint = this.spawnPoints.fromJob;
                    break;
                case 'House':
                    this.spawnPoint = this.spawnPoints.fromHouse;
                default:
                    break;
            }
        }
    }

    //Pré carrega todos os assets necessários na Scene
    preload() {
        this.load.spritesheet('character', 'assets/images/character.png', { frameWidth: 48, frameHeight: 64 }, 12);
        //this.load.audio('bgmusic', 'assets/audio/bgmusic.mp3');

        this.load.tilemapTiledJSON('mainmap', 'assets/images/tilemaps/maintilemap.json');
        this.load.image('maintiles', 'assets/images/tilemaps/tileset.png');

        this.load.image('coin', 'assets/images/coin.png');

        this.load.image('debugimage', 'assets/images/debug.png');
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
                this.scene.start(this.sceneTriggers[i].scene);
            }, null, this);
        }

        this.physics.add.collider(this.character, this.mapData.wallLayer);
        this.physics.add.collider(this.character, this.mapData.objectsLayer);
    }

    //Executa a cada frame
    update() {
        this.character.update();
    }

    //Cria o mapa a partir do tilemap e tileset
    buildMap() {
        let map = this.make.tilemap({ key: 'mainmap' });
        let tileset = map.addTilesetImage('tileset', 'maintiles');
        this.mapData = {
            map: map,
            tileset: tileset,
            groundLayer: map.createLayer('ground', tileset),
            wallLayer: map.createLayer('walls', tileset),
            objectsLayer: map.createLayer('objetos', tileset),
        }

        this.mapData.wallLayer.setCollisionByProperty({ collides: true });
        this.mapData.objectsLayer.setCollisionByProperty({ collides: true });
    }

    //Cria os elementos do HUD
    buildHUD() {
        this.HUD = this.add.group();

        //Adicionando o sprite da moedienha
        let coinSprite = this.add.sprite(40, 40, 'coin');
        coinSprite.displayWidth = coinSprite.displayHeight = 50;
        this.HUD.add(coinSprite);

        //Adicionando o texto referente ao dinheiro
        this.moneyText = this.add.text(90, 42, this.money, { fontSize: 50 });
        this.moneyText.setOrigin(0.5, 0.5);
        this.HUD.add(this.moneyText );

        //Posisionando s HUD absolutamente
        this.HUD.children.iterate(function (child) {
            child.setScrollFactor(0);
        });
    }

    //Atualiza o texto do dinheiro exibido para o player
    updateMoneyText(){
        this.moneyText.setText(this.money);
        this.tweens.add({
            targets: this.moneyText,
            scale: {start: 3, to: 1},
            duration: 1000,
            ease: 'Cubic'
        });
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
