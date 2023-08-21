const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log("Server started on port 8080");
});

const connectionPairs = {};

function setConnection(message) {
  let connected = false;

  // Check if the receiver exists
  wss.clients.forEach((client) => {
    if(client.id === message.receiver) {
      connectionPairs[message.sender] = client.id;
      connectionPairs[client.id] = message.sender;
      client.send(JSON.stringify(message));
      connected = true;
    }
  });

  // Let the sender know if the connection was successful
  wss.clients.forEach((client) => {
    if(client.id === message.sender) {
      client.send(JSON.stringify({
        type: "connected",
        sender: "server",
        receiver: message.sender,
        data: connected ? "true" : "false"
      }));
    }
  });
}

function sendMessage(message) {
  wss.clients.forEach((client) => {
    if(client.id === connectionPairs[message.sender]) {
      client.send(JSON.stringify(message));
    }
  });
}


wss.on("connection", (connection, req) => {
  connection.id = Math.random().toString(36).substr(2, 9);

  const message = {
    type: "connection_info",
    sender: "server",
    receiver: connection.id,
    data: connection.id
  };

  connection.send(JSON.stringify(message));

  console.log("New connection:", connection.id);


  connection.on("message", (data) => {
    const message = JSON.parse(data);
    if(message.type === "connect") {
      setConnection(message);
    }
    if(message.type === "field-dimensions") {
      sendMessage(message);
    }
  });
});
wss.on("listening", () => {
  console.log("Server is listening on port 8080");
})