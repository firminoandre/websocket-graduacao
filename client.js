const WebSocket = require("ws");
const readline = require("readline");

const cliInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const websocketInstance = new WebSocket("ws://192.168.100.6:8080");

let username = "";

websocketInstance.on("open", () => {
		cliInterface.question("Digite seu username: ", (name) => {
        username = name;
        console.log(`Bem-vindo, ${username}! Agora você pode enviar mensagens.`);

        cliInterface.on("line", (message) => {
					websocketInstance.send(JSON.stringify({ username, message }));
        });
    });
});

websocketInstance.on("message", (data) => {
    try {
        const parsedData = JSON.parse(data);
        if (parsedData.type === "message") {
            console.log(`${parsedData.username}: ${parsedData.text}`);
        }
    } catch (error) {
        console.error("Erro ao processar a mensagem:", error);
    }
});
