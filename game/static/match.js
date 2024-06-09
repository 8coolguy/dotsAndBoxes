var socket;

window.onload=connectSocket;

function connectSocket(){
    socket = io({autoconnect:false});
	socket.emit("autoid");
    socket.on("autoid",(res)=> console.log(res));
}