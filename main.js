const WebSocket = require("ws");
const wss = new WebSocket.Server({
    host: "0.0.0.0",
    port: 8080
});
last_id = 0;
lobby = [];

const interval = setInterval(function ping() {
    wss.clients.forEach(client => {
        client.send("ping")
    });
}, 3000);

wss.on("connection", (ws, req, client) => {
    console.log(req.connection.remoteAddress + " kinda vibed onto the server");
    lobby.push(ws);
    console.log("lobby length: " + lobby.length);
    if (lobby.length > 1) {
        let player_one = lobby[0];
        let player_two = lobby[1];
        player_one.send(JSON.stringify({
            info: "opponent_connected",
            id: 1
        }));
        player_two.send(JSON.stringify({
            info: "opponent_connected",
            id: 2
        }));
        player_one.on("message", msg => player_two.send(msg));
        player_two.on("message", msg => player_one.send(msg));
        lobby.shift();
        lobby.shift();
        console.log(`${req.connection.remoteAddress} matched`);
        console.log("lobby length: " + lobby.length);
    }
    ws.on("close", () => {
        console.log(req.connection.remoteAddress + " disconnected");
        lobby.splice(lobby.indexOf(ws), 1);
        console.log("lobby length: " + lobby.length);
    })
});