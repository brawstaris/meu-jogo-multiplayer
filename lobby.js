const lobbyScreen =
    document.getElementById("lobbyScreen");

const createRoomButton =
    document.getElementById(
        "createRoomButton"
    );

const roomsList =
    document.getElementById("roomsList");


createRoomButton.addEventListener(
    "click",
    () => {

        window.socket.emit(
            "createRoom"
        );
    }
);


window.socket.on(
    "rooms",
    (rooms) => {

        roomsList.innerHTML = "";

        for (const room of rooms) {

            const roomElement =
                document.createElement("div");

            roomElement.className =
                "room";

            roomElement.innerHTML = `
                <span>
                    Sala ${room.id}
                    (${room.players}/10)
                </span>

                <button>
                    ENTRAR
                </button>
            `;

            const button =
                roomElement.querySelector(
                    "button"
                );

            button.addEventListener(
                "click",
                () => {

                    window.socket.emit(
                        "joinRoom",
                        room.id
                    );
                }
            );

            roomsList.appendChild(
                roomElement
            );
        }
    }
);


window.socket.on(
    "roomCreated",
    (roomId) => {

        console.log(
            "Sala criada:",
            roomId
        );

        enterGame();
    }
);


window.socket.on(
    "roomJoined",
    (roomId) => {

        console.log(
            "Entrou na sala:",
            roomId
        );

        enterGame();
    }
);


function showLobby() {

    lobbyScreen.style.display =
        "flex";
}


function enterGame() {

    lobbyScreen.style.display =
        "none";

    if (!window.game) {

        window.game =
            new Game(
                document.getElementById(
                    "gameCanvas"
                )
            );
    }
}