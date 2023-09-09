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

    // Handle different message types
    if (message.type === "connect") {
      setConnection(message);
    }
    if (message.type === "config_field-dimensionsX" || message.type === "config_field-dimensionsY" || message.type === "config_gas_capacity" || message.type === "config_harvester_speed" || message.type === "config_harvester_number" || message.type === "config_field-density") {
      sendMessage(message);
    }
    if (message.type === "gas_capacity") {
      sendDataToReactComponent2(message.data, message.sender);
    }
    if (message.type === "harvester_capacity") {
      sendDataToReactComponent(message.data, message.sender);
    }

    // Handle additional message types as needed...


    if (message.type === "harvester_unload_request") {
      console.log("harvester_unload_request: ", message);
      // Pass the field_matrix data to the Python script here
      const { spawn } = require("child_process");
      // const pythonProcess = spawn("C:\\Users\\Arturo\\AppData\\Local\\Programs\\Python\\Python311\\python.exe", ["./calculations/Truck.py", message.harvesterId, message.finalPos, message.fieldMatrix, message.trucksInitialPos, message.trucksIds]);
      const pythonProcess = spawn("python3", ["./calculations/Truck.py", message.harvesterId, message.finalPos, message.fieldMatrix, message.trucksInitialPos, message.trucksIds]);

      pythonProcess.stdout.on("data", (data) => {
        // Handle the output from the Python script
        const pythonResult = data.toString();
        console.log("Python script result:", pythonResult);

        // Send the result to the React component if needed
        sendDataToReactComponent(pythonResult);

        const message = {
          type: "truck_python",
          sender: "server",
          receiver: connection.id,
          data: pythonResult
        };

        connection.send(JSON.stringify(message));

      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`Error from Python script: ${data}`);
      });

    }


    if (message.type === "starting_harvester_data") {
      console.log("starting_harvester_data: ", message);

      let pythonScript;
      const startingPointsArray = JSON.parse(message.startingPoints);
      if (startingPointsArray[1] === "[") { // es un string, si inica con doble corchete es una matriz
        console.log("soy una matriz");
        pythonScript = "./calculations/test.py";
      } else { // 1 harvester
        pythonScript = "./calculations/Harvester1.py";
      }


      // Pass the field_matrix data to the Python script here
      const { spawn } = require("child_process");
      // const pythonProcess = spawn("C:\\Users\\Arturo\\AppData\\Local\\Programs\\Python\\Python311\\python.exe", [pythonScript, message.startingPoints, message.fieldMatrix, message.harvesterId]);
      const pythonProcess = spawn("python3", [pythonScript, message.startingPoints, message.fieldMatrix, message.harvesterId]);

      pythonProcess.stdout.on("data", (data) => {
        // Handle the output from the Python script
        const pythonResult = data.toString();
        console.log("Calculate harvester paths result:", pythonResult);

        // Send the result to the React component if needed
        sendDataToReactComponent(pythonResult);

        const message = {
          type: "python_harvester",
          sender: "server",
          receiver: connection.id,
          data: pythonResult
        };

        connection.send(JSON.stringify(message));
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`Error from Python script: ${data}`);
      });
    }

    if (message.type === "harvester_unload_request") {
      console.log("harvester_unload_request: ", message);
      // Pass the field_matrix data to the Python script here
      const { spawn } = require("child_process");
      // const pythonProcess = spawn("C:\\Users\\Arturo\\AppData\\Local\\Programs\\Python\\Python311\\python.exe", ["./calculations/Truck.py", message.harvesterId, message.finalPos, message.fieldMatrix, message.trucksInitialPos, message.trucksIds]);
      const pythonProcess = spawn("python3", ["./calculations/Truck.py", message.harvesterId, message.finalPos, message.fieldMatrix, message.trucksInitialPos, message.trucksIds]);

      pythonProcess.stdout.on("data", (data) => {
        // Handle the output from the Python script
        const pythonResult = data.toString();
        console.log("Python script result:", pythonResult);

        // Send the result to the React component if needed
        sendDataToReactComponent(pythonResult);

        const message = {
          type: "truck_python",
          sender: "server",
          receiver: connection.id,
          data: pythonResult
        };

        connection.send(JSON.stringify(message));

      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`Error from Python script: ${data}`);
      });

    }

    if (message.type === "send-truck-to-silos") {
      console.log("send-truck-to-silos: ", message);

      const { spawn } = require("child_process");
      // const pythonProcess = spawn("C:\\Users\\Arturo\\AppData\\Local\\Programs\\Python\\Python311\\python.exe", ["./calculations/TruckToSilos.py", message.finalPos, message.fieldMatrix, message.truckInitialPos, message.truckId]);
      const pythonProcess = spawn("python3", ["./calculations/TruckToSilos.py", message.finalPos, message.fieldMatrix, message.truckInitialPos, message.truckId]);

      pythonProcess.stdout.on("data", (data) => {
        const pythonResult = data.toString();
        console.log("Truck To Silos result:", pythonResult);

        const message = {
          type: "truck_to_silos",
          sender: "server",
          receiver: connection.id,
          data: pythonResult
        };

        connection.send(JSON.stringify(message));
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`Error from Python script: ${data}`);
      });
    }

  });
});

wss.on("listening", () => {
  console.log("Server is listening on port 8080");
});

// Functions to send data to React components or Unity
function sendDataToReactComponent(data, senderId) {
  // Send the data to the React component
  const message = {
    type: 'harvester_capacity', // Customize this
    data: data,
  };
  wss.clients.forEach((client) => {
    if (client.id === senderId) { // Customize this
      client.send(JSON.stringify(message));
    }
  });
}

function sendDataToReactComponent2(data, senderId) {
  // Send the data to the React component
  const message = {
    type: 'gas_capacity', // Customize this
    data: data,
  };
  wss.clients.forEach((client) => {
    if (client.id === senderId) { // Customize this
      client.send(JSON.stringify(message));
    }
  });
}

// Function to send Python results to Unity
function sendPythonResultToUnity(pythonResult, senderId) {
  // Create a message with the Python result
  const message = {
    type: 'python_harvester', // You can customize this message type
    data: pythonResult,
  };

  // Send the message to the client with the specified senderId
  wss.clients.forEach((client) => {
    if (client.id === senderId) {
      client.send(JSON.stringify(message));
    }
  });
}
