class ShopScene extends GameScene {
    constructor() {
        super({
            key: 'ShopScene',
            tilemapFile: 'shoptilemap',
            tilesetFile: 'tileset'
        });

        this.spawnPoint = { x: 600, y: 400 }; //Definindo o local de surgimento padrão da cena

        //Adicionando as transições de cena
        this.addSceneTrigger(650, 415, 30, 60, 'MainScene');
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