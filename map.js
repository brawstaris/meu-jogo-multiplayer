class Map2D {

    constructor() {

        this.width = 2000;
        this.height = 1200;

        // =================================
        // COLISÕES
        // =================================

        this.obstacles = [

            // Parede 1
            {
                x: 200,
                y: 180,
                width: 400,
                height: 40
            },

            // Parede 2
            {
                x: 700,
                y: 300,
                width: 40,
                height: 300
            },

            // Parede 3
            {
                x: 1000,
                y: 180,
                width: 350,
                height: 40
            },

            // Parede 4
            {
                x: 1200,
                y: 500,
                width: 400,
                height: 40
            },

            // Casa
            {
                x: 300,
                y: 700,
                width: 300,
                height: 200
            },

            // Construção
            {
                x: 900,
                y: 750,
                width: 350,
                height: 180
            }
        ];


        // =================================
        // ÁRVORES
        // =================================

        this.trees = [

            {
                x: 100,
                y: 150
            },

            {
                x: 850,
                y: 150
            },

            {
                x: 1500,
                y: 150
            },

            {
                x: 1700,
                y: 300
            },

            {
                x: 1800,
                y: 700
            },

            {
                x: 700,
                y: 1000
            },

            {
                x: 1500,
                y: 1000
            },

            {
                x: 100,
                y: 1000
            }
        ];
    }


    // =================================
    // DESENHAR MAPA
    // =================================

    draw(ctx, camera) {

        // Fundo

        ctx.fillStyle =
            "#4b8f52";

        ctx.fillRect(
            -camera.x,
            -camera.y,
            this.width,
            this.height
        );


        // =================================
        // CAMINHO HORIZONTAL
        // =================================

        ctx.fillStyle =
            "#c8aa72";

        ctx.fillRect(
            -camera.x,
            500 - camera.y,
            this.width,
            120
        );


        // =================================
        // CAMINHO VERTICAL
        // =================================

        ctx.fillRect(
            600 - camera.x,
            -camera.y,
            120,
            this.height
        );


        // =================================
        // ÁRVORES
        // =================================

        for (
            const tree of this.trees
        ) {

            this.drawTree(
                ctx,
                tree.x,
                tree.y,
                camera
            );
        }
        
        // =================================
// CASAS
// =================================

this.drawHouse(
    ctx,
    300,
    700,
    300,
    200,
    camera
);

this.drawHouse(
    ctx,
    900,
    750,
    350,
    180,
    camera
);


        // =================================
        // PAREDES
        // =================================

        for (
            const obstacle of this.obstacles
        ) {

            ctx.fillStyle =
                "#5d4037";

            ctx.fillRect(
                obstacle.x - camera.x,
                obstacle.y - camera.y,
                obstacle.width,
                obstacle.height
            );


            ctx.strokeStyle =
                "#3e2723";

            ctx.lineWidth = 3;

            ctx.strokeRect(
                obstacle.x - camera.x,
                obstacle.y - camera.y,
                obstacle.width,
                obstacle.height
            );
        }
    }


    // =================================
    // DESENHAR ÁRVORE
    // =================================

    drawTree(
        ctx,
        x,
        y,
        camera
    ) {

        const screenX =
            x - camera.x;

        const screenY =
            y - camera.y;


        // Tronco

        ctx.fillStyle =
            "#6d4c41";

        ctx.fillRect(
            screenX - 8,
            screenY,
            16,
            40
        );


        // Copa

        ctx.fillStyle =
            "#236b2c";

        ctx.beginPath();

        ctx.arc(
            screenX,
            screenY,
            32,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // Segunda camada

        ctx.fillStyle =
            "#2f8f3a";

        ctx.beginPath();

        ctx.arc(
            screenX - 12,
            screenY - 15,
            20,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    // =================================
    // COLISÃO
    // =================================
    
    drawHouse(
    ctx,
    x,
    y,
    width,
    height,
    camera
) {

    const screenX =
        x - camera.x;

    const screenY =
        y - camera.y;


    // Corpo

    ctx.fillStyle =
        "#d6b37a";

    ctx.fillRect(
        screenX,
        screenY,
        width,
        height
    );


    // Telhado

    ctx.fillStyle =
        "#8e3b2f";

    ctx.beginPath();

    ctx.moveTo(
        screenX - 20,
        screenY
    );

    ctx.lineTo(
        screenX + width / 2,
        screenY - 80
    );

    ctx.lineTo(
        screenX + width + 20,
        screenY
    );

    ctx.closePath();

    ctx.fill();


    // Porta

    ctx.fillStyle =
        "#573b2b";

    ctx.fillRect(
        screenX + width / 2 - 25,
        screenY + height - 70,
        50,
        70
    );


    // Janela

    ctx.fillStyle =
        "#8ed0e8";

    ctx.fillRect(
        screenX + 35,
        screenY + 55,
        50,
        40
    );
}

    collides(
        x,
        y,
        width,
        height
    ) {

        for (
            const obstacle of this.obstacles
        ) {

            if (

                x <
                obstacle.x +
                obstacle.width &&

                x + width >
                obstacle.x &&

                y <
                obstacle.y +
                obstacle.height &&

                y + height >
                obstacle.y

            ) {

                return true;
            }
        }

        return false;
    }
}