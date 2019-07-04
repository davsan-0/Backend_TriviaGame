const net = require('net');
const _ = require('lodash');
const uuid = require('uuid/v4');

//startServer(8052);
function startServer(port) {
	// Keep track of the chat clients
	var clients = [];
	// Start a TCP Server
	net.createServer(function (socket) {

	  // Identify this client
	  socket.id = uuid();

	  // Inform client of all other players
	  clients.forEach(function (client) {
	  	socket.write(JSON.stringify({ cmd: "name", val: JSON.stringify({ id: client.id, name: client.name, isMe: false }) }));
	  });

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
			console.log("dataStr = " + dataStr);
			switch(cmd) {
				case "name":
					socket.name = val;
					console.log("socket id = "+ socket.id);
					var newVal = { id: socket.id, name: val };

					clients.forEach(function (client) {
						
						newVal.isMe = (client === socket);

						_.assign(obj, { val: JSON.stringify(newVal) });
						console.log("client - " + client.name);
						console.log("obj = " + JSON.stringify(obj))
				      	client.write(JSON.stringify(obj));
				    });
					break;
				case "answer":
					var newVal = { id: socket.id, answer: val };
					_.assign(obj, { val: JSON.stringify(newVal) });
					broadcast(JSON.stringify(obj), socket);
					break;
				case "question":
					console.log(socket.host + " is host");
					console.log(dataStr);
					broadcast(dataStr, socket);
					break;
				case "startgame":
					broadcast(dataStr, socket);
					break;
				case "revealall":
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
	    var obj = { cmd: "playerleft", val: socket.id };
	  	broadcast(JSON.stringify(obj));
	  });

	  // Set first client as host
	  if (clients.length == 0)
	  {
	  	socket.host = true;
	  }

	  // Put this new client in the list
	  clients.push(socket);
	  
	  // Send a message to all clients
	  function broadcast(message, sender) {
	    clients.forEach(function (client) {
	      // Don't want to send it to sender
	      if (client === sender) return;
	      client.write(message);
	    });
	    // Log it to the server output too
	    process.stdout.write(message + "\n");
	  }

	}).listen(port);
	console.log("Game server running at port " + port + "\n");

	process.on('uncaughtException',function(err){
	   console.log(err)
	});
}

module.exports.startServer = startServer;
