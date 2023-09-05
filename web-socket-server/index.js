const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log("Server started on port 8080");
});

const connectionPairs = {};

function setConnection(message) {
  let connected = false;

  // Check if the receiver exists
  wss.clients.forEach((client) => {
    if (client.id === message.receiver) {
      connectionPairs[message.sender] = client.id;
      connectionPairs[client.id] = message.sender;
      client.send(JSON.stringify(message));
      connected = true;
    }
  });

  // Let the sender know if the connection was successful
  wss.clients.forEach((client) => {
    if (client.id === message.sender) {
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
    if (client.id === connectionPairs[message.sender]) {
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
    console.log(message);
    if (message.type === "connect") {
      setConnection(message);
    }
    if (message.type === "field-dimensionsX") {
      sendMessage(message);
    }
    if (message.type === "field-dimensionsY") {
      sendMessage(message);
    }

    if (message.type === "gas_capacity") {
      console.log("Gasolina restante: ", message.data)
    }

    if (message.type === "harvester_speed") {
      console.log("Velocidad de harvester: ", message.data);
    }
    if (message.type === "harvester_number") {
      console.log("Cantidad de harvesters: ", message.data);
    }
    if (message.type === "field-density") {
      console.log("Densidad del harvester: ", message.data);
    }

    if (message.type === "starting_harvester_data") {
      console.log("starting_harvester_data: ", message);

      // Pass the field_matrix data to the Python script here
      const { spawn } = require("child_process");
      const pythonProcess = spawn("python3", ["./calculations/NewHarvester.py", message.startingPoints, message.fieldMatrix]);

      pythonProcess.stdout.on("data", (data) => {
        // Handle the output from the Python script
        const pythonResult = data.toString();
        console.log("Python script result:", pythonResult);

        // Send the result to the React component if needed
        sendDataToReactComponent(pythonResult);
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`Error from Python script: ${data}`);
      });
    }


  });
});

wss.on("listening", () => {
  console.log("Server is listening on port 8080");
})

// In your Node.js server
function sendDataToReactComponent(data) {
  // Send the data to the React component
  const message = {
    type: 'your_message_type', // Customize this
    data: data,
  };
  wss.clients.forEach((client) => {
    if (client.id === 'your_receiver_id') { // Customize this
      client.send(JSON.stringify(message));
    }
  });
}