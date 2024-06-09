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
    socket.on("status", (text) => update(text,"status"));
}
function findGame(){
    let setting = 100*document.getElementById("r-select").value + 10*document.getElementById("c-select").value + 1*document.getElementById("n-select").value;
    socket.emit("queue",setting);
}
function quickGame(){
    socket.emit("queue",0);
}
function update(value,ele){
    document.getElementById(ele).innerHTML = value;
}