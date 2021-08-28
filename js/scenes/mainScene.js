//Cena da área principal do jogo
class MainScene extends GameScene {
    constructor() {
        super({
            key: 'MainScene',
            tilemapFile: 'maintilemap',
            tilesetFile: 'tileset'
        });

        this.spawnPoint = { x: 415, y: 500 }; //Definindo o local de surgimento padrão da cena

        //Adicionando as transições de cena
        this.addSceneTrigger(150, 352, 30, 50, 'ShopScene');
        this.addSceneTrigger(448, 120, 50, 30, 'JobScene');
        this.addSceneTrigger(683, 384, 30, 50, 'HouseScene');

        //Adicionando os spawn points desta cena
        this.addSpawnPoint('ShopScene', 200, 335);
        this.addSpawnPoint('JobScene', 450, 135);
        this.addSpawnPoint('HouseScene', 645, 370);
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