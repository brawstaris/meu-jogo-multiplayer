class Player {

    constructor(
        x,
        y,
        id,
        color
    ) {

        this.x = x;
        this.y = y;

        this.id = id;

        this.color = color;

        this.width = 36;
        this.height = 48;

        this.nickname = "Jogador";


        // ==============================
        // ANIMAÇÃO
        // ==============================

        this.walking = false;

        this.direction = "down";

        this.animationFrame = 0;

        this.animationTimer = 0;
    }


    update(
        moveX,
        moveY
    ) {

        this.walking =
            moveX !== 0 ||
            moveY !== 0;


        // Direção

        if (moveX > 0) {

            this.direction =
                "right";

        } else if (moveX < 0) {

            this.direction =
                "left";

        } else if (moveY > 0) {

            this.direction =
                "down";

        } else if (moveY < 0) {

            this.direction =
                "up";
        }


        // Movimento

        this.x += moveX;

        this.y += moveY;


        // Animação

        if (this.walking) {

            this.animationTimer++;

            if (
                this.animationTimer >= 8
            ) {

                this.animationTimer = 0;

                this.animationFrame++;

                if (
                    this.animationFrame > 3
                ) {

                    this.animationFrame = 0;

                }
            }

        } else {

            this.animationFrame = 0;

            this.animationTimer = 0;
        }
    }


    draw(
        ctx,
        camera
    ) {

        const screenX =
            this.x - camera.x;

        const screenY =
            this.y - camera.y;


        // ==============================
        // SOMBRA
        // ==============================

        ctx.fillStyle =
            "rgba(0,0,0,0.25)";

        ctx.beginPath();

        ctx.ellipse(
            screenX +
                this.width / 2,

            screenY +
                this.height,

            18,
            6,

            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // ==============================
        // ANIMAÇÃO DAS PERNAS
        // ==============================

        let legOffset = 0;

        if (this.walking) {

            if (
                this.animationFrame % 2 === 0
            ) {

                legOffset = 5;

            } else {

                legOffset = -5;

            }
        }


        // ==============================
        // PERNAS
        // ==============================

        ctx.fillStyle =
            "#263238";


        ctx.fillRect(
            screenX + 8,
            screenY + 30 + legOffset,
            8,
            16
        );


        ctx.fillRect(
            screenX + 20,
            screenY + 30 - legOffset,
            8,
            16
        );


        // ==============================
        // CORPO
        // ==============================

        ctx.fillStyle =
            this.color;

        ctx.fillRect(
            screenX + 5,
            screenY + 14,
            26,
            22
        );


        // ==============================
        // BRAÇOS
        // ==============================

        ctx.fillStyle =
            this.color;


        let armOffset = 0;

        if (this.walking) {

            armOffset =
                legOffset;

        }


        ctx.fillRect(
            screenX - 2,
            screenY + 16 + armOffset,
            7,
            18
        );


        ctx.fillRect(
            screenX + 31,
            screenY + 16 - armOffset,
            7,
            18
        );


        // ==============================
        // CABEÇA
        // ==============================

        ctx.fillStyle =
            "#f1c27d";

        ctx.beginPath();

        ctx.arc(
            screenX +
                this.width / 2,

            screenY + 10,

            12,

            0,
            Math.PI * 2
        );

        ctx.fill();


        // ==============================
        // CABELO
        // ==============================

        ctx.fillStyle =
            "#3e2723";

        ctx.beginPath();

        ctx.arc(
            screenX +
                this.width / 2,

            screenY + 7,

            12,

            Math.PI,

            Math.PI * 2
        );

        ctx.fill();


        // ==============================
        // NOME
        // ==============================

        ctx.fillStyle =
            "white";

        ctx.font =
            "14px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            this.nickname,
            screenX +
                this.width / 2,
            screenY - 8
        );
    }
}