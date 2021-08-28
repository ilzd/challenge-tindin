//Classe mãe de todas as cenas do jogo
class GameScene extends Phaser.Scene {
    constructor(data) {
        super(data.key);
        this.key = data.key; //Key da cena utilizada para se comunicar com outras cenas
        this.tilemapFile = data.tilemapFile; //Nome do arquivo do tilemap desta cena
        this.tilesetFile = data.tilesetFile; //Nome do arquivo do tilesede desta cena
        this.money = 0; //Dinheiro do player
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
    addSpawnPoint(from_, x_, y_){
        this.spawnPoints.push({
            from: from_,
            x: x_,
            y: y_
        });
    }

    //Callback inicial da cena
    init(data) {
        if (data != null) {
            for(let i = 0; i < this.spawnPoints.length; i++){
                let spawn = this.spawnPoints[i];
                if(spawn.from === data.from){
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
    }

    //Executa uma vez no inicio da cena
    create() {
        this.buildMap();
        this.buildHUD();
        this.setSceneTriggers();

        this.character = new Character(this, this.spawnPoint.x, this.spawnPoint.y);
        this.cameras.main.startFollow(this.character);

        for (let i = 0; i < this.sceneTriggers.length; i++) {
            this.physics.add.overlap(this.character, this.sceneTriggers[i].trigger, function () {
                this.scene.start(this.sceneTriggers[i].scene, {from: this.key});
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
        coinSprite.displayWidth = coinSprite.displayHeight = 50;
        this.HUD.add(coinSprite);

        //Adicionando o texto referente ao dinheiro
        this.moneyText = this.add.text(90, 42, this.money, { fontSize: 50 });
        this.moneyText.setOrigin(0.5, 0.5);
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

    //Atualiza o texto do dinheiro exibido para o player
    updateMoneyText() {
        this.moneyText.setText(this.money);
        this.tweens.add({
            targets: this.moneyText,
            scale: { start: 3, to: 1 },
            duration: 1000,
            ease: 'Cubic'
        });
    }
}