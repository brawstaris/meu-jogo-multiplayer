class Game {

    constructor(canvas) {

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        // =================================
        // JOGADOR
        // =================================

        this.player = new Player(
            400,
            300,
            socket.id,
            "#3498db"
        );

        this.otherPlayers = {};


        // =================================
        // CÂMERA
        // =================================

        this.camera = {
            x: 0,
            y: 0
        };


        // =================================
        // ZOOM
        // =================================

        this.zoom = 1;


        // =================================
        // TAMANHO DO MUNDO
        // =================================

        this.worldWidth = 2000;
        this.worldHeight = 1200;


        // =================================
        // MAPA
        // =================================

        this.map = new Map2D();


        // =================================
        // CONTROLES
        // =================================

        this.controls = new Controls();
        
        this.interactionTarget = null;


        // =================================
        // BOTÕES DE ZOOM
        // =================================

        const zoomIn =
            document.getElementById("zoomIn");

        const zoomOut =
            document.getElementById("zoomOut");


        if (zoomIn) {

            zoomIn.addEventListener(
                "click",
                () => {

                    this.zoom += 0.1;

                    this.zoom =
                        Math.min(
                            2,
                            this.zoom
                        );
                }
            );
        }


        if (zoomOut) {

            zoomOut.addEventListener(
                "click",
                () => {

                    this.zoom -= 0.1;

                    this.zoom =
                        Math.max(
                            0.6,
                            this.zoom
                        );
                }
            );
        }
        
        const interactButton =
    document.getElementById(
        "interactButton"
    );

if (interactButton) {

    interactButton.addEventListener(
        "click",
        () => {

            if (
                !this.interactionTarget
            ) {
                return;
            }

            this.interactWithObject(
                this.interactionTarget
            );

        }
    );
}


        // =================================
        // TAMANHO DA TELA
        // =================================

        this.resize();

        window.addEventListener(
            "resize",
            () => {

                this.resize();

            }
        );


        // =================================
        // HUD
        // =================================

        this.updateHUD();


        // =================================
        // MULTIPLAYER
        // =================================

        this.setupMultiplayer();


        // =================================
        // INICIAR JOGO
        // =================================

        this.loop();
    }


    // =====================================
    // HUD
    // =====================================

    updateHUD() {

        const nameElement =
            document.getElementById(
                "playerName"
            );


        if (nameElement) {

            nameElement.textContent =
                "👤 " +
                (
                    this.player.nickname ||
                    "Jogador"
                );
        }


        const roomElement =
            document.getElementById(
                "roomInfo"
            );


        if (roomElement) {

            const roomId =
                sessionStorage.getItem(
                    "roomId"
                );


            roomElement.textContent =
                "🏠 Sala: " +
                (
                    roomId ||
                    "-"
                );
        }
    }


    // =====================================
    // MULTIPLAYER
    // =====================================

    checkInteraction() {

    const button =
        document.getElementById(
            "interactButton"
        );


    if (!button) {
        return;
    }


    const player =
        this.player;


    // Objeto de teste

    const tree = {

    type: "tree",

    x: 600,
    y: 300,

    width: 50,
    height: 60

};

    const distanceX =
        Math.abs(
            player.x - tree.x
        );


    const distanceY =
        Math.abs(
            player.y - tree.y
        );


    const distance =
        Math.sqrt(
            distanceX * distanceX +
            distanceY * distanceY
        );


    if (distance < 100) {

        this.interactionTarget =
            tree;

        button.style.display =
            "block";

    } else {

        this.interactionTarget =
            null;

        button.style.display =
            "none";
    }
}
    
    interactWithObject(object) {

    const message =
        document.getElementById(
            "interactionMessage"
        );

    const text =
        document.getElementById(
            "interactionText"
        );


    if (!message || !text) {
        return;
    }


    if (object.type === "tree") {

        text.textContent =
            "🌳 Você encontrou uma árvore.";

    } else {

        text.textContent =
            "Você encontrou um objeto.";
    }


    message.style.display =
        "flex";
}
    
    setupMultiplayer() {


        // =================================
        // RECEBER JOGADORES
        // =================================

        socket.on(
            "players",
            (players) => {

                for (
                    const id in players
                ) {

                    if (
                        id === socket.id
                    ) {
                        continue;
                    }


                    const data =
                        players[id];


                    this.otherPlayers[id] =
                        new Player(
                            data.x,
                            data.y,
                            id,
                            "#e74c3c"
                        );


                    this.otherPlayers[id]
                        .nickname =
                            data.nickname ||
                            "Jogador";
                }
            }
        );


        // =================================
        // NOVO JOGADOR
        // =================================

        socket.on(
            "playerJoined",
            (data) => {

                console.log(
                    "Novo jogador:",
                    data.id
                );


                this.otherPlayers[data.id] =
                    new Player(
                        data.x,
                        data.y,
                        data.id,
                        "#e74c3c"
                    );


                this.otherPlayers[data.id]
                    .nickname =
                        data.nickname ||
                        "Jogador";
            }
        );


        // =================================
        // NICKNAME DE OUTRO JOGADOR
        // =================================

        socket.on(
            "playerNickname",
            (data) => {

                const player =
                    this.otherPlayers[data.id];


                if (!player) {
                    return;
                }


                player.nickname =
                    data.nickname;
            }
        );


        // =================================
        // MOVIMENTO DE OUTRO JOGADOR
        // =================================

        socket.on(
            "playerMoved",
            (data) => {

                const player =
                    this.otherPlayers[data.id];


                if (!player) {
                    return;
                }


                const oldX =
                    player.x;

                const oldY =
                    player.y;


                player.x =
                    data.x;

                player.y =
                    data.y;


                const dx =
                    data.x - oldX;

                const dy =
                    data.y - oldY;


                if (dx > 0) {

                    player.direction =
                        "right";

                } else if (dx < 0) {

                    player.direction =
                        "left";

                } else if (dy > 0) {

                    player.direction =
                        "down";

                } else if (dy < 0) {

                    player.direction =
                        "up";
                }
            }
        );


        // =================================
        // JOGADOR SAIU
        // =================================

        socket.on(
            "playerLeft",
            (id) => {

                delete this.otherPlayers[id];


                console.log(
                    "Jogador saiu:",
                    id
                );
            }
        );


        // =================================
        // NOSSO NICKNAME
        // =================================

        socket.on(
            "nicknameSet",
            (nickname) => {

                this.player.nickname =
                    nickname;


                this.updateHUD();
            }
        );
    }


    // =====================================
    // REDIMENSIONAR CANVAS
    // =====================================

    resize() {

        this.canvas.width =
            window.innerWidth;

        this.canvas.height =
            window.innerHeight;
    }


    // =====================================
    // ATUALIZAR JOGO
    // =====================================

    update() {

        const movement =
            this.controls.getMovement();


        // =================================
        // POSIÇÃO ANTIGA
        // =================================

        const oldX =
            this.player.x;

        const oldY =
            this.player.y;


        // =================================
        // MOVIMENTO
        // =================================

        this.player.update(
            movement.x,
            movement.y
        );


        // =================================
        // COLISÃO
        // =================================

        if (
            this.map.collides(
                this.player.x,
                this.player.y,
                this.player.width,
                this.player.height
            )
        ) {

            this.player.x =
                oldX;

            this.player.y =
                oldY;
        }


        // =================================
        // LIMITES DO MAPA
        // =================================

        this.player.x =
            Math.max(
                0,
                Math.min(
                    this.worldWidth -
                    this.player.width,
                    this.player.x
                )
            );


        this.player.y =
            Math.max(
                0,
                Math.min(
                    this.worldHeight -
                    this.player.height,
                    this.player.y
                )
            );


        // =================================
        // ENVIAR POSIÇÃO AO SERVIDOR
        // =================================

        socket.emit(
            "playerMove",
            {
                x: this.player.x,
                y: this.player.y
            }
        );


        // =================================
        // CÂMERA
        // =================================

        this.camera.x =
            this.player.x -
            (
                this.canvas.width /
                this.zoom
            ) / 2 +
            this.player.width / 2;


        this.camera.y =
            this.player.y -
            (
                this.canvas.height /
                this.zoom
            ) / 2 +
            this.player.height / 2;


        // =================================
        // LIMITES DA CÂMERA
        // =================================

        this.camera.x =
            Math.max(
                0,
                Math.min(
                    this.worldWidth -
                    this.canvas.width /
                    this.zoom,
                    this.camera.x
                )
            );


        this.camera.y =
            Math.max(
                0,
                Math.min(
                    this.worldHeight -
                    this.canvas.height /
                    this.zoom,
                    this.camera.y
                )
            );
        
        this.checkInteraction();
    }


    // =====================================
    // DESENHAR MAPA
    // =====================================

drawMap() {

    this.map.draw(
        this.ctx,
        this.camera
    );

    const ctx = this.ctx;

    const treeX = 600;
    const treeY = 300;

    // Tronco
    ctx.fillStyle = "#795548";

    ctx.fillRect(
        treeX - this.camera.x + 18,
        treeY - this.camera.y + 30,
        14,
        30
    );

    // Copa
    ctx.fillStyle = "#27ae60";

    ctx.beginPath();

    ctx.arc(
        treeX - this.camera.x + 25,
        treeY - this.camera.y + 25,
        25,
        0,
        Math.PI * 2
    );

    ctx.fill();
}

    // =====================================
    // DESENHAR OBSTÁCULO
    // =====================================

    drawObstacle(
        x,
        y,
        width,
        height
    ) {

        const ctx =
            this.ctx;


        ctx.fillStyle =
            "#1b252f";


        ctx.fillRect(
            x - this.camera.x,
            y - this.camera.y,
            width,
            height
        );
    }


    // =====================================
    // DESENHAR TUDO
    // =====================================

    draw() {

        this.ctx.save();


        // Aplicar zoom

        this.ctx.scale(
            this.zoom,
            this.zoom
        );


        // =================================
        // MAPA
        // =================================

        this.drawMap();


        // =================================
        // OUTROS JOGADORES
        // =================================

        for (
            const id in this.otherPlayers
        ) {

            this.otherPlayers[id].draw(
                this.ctx,
                this.camera
            );
        }


        // =================================
        // NOSSO JOGADOR
        // =================================

        this.player.draw(
            this.ctx,
            this.camera
        );


        // =================================
        // RESTAURAR CANVAS
        // =================================

        this.ctx.restore();
    }


    // =====================================
    // LOOP PRINCIPAL
    // =====================================

    loop() {

        this.update();

        this.draw();


        requestAnimationFrame(
            () => {

                this.loop();

            }
        );
    }
}