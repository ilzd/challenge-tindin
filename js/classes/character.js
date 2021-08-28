class Character extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'character', 7);

        this.scene = scene;

        this.scene.physics.world.enable(this);

        this.scene.add.existing(this);  //Adiciona esta instância na cena

        this.animFrameRate = 10; //Velocidade de transição entre os frames do spritesheet

        this.defineAnimations();

        this.moveSpeed = 200; //Velocidade de movimento do personagem

        //Redimensiona e reposiciona o body pra colisão ficar nos pés
        this.body.setSize(25, 25);
        this.body.setOffset(this.body.offset.x, 40);

        this.busy = false; //Se true, o personagem não pode andar nem interagir com nada
    }

    //Define as animações de movimentação para todas as direções
    defineAnimations() {
        this.scene.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('character', { start: 0, end: 2 }),
            frameRate: this.animFrameRate,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('character', { start: 3, end: 5 }),
            frameRate: this.animFrameRate,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('character', { start: 6, end: 8 }),
            frameRate: this.animFrameRate,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('character', { start: 9, end: 11 }),
            frameRate: this.animFrameRate,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'idle',
            frames: [{ key: 'character', frame: 7 }],
            frameRate: 10
        });
    }

    //Define tudo que precisa ser atualizado a cada frame
    update() {
        if (!this.busy) {
            this.move();
        }
    }

    move() {
        var cursorKeys = this.scene.input.keyboard.createCursorKeys();
        let velocity = new Phaser.Math.Vector2(0, 0);

        //Acumula em um vetor todas as direções sendo pressionadas
        if (cursorKeys.left.isDown) {
            velocity.x--;
        }
        if (cursorKeys.right.isDown) {
            velocity.x++;
        }
        if (cursorKeys.up.isDown) {
            velocity.y--;
        }
        if (cursorKeys.down.isDown) {
            velocity.y++;
        }

        //Se a magnitude não for 0, então normaliza o vetor
        if (velocity.x != 0 || velocity.y != 0) {
            velocity.normalize();
        }

        //Escala ele de acordo com a velocidade do personagem
        velocity.scale(this.moveSpeed);

        //Seta a velocidade do 'character'
        this.setVelocity(velocity.x, velocity.y);

        this.checkAnimation(velocity.x, velocity.y);
    }

    checkAnimation(x, y) {
        //Verifica a direção da velocidade do personagem e executa a animação adequada
        if (y < 0) {
            this.anims.play('up', true);
        } else if (y > 0) {
            this.anims.play('down', true);
        } else {
            if (x < 0) {
                this.anims.play('left', true);
            } else if (x > 0) {
                this.anims.play('right', true);
            } else {
                this.anims.play('idle');
            }
        }
    }

    setBusy(isBusy) {
        this.busy = isBusy;
        if (isBusy) this.anims.play('idle')
    }
}