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
      console.log(`incoming data, ${data}`);
  }
});

function WebSocketTest() {

           if ("WebSocket" in window) {
              alert("WebSocket is supported by your Browser!");

              // Let us open a web socket
              const ws = new WebSocket('wss://api.probit.com/api/exchange/v1/ws');

              ws.onopen = () => {
                const msg = {
                  type: 'subscribe',
                  identifier: '{\"channel\":\"WidgetChannel\"}',
                };
                ws.send(JSON.stringify(msg));
              };

              ws.onmessage = (event) => {
                console.log(event.data);
                alert(event.data);
              };

              ws.onclose = function() {
                 // websocket is closed.
                 alert("Connection is closed...");
              };
           } else {

              // The browser doesn't support WebSocket
              alert("WebSocket NOT supported by your Browser!");
           }
}
