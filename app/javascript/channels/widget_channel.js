import consumer from "./consumer"

consumer.subscriptions.create("WidgetChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    // Called when there's incoming data on the websocket for this channel
      alert(`incoming data, ${data}`);
  }
});

function WebSocketTest() {

           if ("WebSocket" in window) {
              alert("WebSocket is supported by your Browser!");

              // Let us open a web socket
              let ws = new WebSocket('wss://weball.com.au/cable');

              ws.onopen = function(){
                //Subscribe to the channel
                ws.send(JSON.stringify({"command": "subscribe","identifier":"{\"channel\":\"WidgetChannel\"}"}));
                alert("ws is open...");
              }

              ws.onmessage = function(msg) {
                  console.log(msg);
                  alert(`Message is received...`);
              }

              ws.onclose = function() {
                 // websocket is closed.
                 alert("Connection is closed...");
              };
           } else {

              // The browser doesn't support WebSocket
              alert("WebSocket NOT supported by your Browser!");
           }
}
