class HouseScene extends GameScene {
    constructor() {
        super({
            key: 'HouseScene',
            tilemapFile: 'housetilemap',
            tilesetFile: 'tileset'
        });

        this.spawnPoint = { x: 320, y: 610 }; //Definindo o local de surgimento padrão da cena

        //Adicionando as transições de cena
        this.addSceneTrigger(280, 625, 30, 40, 'MainScene');
    }

    //Callback inicial da cena
    init(data){
        super.init(data);
    }

    //Pré carrega os assets utilizados pela cena
    preload() {
        super.preload();
    }

    //Executa uma vez no inicio da cena
    create() {
        super.create();
    }

    //Executa a cada frame
    update() {
        super.update();
    }
}