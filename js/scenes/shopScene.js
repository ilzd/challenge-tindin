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

        //Lista de itens disponíveis
        this.itemsForSale = [
            { fileName: 'table1', pos: { x: 100, y: 600 }, price: 200, type: 'TABLE' },
            { fileName: 'table2', pos: { x: 100, y: 400 }, price: 200, type: 'TABLE' },
            { fileName: 'table3', pos: { x: 100, y: 200 }, price: 200, type: 'TABLE' },
            { fileName: 'bed1', pos: { x: 300, y: 600 }, price: 200, type: 'BED' },
            { fileName: 'bed2', pos: { x: 300, y: 400 }, price: 200, type: 'BED' },
            { fileName: 'bed3', pos: { x: 300, y: 200 }, price: 200, type: 'BED' },
        ];

        //Areas triggers de compra
        this.itensOnScene = [];
    }

    //Callback inicial da cena
    init(data) {
        super.init(data);
    }

    //Pré carrega os assets utilizados pela cena
    preload() {
        super.preload();
        for (let i = 0; i < this.itemsForSale.length; i++) {
            let item = this.itemsForSale[i];
            this.load.image(item.fileName, 'assets/images/' + item.fileName + '.png');
        }
    }

    //Executa uma vez no inicio da cena
    create() {
        super.create();

        //Cria todos os itens disponívels na loja
        for (let i = 0; i < this.itemsForSale.length; i++) {
            let itemData = this.itemsForSale[i];
            if (!this.itemWasBought(itemData.fileName)) {
                let item = this.physics.add.staticImage(itemData.pos.x, itemData.pos.y, itemData.fileName);
                item.itemIndex = i;
                item.buyArea = this.physics.add.sprite(item.x, item.y); //Adiciona a area trigger para comprar este item
                item.buyArea.body.setSize(item.displayWidth + 35, item.displayHeight + 35);
                this.itensOnScene.push(item);

                this.physics.add.collider(item, this.character);
            }
        }

        //Se o jogador pressionar a tecla E, ele tenta comprar algo
        var keyObj = this.input.keyboard.addKey('E');
        keyObj.on('down', function () {
            this.buy();
        }, this);

        //Texto instrutivo sobre como comprar e o preço do item
        this.buyText = this.add.text(100, 100, "Pressione E para comprar!", { fontSize: 20, color: '#FFF', backgroundColor: '#000A' });
        this.buyText.setOrigin(0.5, 0.5);
        this.buyText.visible = false;
        this.priceText = this.add.text(100, 100, "", { fontSize: 20, color: '#FFF', backgroundColor: '#000A' });
        this.priceText.setOrigin(0.5, 0.5);
        this.priceText.visible = false;
    }

    //Executa a cada frame
    update() {
        super.update();

        //Só precisa mostrar caso o jogador esteja próximo a um item da loja
        this.buyText.visible = false;
        this.priceText.visible = false;

        let item = this.getOverlapingItem();
        if (item != null) { //Se ele estiver perto de um item
            //Repositiona o texto para o objeto em questão e os mostra
            this.buyText.x = item.x;
            this.buyText.y = item.y;
            this.buyText.visible = true;
            this.priceText.setText("Preço: " + this.itemsForSale[item.itemIndex].price);
            this.priceText.x = item.x;
            this.priceText.y = item.y + 25;
            this.priceText.visible = true;
        }
    }

    //Retorna o item da loja que o personagem está próximo o suficiente pra comprar
    getOverlapingItem() {
        for (let i = 0; i < this.itensOnScene.length; i++) {
            let item = this.itensOnScene[i];
            if (this.physics.overlap(this.character, item.buyArea)) { //Checa se o personagem esta collidindo com a area tigger do item
                return item;
            }
        }

        return null;
    }

    //Retorna se um item ja foi comprado pelo jogador
    itemWasBought(itemName) {
        for (let i = 0; i < save.itensBought.tables.length; i++) {
            if (itemName == save.itensBought.tables[i]) return true;
        }

        return false;
    }

    //Executa a compra caso as condições necessárias sejam atendidas
    buy() {
        let item = this.getOverlapingItem();
        if (item != null) {
            let price = this.itemsForSale[item.itemIndex].price;
            if (save.money >= price) { //Se o player tem dinheiro suficiente
                this.spendMoney(price);
                switch (this.itemsForSale[item.itemIndex].type) { //Checa o tipo de item pra adicionar corretamente no save
                    case 'TABLE':
                        save.itensBought.tables.push(this.itemsForSale[item.itemIndex].fileName);
                        item.buyArea.destroy();
                        item.destroy();
                        break;
                    case 'BED':
                        save.itensBought.beds.push(this.itemsForSale[item.itemIndex].fileName);
                        item.buyArea.destroy();
                        item.destroy();
                        break;
                    default:
                        break;
                }
            }
        }
    }
}