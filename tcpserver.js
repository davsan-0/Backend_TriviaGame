var net = require('net');

startServer(8052);

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
	  broadcast(socket.name + " joined the chat\n", socket);

	  // Handle incoming messages from clients.
	  socket.on('data', function (data) {
	  	// Accepts anything written like #command# where "command" should be replaced with a command
		var cmd_pattern = /^#[A-z]+#/;

		var dataStr = data.toString();

		// Extracts the command
		var cmd = dataStr.match(cmd_pattern);

		if (cmd) {
			cmdStr = cmd[0];

			// Extract everything after the command
			var val = dataStr.substr(cmdStr.length);

			switch(cmdStr) {
				case "#name#":
					socket.name = val;
					broadcast("#newplayer#" + socket.name, socket);
					break;
				case "#answer#":
					broadcast("#answer#" + val, socket);
					break;
				case "#questionid#":
					broadcast("#questionid#" + val, socket);
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
	    broadcast("#playerleft#" + socket.name);
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

module.exports = startServer;
