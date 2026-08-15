const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(
    express.static(
        path.join(__dirname, "../public")
    )
);


// ========================================
// JOGADORES
// ========================================

const players = {};


// ========================================
// SALAS
// ========================================

const rooms = {};

function generateRoomId() {

    return Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase();
}


function getRooms() {

    return Object.keys(rooms).map(
        (id) => {

            return {
                id: id,
                players: rooms[id].length
            };

        }
    );
}


function getPlayersInRoom(roomId) {

    const result = {};

    if (!roomId) {
        return result;
    }

    const room = rooms[roomId];

    if (!room) {
        return result;
    }

    for (const id of room) {

        if (players[id]) {

            result[id] = players[id];

        }
    }

    return result;
}


// ========================================
// CONEXÃO
// ========================================

io.on("connection", (socket) => {

    console.log(
        "Jogador conectado:",
        socket.id
    );


    // ====================================
    // CRIAR JOGADOR
    // ====================================

    players[socket.id] = {

        id: socket.id,

        x: 400,

        y: 300,

        nickname: "Jogador",

        roomId: null

    };


    // ====================================
    // LISTAR SALAS
    // ====================================

    socket.on(
        "requestRooms",
        () => {

            socket.emit(
                "rooms",
                getRooms()
            );

        }
    );


    // ====================================
    // CRIAR SALA
    // ====================================

    socket.on(
        "createRoom",
        () => {

            const roomId =
                generateRoomId();


            rooms[roomId] = [];


            rooms[roomId].push(
                socket.id
            );


            socket.join(roomId);


            socket.roomId =
                roomId;


            players[socket.id].roomId =
                roomId;


            console.log(
                "Sala criada:",
                roomId
            );


            // Envia os jogadores
            // daquela sala

            socket.emit(
                "players",
                getPlayersInRoom(roomId)
            );


            socket.emit(
                "roomCreated",
                roomId
            );


            io.emit(
                "rooms",
                getRooms()
            );

        }
    );


    // ====================================
    // ENTRAR EM SALA
    // ====================================

    socket.on(
        "joinRoom",
        (roomId) => {

            const room =
                rooms[roomId];


            if (!room) {

                return;

            }


            if (room.length >= 10) {

                return;

            }


            room.push(
                socket.id
            );


            socket.join(roomId);


            socket.roomId =
                roomId;


            players[socket.id].roomId =
                roomId;


            console.log(
                socket.id,
                "entrou na sala",
                roomId
            );


            // Envia jogadores
            // existentes para quem entrou

            socket.emit(
                "players",
                getPlayersInRoom(roomId)
            );


            // Avisa somente a sala

            socket.to(roomId).emit(
                "playerJoined",
                players[socket.id]
            );


            socket.emit(
                "roomJoined",
                roomId
            );


            io.emit(
                "rooms",
                getRooms()
            );

        }
    );


    // ====================================
    // MOVIMENTO
    // ====================================

    socket.on(
        "playerMove",
        (position) => {

            const player =
                players[socket.id];


            if (!player) {

                return;

            }


            if (!player.roomId) {

                return;

            }


            player.x =
                position.x;

            player.y =
                position.y;


            socket
                .to(player.roomId)
                .emit(
                    "playerMoved",
                    player
                );

        }
    );


    // ====================================
    // CHAT
    // ====================================

    socket.on(
        "chatMessage",
        (message) => {

            const player =
                players[socket.id];


            if (!player) {

                return;

            }


            const text =
                String(message)
                    .trim()
                    .slice(0, 200);


            if (text === "") {

                return;

            }


            // Se estiver em uma sala,
            // envia somente para ela.

            if (player.roomId) {

                io
                    .to(player.roomId)
                    .emit(
                        "chatMessage",
                        {
                            id: socket.id,

                            nickname:
                                player.nickname,

                            message: text
                        }
                    );

            }

        }
    );


    // ====================================
    // NICKNAME
    // ====================================

    socket.on(
        "setNickname",
        (nickname) => {

            const player =
                players[socket.id];


            if (!player) {

                return;

            }


            const name =
                String(nickname)
                    .trim()
                    .slice(0, 16);


            if (name === "") {

                return;

            }


            player.nickname =
                name;


            socket.emit(
                "nicknameSet",
                name
            );


            if (player.roomId) {

                socket
                    .to(player.roomId)
                    .emit(
                        "playerNickname",
                        {
                            id: socket.id,

                            nickname: name
                        }
                    );

            }

        }
    );


    // ====================================
    // DESCONEXÃO
    // ====================================

    socket.on(
        "disconnect",
        () => {

            console.log(
                "Jogador saiu:",
                socket.id
            );


            const player =
                players[socket.id];


            if (
                player &&
                player.roomId
            ) {

                const roomId =
                    player.roomId;


                const room =
                    rooms[roomId];


                if (room) {

                    const index =
                        room.indexOf(
                            socket.id
                        );


                    if (index !== -1) {

                        room.splice(
                            index,
                            1
                        );

                    }


                    socket
                        .to(roomId)
                        .emit(
                            "playerLeft",
                            socket.id
                        );


                    if (
                        room.length === 0
                    ) {

                        delete rooms[
                            roomId
                        ];


                        console.log(
                            "Sala removida:",
                            roomId
                        );

                    }

                }

            }


            delete players[
                socket.id
            ];


            io.emit(
                "rooms",
                getRooms()
            );

        }
    );

});


// ========================================
// SERVIDOR
// ========================================

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {

    console.log(
        `Servidor rodando na porta ${PORT}`
    );

});