const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log("Server started on port 8080");
});


wss.on("connection", (connection, req) => {
  connection.on("message", (data) => {
    if (data.toString().startsWith("unity:id:")) {
      connection.id = data.toString().replace("unity:id:", "");
      console.log("Unity connection ID set:", connection.id);
    }
  });



})
  // ws.on("message", (data) => {
  //   console.log("data received", data);
  //   ws.send("I got the message!");
  // } )

wss.on("listening", () => {
  console.log("Server is listening on port 8080");
})