const chatForm =
    document.getElementById("chatForm");

const chatInput =
    document.getElementById("chatInput");

const messages =
    document.getElementById("messages");


// Enviar mensagem
chatForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        const message =
            chatInput.value.trim();

        if (message === "") {
            return;
        }

        socket.emit(
            "chatMessage",
            message
        );

        chatInput.value = "";

        chatInput.focus();
    }
);


// Receber mensagem
socket.on(
    "chatMessage",
    (data) => {

        const name =
            data.id === socket.id
                ? "Você"
                : "Jogador";

        addMessage(
            name,
            data.message
        );
    }
);


function addMessage(
    name,
    message
) {

    const messageElement =
        document.createElement("div");

    messageElement.textContent =
        `${name}: ${message}`;

    messages.appendChild(
        messageElement
    );

    messages.scrollTop =
        messages.scrollHeight;
}