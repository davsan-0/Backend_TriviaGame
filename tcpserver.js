var net = require('net');

//startServer(8052);

function startServer(port) {
	// Keep track of the chat clients
	var clients = [];
	// Start a TCP Server
	net.createServer(function (socket) {

	  // Identify this client
	  //socket.name = socket.remoteAddress + ":" + socket.remotePort;

	  // Inform client of all other players
	  clients.forEach(function (client) {
	  	socket.write("")
	  });

	  // Put this new client in the list
	  clients.push(socket);

	  // Send a nice welcome message and announce
	  //socket.write("Welcome " + socket.name + "\n");
	  //var obj = { cmd: "playerjoined", val: socket.name };
	  //broadcast(JSON.stringify(obj));

	  // Handle incoming messages from clients.
	  socket.on('data', function (data) {
		var dataStr = data.toString();
		var obj = JSON.parse(dataStr);

		var cmd = obj.cmd;
		if (cmd) {
			var val = obj.val;

			switch(cmd) {
				case "name":
					socket.name = val;
					broadcast(dataStr, socket);
					break;
				case "answer":
					broadcast(dataStr, socket);
					break;
				case "questionid":
					broadcast(dataStr, socket);
					break;
				default:
					console.log("Unknown command: " + cmd);
			}
		}
	    //broadcast(socket.name + "> " + data, socket);
	  });

	  // Remove the client from the list when it leaves
	  socket.on('end', function () {
	    clients.splice(clients.indexOf(socket), 1);
	    var obj = { cmd: "playerleft", val: socket.name };
	  	broadcast(JSON.stringify(obj));
	  });
	  
	  // Send a message to all clients
	  function broadcast(message, sender) {
	    clients.forEach(function (client) {
	      // Don't want to send it to sender
	      //if (client === sender) return;
	      client.write(message);
	    });
	    // Log it to the server output too
	    process.stdout.write(message + "\n");
	  }

	}).listen(port);
	console.log("Game server running at port " + port + "\n");
}

module.exports.startServer = startServer;
