class JobScene extends GameScene {
    constructor() {
        super({
            key: 'JobScene',
            tilemapFile: 'jobtilemap',
            tilesetFile: 'tileset'
        });

        this.spawnPoint = { x: 430, y: 465 }; //Definindo o local de surgimento padrão da cena

        //Adicionando as transições de cena
        this.addSceneTrigger(430, 520, 80, 30, 'MainScene');

        this.jobAreaData = { x: 430, y: 280, w: 220, h: 130 }; //Dados da área onde o player pode trabalhar
        this.progressBarData = { x: 430, y: 240, w: 220, h: 30 }; //Posição e tamanho da barra de progresso do trabalho

        this.moneyPerJob = 100; //Remuneração por trabalho
        this.canWork = false; //Se o jogador está na mesa de trabalho
        this.working = false; //Se ele está trabalhando neste momento
        this.workStage = 0; //Estágio de trabalho, incrementa enquanto ele trabalho
        this.workMaxStage = 300; //Duração de cada trabalho
    }

    //Callback inicial da cena
    init(data) {
        super.init(data);
    }

    //Pré carrega os assets utilizados pela cena
    preload() {
        super.preload();
    }

    //Executa uma vez no inicio da cena
    create() {
        super.create();

        //Criando o trigger da área onde se pode trabalhar
        this.jobArea = this.physics.add.sprite(this.jobAreaData.x, this.jobAreaData.y);
        this.jobArea.setSize(this.jobAreaData.w, this.jobAreaData.h);
        this.jobArea.alpha = 0.3;

        //Criando o texto informando que o jogador pode trabalhar
        this.canWorkText = this.add.text(this.jobArea.x, this.jobArea.y, "Pressione E para trabalhar!", { fontSize: 25, color: '#FFF', backgroundColor: '#000A' });
        this.canWorkText.setOrigin(0.5, 0.5);

        //Se o jogador pressionar a tecla E, ele começa a trabalhar
        var keyObj = this.input.keyboard.addKey('E');
        keyObj.on('down', function () {
            this.work();
        }, this);

        //Criando a barra de progresso
        this.progressBorder = this.add.rectangle(this.progressBarData.x, this.progressBarData.y, this.progressBarData.w, this.progressBarData.h);
        this.progressBorder.setStrokeStyle(4, 0x000);
        this.progressBorder.setFillStyle(0x000);
        this.progressBorder.visible = false;
        this.progress = this.add.rectangle(this.progressBarData.x - this.progressBarData.w / 2, this.progressBarData.y, this.progressBarData.w, this.progressBarData.h);
        this.progress.setOrigin(0, 0.5);
        this.progress.setFillStyle(0x00FF00);
        this.progress.visible = false;
    }

    //Executa a cada frame
    update() {
        super.update();
        this.canWork = this.physics.overlap(this.character, this.jobArea); //Ele só pode trabalhar se estiver na área correta
        this.canWorkText.visible = this.canWork && !this.working; //Só mostre a opção de trabalhar caso esteja na área correta

        if (this.working) {
            this.workStage++; //Progride o trabalho a cada frame
            this.progress.displayWidth = this.progressBarData.w * (this.workStage / this.workMaxStage); //Atualiza a barra de progresso
            if (this.workStage == this.workMaxStage) {
                this.finishWork();
            }
        }
    }

    //Inicia o trabalho caso o player esteja no lugar certo e ele já não esteja trabalhando
    work() {
        if (!this.working && this.canWork) {
            this.workStage = 0;
            this.working = true;
            this.character.setBusy(true);

            //Mostra a barra de progresso
            this.progressBorder.visible = true;
            this.progress.visible = true;
        }
    }

    //Finaliza o trabalho
    finishWork() {
        this.working = false;
        this.gainMoney(this.moneyPerJob);
        this.character.setBusy(false);

        //Esconde a barra de progresso
        this.progressBorder.visible = false;
        this.progress.visible = false;
    }
}