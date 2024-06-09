var socket;

window.onload=connectSocket;
window.addEventListener("beforeunload", function (e) {
    var confirmationMessage = "\o/";
    (e || window.event).returnValue = confirmationMessage;
    socket.emit("disconnect");
    return confirmationMessage;                            //Webkit, Safari, Chrome
  });

function connectSocket(){
    socket = io({autoconnect:false});
	socket.emit("autoid");
    socket.on("redirect", (destination) => {window.location.href = destination;});
}
function findGame(){
    let setting = 100*document.getElementById("r-select").value + 10*document.getElementById("c-select").value + 1*document.getElementById("n-select").value;
    console.log(setting);
    socket.emit("queue",setting);
}