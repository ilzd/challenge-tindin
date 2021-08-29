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

        this.itemSpots = {
            table: { x: 640, y: 590, w: 130, h: 100 },
            bed: { x: 337, y: 337, w: 100, h: 100 },
            tv: { x: 475, y: 317, w: 60, h: 60 },
            desk: { x: 337, y: 480, w: 100, h: 60 },
            mat: { x: 500, y: 467, w: 100, h: 100 },
            closet: { x: 687, y: 430, w: 100, h: 100 },
        }
    }

    //Callback inicial da cena
    init(data) {
        super.init(data);
    }

    //Pré carrega os assets utilizados pela cena
    preload() {
        super.preload();

        this.load.audio('placeitem', 'assets/audio/place.mp3');

        //Carrega os assets das mesas compradas
        for (let i = 0; i < save.itensBought.tables.length; i++) {
            let fileName = save.itensBought.tables[i];
            this.load.image(fileName, 'assets/images/' + fileName + '.png');
        }

        //Carrega os assets das camas compradas
        for (let i = 0; i < save.itensBought.beds.length; i++) {
            let fileName = save.itensBought.beds[i];
            this.load.image(fileName, 'assets/images/' + fileName + '.png');
        }

        //Carrega os assets das tvs compradas
        for (let i = 0; i < save.itensBought.tvs.length; i++) {
            let fileName = save.itensBought.tvs[i];
            this.load.image(fileName, 'assets/images/' + fileName + '.png');
        }

        //Carrega os assets das desks compradas
        for (let i = 0; i < save.itensBought.desks.length; i++) {
            let fileName = save.itensBought.desks[i];
            this.load.image(fileName, 'assets/images/' + fileName + '.png');
        }

        //Carrega os assets das mats compradas
        for (let i = 0; i < save.itensBought.mats.length; i++) {
            let fileName = save.itensBought.mats[i];
            this.load.image(fileName, 'assets/images/' + fileName + '.png');
        }

        //Carrega os assets das closets compradas
        for (let i = 0; i < save.itensBought.closets.length; i++) {
            let fileName = save.itensBought.closets[i];
            this.load.image(fileName, 'assets/images/' + fileName + '.png');
        }
    }

    //Executa uma vez no inicio da cena
    create() {
        super.create();

        //Se o jogador pressionar a tecla E, ele começa a trabalhar
        var keyObj = this.input.keyboard.addKey('E');
        keyObj.on('down', function () {
            this.place();
        }, this);

        this.table = this.physics.add.staticImage(this.itemSpots.table.x, this.itemSpots.table.y);
        this.bed = this.physics.add.staticImage(this.itemSpots.bed.x, this.itemSpots.bed.y);
        this.tv = this.physics.add.staticImage(this.itemSpots.tv.x, this.itemSpots.tv.y);
        this.desk = this.physics.add.staticImage(this.itemSpots.desk.x, this.itemSpots.desk.y);
        this.mat = this.physics.add.staticImage(this.itemSpots.mat.x, this.itemSpots.mat.y);
        this.closet = this.physics.add.staticImage(this.itemSpots.closet.x, this.itemSpots.closet.y);

        this.placeText = this.add.text(0, 0, '', { fontSize: 25, color: '#FFF', backgroundColor: '#000A' });
        this.placeText.setOrigin(0.5, 0.5);
        this.placeText.setDepth(1);
        this.placeText.visible = false;

        this.createItemAreas();
    }

    //Executa a cada frame
    update() {
        super.update();
        this.checkAreaOverlap();
    }

    //Cria as áreas onde o jogador pode interagir para posicionar seus itens
    createItemAreas() {
        this.tableArea = this.physics.add.sprite(this.itemSpots.table.x, this.itemSpots.table.y);
        this.tableArea.body.setSize(this.itemSpots.table.w, this.itemSpots.table.h);
        if (save.itensUsing.table == null) {
            this.tableAreaDisplay = this.add.rectangle(this.itemSpots.table.x, this.itemSpots.table.y, this.itemSpots.table.w, this.itemSpots.table.h)
            this.tableAreaDisplay.setStrokeStyle(2, 0x000);
        } else {
            this.table.destroy();
            this.table = this.physics.add.staticImage(this.itemSpots.table.x, this.itemSpots.table.y, save.itensBought.tables[save.itensUsing.table]);
            this.physics.add.collider(this.table, this.character);
        }

        this.bedArea = this.physics.add.sprite(this.itemSpots.bed.x, this.itemSpots.bed.y);
        this.bedArea.body.setSize(this.itemSpots.bed.w, this.itemSpots.bed.h);
        if (save.itensUsing.bed == null) {
            this.bedAreaDisplay = this.add.rectangle(this.itemSpots.bed.x, this.itemSpots.bed.y, this.itemSpots.bed.w, this.itemSpots.bed.h)
            this.bedAreaDisplay.setStrokeStyle(2, 0x000);
        } else {
            this.bed.destroy();
            this.bed = this.physics.add.staticImage(this.itemSpots.bed.x, this.itemSpots.bed.y, save.itensBought.beds[save.itensUsing.bed]);
            this.physics.add.collider(this.bed, this.character);
        }

        this.tvArea = this.physics.add.sprite(this.itemSpots.tv.x, this.itemSpots.tv.y);
        this.tvArea.body.setSize(this.itemSpots.tv.w, this.itemSpots.tv.h);
        if (save.itensUsing.tv == null) {
            this.tvAreaDisplay = this.add.rectangle(this.itemSpots.tv.x, this.itemSpots.tv.y, this.itemSpots.tv.w, this.itemSpots.tv.h)
            this.tvAreaDisplay.setStrokeStyle(2, 0x000);
        } else {
            this.tv.destroy();
            this.tv = this.physics.add.staticImage(this.itemSpots.tv.x, this.itemSpots.tv.y, save.itensBought.tvs[save.itensUsing.tv]);
            this.physics.add.collider(this.tv, this.character);
        }

        this.deskArea = this.physics.add.sprite(this.itemSpots.desk.x, this.itemSpots.desk.y);
        this.deskArea.body.setSize(this.itemSpots.desk.w, this.itemSpots.desk.h);
        if (save.itensUsing.desk == null) {
            this.deskAreaDisplay = this.add.rectangle(this.itemSpots.desk.x, this.itemSpots.desk.y, this.itemSpots.desk.w, this.itemSpots.desk.h)
            this.deskAreaDisplay.setStrokeStyle(2, 0x000);
        } else {
            this.desk.destroy();
            this.desk = this.physics.add.staticImage(this.itemSpots.desk.x, this.itemSpots.desk.y, save.itensBought.desks[save.itensUsing.desk]);
            this.physics.add.collider(this.desk, this.character);
        }

        this.matArea = this.physics.add.sprite(this.itemSpots.mat.x, this.itemSpots.mat.y);
        this.matArea.body.setSize(this.itemSpots.mat.w, this.itemSpots.mat.h);
        if (save.itensUsing.mat == null) {
            this.matAreaDisplay = this.add.rectangle(this.itemSpots.mat.x, this.itemSpots.mat.y, this.itemSpots.mat.w, this.itemSpots.mat.h)
            this.matAreaDisplay.setStrokeStyle(2, 0x000);
        } else {
            this.mat.destroy();
            this.mat = this.physics.add.staticImage(this.itemSpots.mat.x, this.itemSpots.mat.y, save.itensBought.mats[save.itensUsing.mat]);
            //this.physics.add.collider(this.mat, this.character);
        }

        this.closetArea = this.physics.add.sprite(this.itemSpots.closet.x, this.itemSpots.closet.y);
        this.closetArea.body.setSize(this.itemSpots.closet.w, this.itemSpots.closet.h);
        if (save.itensUsing.closet == null) {
            this.closetAreaDisplay = this.add.rectangle(this.itemSpots.closet.x, this.itemSpots.closet.y, this.itemSpots.closet.w, this.itemSpots.closet.h)
            this.closetAreaDisplay.setStrokeStyle(2, 0x000);
        } else {
            this.closet.destroy();
            this.closet = this.physics.add.staticImage(this.itemSpots.closet.x, this.itemSpots.closet.y, save.itensBought.closets[save.itensUsing.closet]);
            this.physics.add.collider(this.closet, this.character);
        }
    }

    //Verifica se o jogador está na área de algum item
    checkAreaOverlap() {
        this.placeText.visible = false;
        if (this.physics.overlap(this.character, this.tableArea)) {
            if (save.itensUsing.table == null) {
                this.placeText.setText('Pressione E para montar a mesa!');
            } else {
                this.placeText.setText('Pressione E para trocar de mesa!');
            }
            this.placeText.x = this.itemSpots.table.x;
            this.placeText.y = this.itemSpots.table.y;
            this.placeText.visible = true;
        } else if (this.physics.overlap(this.character, this.bedArea)) {
            if (save.itensUsing.bed == null) {
                this.placeText.setText('Pressione E para montar a cama!');
            } else {
                this.placeText.setText('Pressione E para trocar de cama!');
            }
            this.placeText.x = this.itemSpots.bed.x;
            this.placeText.y = this.itemSpots.bed.y;
            this.placeText.visible = true;
        } else if (this.physics.overlap(this.character, this.tvArea)) {
            if (save.itensUsing.tv == null) {
                this.placeText.setText('Pressione E para instalar a TV!');
            } else {
                this.placeText.setText('Pressione E para trocar de TV!');
            }
            this.placeText.x = this.itemSpots.tv.x;
            this.placeText.y = this.itemSpots.tv.y;
            this.placeText.visible = true;
        } else if (this.physics.overlap(this.character, this.deskArea)) {
            if (save.itensUsing.desk == null) {
                this.placeText.setText('Pressione E para montar o móvel!');
            } else {
                this.placeText.setText('Pressione E para trocar de móvel!');
            }
            this.placeText.x = this.itemSpots.desk.x;
            this.placeText.y = this.itemSpots.desk.y;
            this.placeText.visible = true;
        } else if (this.physics.overlap(this.character, this.matArea)) {
            if (save.itensUsing.mat == null) {
                this.placeText.setText('Pressione E para colocar o tapete!');
            } else {
                this.placeText.setText('Pressione E para trocar de tapete!');
            }
            this.placeText.x = this.itemSpots.mat.x;
            this.placeText.y = this.itemSpots.mat.y;
            this.placeText.visible = true;
        } else if (this.physics.overlap(this.character, this.closetArea)) {
            if (save.itensUsing.closet == null) {
                this.placeText.setText('Pressione E para colocar o armário!');
            } else {
                this.placeText.setText('Pressione E para trocar de armário!');
            }
            this.placeText.x = this.itemSpots.closet.x;
            this.placeText.y = this.itemSpots.closet.y;
            this.placeText.visible = true;
        }
    }

    //Tenta posicionar um item comprado caso as condições sejam atendidas
    place() {
        if (this.physics.overlap(this.character, this.tableArea)) {
            if (save.itensBought.tables.length == 0) {
                this.character.speak('Eu ainda não comprei\nnenhuma mesa!');
                return;
            }
            if (save.itensUsing.table == null) {
                save.itensUsing.table = 0;
                this.tableAreaDisplay.destroy();
                this.sound.play('placeitem');
            } else {
                if (save.itensBought.tables.length == 1) {
                    this.character.speak('Eu não tenho outra mesa!');
                } else {
                    this.sound.play('placeitem');
                    save.itensUsing.table++;
                    if (save.itensUsing.table == save.itensBought.tables.length) {
                        save.itensUsing.table = 0;
                    }
                }
            }
            this.table.destroy();
            this.table = this.physics.add.staticImage(this.itemSpots.table.x, this.itemSpots.table.y, save.itensBought.tables[save.itensUsing.table]);
            this.physics.add.collider(this.table, this.character);
        } else if (this.physics.overlap(this.character, this.bedArea)) {
            if (save.itensBought.beds.length == 0) {
                this.character.speak('Eu ainda não comprei\nnenhuma cama!');
                return;
            }
            if (save.itensUsing.bed == null) {
                save.itensUsing.bed = 0;
                this.sound.play('placeitem');
                this.bedAreaDisplay.destroy();
            } else {
                if (save.itensBought.beds.length == 1) {
                    this.character.speak('Eu não tenho outra cama!');
                } else {
                    this.sound.play('placeitem');
                    save.itensUsing.bed++;
                    if (save.itensUsing.bed == save.itensBought.beds.length) {
                        save.itensUsing.bed = 0;
                    }
                }
            }
            this.bed.destroy();
            this.bed = this.physics.add.staticImage(this.itemSpots.bed.x, this.itemSpots.bed.y, save.itensBought.beds[save.itensUsing.bed]);
            this.physics.add.collider(this.bed, this.character);
        } else if (this.physics.overlap(this.character, this.tvArea)) {
            if (save.itensBought.tvs.length == 0) {
                this.character.speak('Eu ainda não comprei\nnenhuma TV!');
                return;
            }
            if (save.itensUsing.tv == null) {
                save.itensUsing.tv = 0;
                this.sound.play('placeitem');
                this.tvAreaDisplay.destroy();
            } else {
                if (save.itensBought.tvs.length == 1) {
                    this.character.speak('Eu não tenho outra TV!');
                } else {
                    this.sound.play('placeitem');
                    save.itensUsing.tv++;
                    if (save.itensUsing.tv == save.itensBought.tvs.length) {
                        save.itensUsing.tv = 0;
                    }
                }
            }
            this.tv.destroy();
            this.tv = this.physics.add.staticImage(this.itemSpots.tv.x, this.itemSpots.tv.y, save.itensBought.tvs[save.itensUsing.tv]);
            this.physics.add.collider(this.tv, this.character);
        } else if (this.physics.overlap(this.character, this.deskArea)) {
            if (save.itensBought.desks.length == 0) {
                this.character.speak('Eu ainda não comprei\nnenhuma mesinha!');
                return;
            }
            if (save.itensUsing.desk == null) {
                save.itensUsing.desk = 0;
                this.sound.play('placeitem');
                this.deskAreaDisplay.destroy();
            } else {
                if (save.itensBought.desks.length == 1) {
                    this.character.speak('Eu não tenho outra mesinha!');
                } else {
                    this.sound.play('placeitem');
                    save.itensUsing.desk++;
                    if (save.itensUsing.desk == save.itensBought.desks.length) {
                        save.itensUsing.desk = 0;
                    }
                }
            }
            this.desk.destroy();
            this.desk = this.physics.add.staticImage(this.itemSpots.desk.x, this.itemSpots.desk.y, save.itensBought.desks[save.itensUsing.desk]);
            this.physics.add.collider(this.desk, this.character);
        } else if (this.physics.overlap(this.character, this.matArea)) {
            if (save.itensBought.mats.length == 0) {
                this.character.speak('Eu ainda não comprei\nnenhum tapete!');
                return;
            }
            if (save.itensUsing.mat == null) {
                save.itensUsing.mat = 0;
                this.sound.play('placeitem');
                this.matAreaDisplay.destroy();
            } else {
                if (save.itensBought.mats.length == 1) {
                    this.character.speak('Eu não tenho outro tapete!');
                } else {
                    this.sound.play('placeitem');
                    save.itensUsing.mat++;
                    if (save.itensUsing.mat == save.itensBought.mats.length) {
                        save.itensUsing.mat = 0;
                    }
                }
            }
            this.mat.destroy();
            this.mat = this.physics.add.staticImage(this.itemSpots.mat.x, this.itemSpots.mat.y, save.itensBought.mats[save.itensUsing.mat]);
            //this.physics.add.collider(this.mat, this.character);
        } else if (this.physics.overlap(this.character, this.closetArea)) {
            if (save.itensBought.closets.length == 0) {
                this.character.speak('Eu ainda não comprei\nnenhum armário!');
                return;
            }
            if (save.itensUsing.closet == null) {
                save.itensUsing.closet = 0;
                this.sound.play('placeitem');
                this.closetAreaDisplay.destroy();
            } else {
                if (save.itensBought.closets.length == 1) {
                    this.character.speak('Eu não tenho outro armário!');
                } else {
                    this.sound.play('placeitem');
                    save.itensUsing.closet++;
                    if (save.itensUsing.closet == save.itensBought.closets.length) {
                        save.itensUsing.closet = 0;
                    }
                }
            }
            this.closet.destroy();
            this.closet = this.physics.add.staticImage(this.itemSpots.closet.x, this.itemSpots.closet.y, save.itensBought.closets[save.itensUsing.closet]);
            this.physics.add.collider(this.closet, this.character);
        }
    }
}