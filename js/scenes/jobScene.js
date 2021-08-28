class JobScene extends GameScene {
    constructor() {
        super({
            key: 'JobScene',
            tilemapFile: 'jobtilemap',
            tilesetFile: 'tileset'
        });

        this.spawnPoint = { x: 430, y: 465 }; //Definindo o local de surgimento padrão da cena

        //Adicionando as transições de cena
        this.addSceneTrigger(430, 520, 30, 30, 'MainScene');
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