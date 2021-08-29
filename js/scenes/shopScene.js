class ShopScene extends GameScene {
    constructor() {
        super({
            key: 'ShopScene',
            tilemapFile: 'shopscenetilemap',
            tilesetFile: 'tileset'
        });

        this.spawnPoint = { x: 600, y: 400 }; //Definindo o local de surgimento padrão da cena

        //Adicionando as transições de cena
        this.addSceneTrigger(650, 415, 30, 60, 'MainScene');

        //Lista de itens disponíveis
        this.itemsForSale = [
            { fileName: 'table1', pos: { x: 115, y: 600 }, price: 200, type: 'TABLE' },
            { fileName: 'table2', pos: { x: 115, y: 490 }, price: 150, type: 'TABLE' },
            { fileName: 'table3', pos: { x: 115, y: 380 }, price: 250, type: 'TABLE' },
            { fileName: 'bed1', pos: { x: 400, y: 585 }, price: 200, type: 'BED' },
            { fileName: 'bed2', pos: { x: 500, y: 585 }, price: 200, type: 'BED' },
            { fileName: 'bed3', pos: { x: 600, y: 585 }, price: 200, type: 'BED' },
            { fileName: 'tv1', pos: { x: 500, y: 230 }, price: 200, type: 'TV' },
            { fileName: 'tv2', pos: { x: 600, y: 230 }, price: 250, type: 'TV' },
            { fileName: 'desk1', pos: { x: 400, y: 230 }, price: 130, type: 'DESK' },
            { fileName: 'mat1', pos: { x: 250, y: 400 }, price: 100, type: 'MAT' },
            { fileName: 'mat2', pos: { x: 370, y: 400 }, price: 100, type: 'MAT' },
            { fileName: 'mat3', pos: { x: 490, y: 400 }, price: 100, type: 'MAT' },
            { fileName: 'closet1', pos: { x: 115, y: 230 }, price: 190, type: 'CLOSET' },
            { fileName: 'closet2', pos: { x: 215, y: 230 }, price: 190, type: 'CLOSET' },
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
        this.buyText.setDepth(1);
        this.buyText.visible = false;
        this.priceText = this.add.text(100, 100, "", { fontSize: 20, color: '#FFF', backgroundColor: '#000A' });
        this.priceText.setOrigin(0.5, 0.5);
        this.priceText.setDepth(1);
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
        for (let i = 0; i < save.itensBought.beds.length; i++) {
            if (itemName == save.itensBought.beds[i]) return true;
        }
        for (let i = 0; i < save.itensBought.tvs.length; i++) {
            if (itemName == save.itensBought.tvs[i]) return true;
        }
        for (let i = 0; i < save.itensBought.desks.length; i++) {
            if (itemName == save.itensBought.desks[i]) return true;
        }
        for (let i = 0; i < save.itensBought.mats.length; i++) {
            if (itemName == save.itensBought.mats[i]) return true;
        }
        for (let i = 0; i < save.itensBought.closets.length; i++) {
            if (itemName == save.itensBought.closets[i]) return true;
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
                    case 'TV':
                        save.itensBought.tvs.push(this.itemsForSale[item.itemIndex].fileName);
                        item.buyArea.destroy();
                        item.destroy();
                        break;
                    case 'DESK':
                        save.itensBought.desks.push(this.itemsForSale[item.itemIndex].fileName);
                        item.buyArea.destroy();
                        item.destroy();
                        break;
                    case 'MAT':
                        save.itensBought.mats.push(this.itemsForSale[item.itemIndex].fileName);
                        item.buyArea.destroy();
                        item.destroy();
                        break;
                    case 'CLOSET':
                        save.itensBought.closets.push(this.itemsForSale[item.itemIndex].fileName);
                        item.buyArea.destroy();
                        item.destroy();
                        break;
                    default:
                        break;
                }
            } else {
                this.character.speak('Eu não tenho dinheiro para isto,\npreciso trabalhar!');
            }
        } else {
            this.character.speak('Eu preciso me aproximar de\nalgo para comprar!');
        }
    }
}