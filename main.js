console.log("Jogo carregado!");

const socket = io();

window.socket = socket;

let nickname = "";

socket.on("connect", () => {

    console.log(
        "Conectado ao servidor!"
    );

    console.log(
        "ID:",
        socket.id
    );
});


const canvas =
    document.getElementById("gameCanvas");

const loginScreen =
    document.getElementById("loginScreen");

const nicknameInput =
    document.getElementById("nicknameInput");

const playButton =
    document.getElementById("playButton");


let game = null;


playButton.addEventListener(
    "click",
    startGame
);


nicknameInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {
            startGame();
        }
    }
);


function startGame() {

    nickname =
        nicknameInput.value.trim();

    if (nickname === "") {

        nicknameInput.focus();

        return;
    }


    socket.emit(
        "setNickname",
        nickname
    );


    loginScreen.style.display =
        "none";


    window.game = null;

showLobby();

window.socket.emit(
    "requestRooms"
);
}