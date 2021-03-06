//Classe mãe de todas as cenas do jogo
class GameScene extends Phaser.Scene {
    constructor(data) {
        super(data.key);
        this.key = data.key; //Key da cena utilizada para se comunicar com outras cenas
        this.tilemapFile = data.tilemapFile; //Nome do arquivo do tilemap desta cena
        this.tilesetFile = data.tilesetFile; //Nome do arquivo do tilesede desta cena
        this.sceneTriggers = []; //Array de triggers de transição entre cenas
        this.spawnPoint = { x: 0, y: 0 }; //Local de surgimento do personagem
        this.spawnPoints = []; //Possiveis locais de surgimento dependendo de que cena o player esta vindo
    }

    //Adiciona uma area triggere de transição de cenas
    addSceneTrigger(x_, y_, w_, h_, scene_) {
        this.sceneTriggers.push({
            pos: { x: x_, y: y_ },
            size: { w: w_, h: h_ },
            scene: scene_
        });
    }

    //Adiciona um novo spawn point
    addSpawnPoint(from_, x_, y_) {
        this.spawnPoints.push({
            from: from_,
            x: x_,
            y: y_
        });
    }

    //Callback inicial da cena
    init(data) {
        //Decidindo o spawn point adequado dependendo de qual cena o player veio
        if (data.from != null) {
            for (let i = 0; i < this.spawnPoints.length; i++) {
                let spawn = this.spawnPoints[i];
                if (spawn.from === data.from) {
                    this.spawnPoint.x = spawn.x;
                    this.spawnPoint.y = spawn.y;
                }
            }
        }
    }

    //Pré carrega os assets utilizados pela cena
    preload() {
        this.load.spritesheet('character', 'assets/images/character.png', { frameWidth: 48, frameHeight: 64 }, 12);
        this.load.tilemapTiledJSON(this.key + 'map', 'assets/images/tilemaps/' + this.tilemapFile + '.json');
        this.load.image(this.key + 'tiles', 'assets/images/tilemaps/' + this.tilesetFile + '.png');

        this.load.image('coin', 'assets/images/coin.png');

        this.load.image('debugimage', 'assets/images/debug.png');

        this.load.audio('step', 'assets/audio/step.mp3');
    }

    //Executa uma vez no inicio da cena
    create() {
        this.buildMap();
        this.buildHUD();
        this.setSceneTriggers();

        //Criando a imagem de transição entre cenas
        this.transitioning = false;
        this.transitionRect = this.add.rectangle(config.width / 2, config.height / 2, config.width, config.height);
        this.transitionRect.setFillStyle(0x111111);
        this.transitionRect.setOrigin(0.5, 0.5);
        this.transitionRect.setDepth(2);
        this.transitionRect.setScrollFactor(0);
        this.tweens.add({
            targets: this.transitionRect,
            /* y: config.height,
            x: config.width, */
            scale: 0,
            duration: 700,
            ease: 'Cubic'
        });

        this.character = new Character(this, this.spawnPoint.x, this.spawnPoint.y);
        this.cameras.main.startFollow(this.character);

        for (let i = 0; i < this.sceneTriggers.length; i++) {
            this.physics.add.overlap(this.character, this.sceneTriggers[i].trigger, function () {
                if (!this.transitioning) {
                    this.transitioning = true;
                    this.character.setBusy(true);
                    this.transitionTo(this.sceneTriggers[i].scene, { from: this.key });
                }
                //this.scene.start(this.sceneTriggers[i].scene, { from: this.key });
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
        let map = this.make.tilemap({ key: this.key + 'map' });
        let tileset = map.addTilesetImage('tileset', this.key + 'tiles');
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
        //Cria um grupo pra adicionar os elementos do HUD
        this.HUD = this.add.group();

        //Adicionando o sprite da moedienha
        let coinSprite = this.add.sprite(40, 40, 'coin');
        coinSprite.setDepth(1);
        coinSprite.displayWidth = coinSprite.displayHeight = 50;
        this.HUD.add(coinSprite);

        //Adicionando o texto referente ao dinheiro
        this.moneyText = this.add.text(70, 42, save.money, { fontSize: 40, backgroundColor: '#0002' });
        this.moneyText.setOrigin(0, 0.5);
        this.moneyText.setDepth(1);
        this.HUD.add(this.moneyText);

        //Posisionando o HUD absolutamente
        this.HUD.children.iterate(function (child) {
            child.setScrollFactor(0);
        });
    }

    //Define as triggers que ativam a troca de cena
    setSceneTriggers() {
        for (let i = 0; i < this.sceneTriggers.length; i++) {
            let triggerData = this.sceneTriggers[i];
            let trigger = this.physics.add.sprite(triggerData.pos.x, triggerData.pos.y);
            trigger.displayWidth = triggerData.size.w;
            trigger.displayHeight = triggerData.size.h;
            triggerData.trigger = trigger;
        }
    }

    //Player ganhar dinheiro e atualiza o HUD
    gainMoney(amount) {
        save.money += amount;
        this.moneyText.setText(save.money);
        this.tweens.add({
            targets: this.moneyText,
            scale: { start: 2.5, to: 1 },
            duration: 1000,
            fill: 0x00FF00,
            ease: 'Cubic'
        });
    }

    //Player gastar dinheiro e atualiza o HUD
    spendMoney(amount) {
        save.money -= amount;
        this.moneyText.setText(save.money);
        this.tweens.add({
            targets: this.moneyText,
            scale: { start: 0.25, to: 1 },
            duration: 1000,
            fill: 0x00FF00,
            ease: 'Cubic'
        });
    }

    //Inicia a animação de transição e efetua a transição ao final
    transitionTo(scene, data) {
        let transition = this.tweens.add({
            targets: this.transitionRect,
           /*  y: {start: -config.height, to: 0},
            x: {start: -config.width, to: 0}, */
            scale: 1,
            duration: 700,
            ease: 'Cubic'
        });

        transition.on('complete', function () {
            this.scene.start(scene, data);
        }, this);
    }
}