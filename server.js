const WebSocket = require("ws");

const websocketInstance = new WebSocket.Server({ host: "0.0.0.0", port: 8080 });

console.log(`Servidor WebSocket rodando em todas as interfaces na porta 8080`);

function broadcast(data) {
		websocketInstance.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

websocketInstance.on("connection", (websocketCallback, requestCallback) => {
		const clientIP = requestCallback.socket.remoteAddress;
    console.log(`Novo cliente conectado: ${clientIP}`);

    websocketCallback.on("message", (message) => {
        try {
            const { username, message: text } = JSON.parse(message.toString());
            console.log(`${username}: ${text}`);

            broadcast({ type: "message", username, text });
        } catch (error) {
            console.error("Erro ao processar a mensagem:", error);
        }
    });

    websocketCallback.on("close", () => {
			console.log(`Cliente ${clientIP} desconectado.`);
    });
});
