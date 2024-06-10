console.log("Hello World");
var socket;
var canvas;
var rows;
var columns;
var numPlayers;
var dotPositions = [];
var edgePositions = [];
var selectedEdges = [];
const r = 6;
const spacing = 50;
var x_b = 10;
var y_b = 25;
var hoveredLine;
window.onload=connectSocket;
window.addEventListener("beforeunload", function (e) {
    var confirmationMessage = "\o/";
    (e || window.event).returnValue = confirmationMessage;
    socket.emit("disconnect");
    return confirmationMessage;                            //Webkit, Safari, Chrome
  });


function connectSocket(){
    socket = io({autoconnect:false});
	socket.on("connect",(res)=>{
		rows=res.c;
		columns=res.r;
		numPlayers=res.n;
		createBoard(rows,columns);
		socket.emit("init",rows,columns,numPlayers);
	});
	socket.on("move", (res)=>{selectEdge(res.lineId,res.color);socket.emit("update",res.lineId)});
	socket.on("redirect", (destination) => {window.location.href = destination;});
	socket.on("player", (text) => document.getElementById("player").innerHTML = text);
	socket.on("turn", (text) => document.getElementById("turn").innerHTML = text);
	socket.on("end", (text) => alert(text));
	
}

/*
 * Here our code for the rendering of the board will go. We will also connect to a socket over here to reliably pass inforamtion.
 */
function createBoard(rows,columns){
	x_b = (10 - rows) * 12;
	y_b = (10 - columns) * 12;
	canvas = document.getElementById("canvas");
	canvas.onmousemove = hoverEffect;
	canvas.onclick = clickEdge;
	
	if (!canvas.getContext)
		return;
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	for(let i = 0; i < rows; i++){
		for(let j = 0; j < columns; j++){
			let x_pos = i*spacing+x_b;
			let y_pos = j*spacing+y_b;
			ctx.beginPath();
			ctx.arc(x_pos, y_pos, r, 0, 2 * Math.PI);
			ctx.fill();
			ctx.lineWidth = 1;
			ctx.stroke();
			ctx.lineWidth = 3;
			if(i != rows-1){
				ctx.beginPath();
				ctx.strokeStyle = "grey";
				ctx.moveTo(x_pos,y_pos);
				ctx.lineTo(x_pos + spacing,y_pos);
				ctx.stroke();
				edgePositions.push([x_pos,y_pos,x_pos + spacing,y_pos]);
				selectedEdges.push(0);
			}
			if(j != columns-1){
				ctx.beginPath();
				ctx.strokeStyle = "grey";
				ctx.moveTo(x_pos,y_pos);
				ctx.lineTo(x_pos,y_pos+spacing);
				ctx.stroke();
				edgePositions.push([x_pos,y_pos,x_pos,y_pos + spacing]);
				selectedEdges.push(0);
			}
		}
	}
}


//emptyLine
function emptyLine(x1,y1,x2,y2){
	const ctx = canvas.getContext("2d");
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.strokeStyle = 'white';
	ctx.lineWidth = 3;
	ctx.stroke();
}
  //single colored Line
function drawSingleLine(x1,y1,x2,y2,color){
	const ctx = canvas.getContext("2d");
	if(selectedEdges[hoveredLine] == 1){
		color = "green";
	}
	ctx.beginPath();
	ctx.lineWidth = 3;
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.strokeStyle = color;
	ctx.stroke();
}
function onTheLine(x,y,x1,y1,x2,y2, threshold){
	if(x1==x2 && x < x1 + threshold && x  > x1 - threshold && y > y1 && y <= y2)
		return true;
	if(y1==y2 && y < y1 + threshold && y  > y1 - threshold && x > x1 && x <= x2)
		return true;
	return false;

}
function hoverEffect(e){
	const ctx = canvas.getContext("2d");
	if(hoveredLine==undefined) hoveredLine = -1;
	var x  = e.offsetX;
	var y = e.offsetY;
	//if no line previously hovered search to see if a line is hovered
	for(let i=0; i<edgePositions.length && hoveredLine == -1; i++){
		
		
		if (onTheLine(x,y,edgePositions[i][0],edgePositions[i][1],edgePositions[i][2],edgePositions[i][3],20)){
			hoveredLine = i
		}else{
			hoveredLine = -1
		}
		
		// drawCircles();
	}
	//if a line was hovered or is hovered color it
	if (hoveredLine != -1 && onTheLine(x,y,edgePositions[hoveredLine][0],edgePositions[hoveredLine][1],edgePositions[hoveredLine][2],edgePositions[hoveredLine][3],20)){
		drawSingleLine(edgePositions[hoveredLine][0],edgePositions[hoveredLine][1],edgePositions[hoveredLine][2],edgePositions[hoveredLine][3], 'orange');
	}else if(hoveredLine != -1){
		emptyLine(edgePositions[hoveredLine][0],edgePositions[hoveredLine][1],edgePositions[hoveredLine][2],edgePositions[hoveredLine][3]);
		drawSingleLine(edgePositions[hoveredLine][0],edgePositions[hoveredLine][1],edgePositions[hoveredLine][2],edgePositions[hoveredLine][3], 'grey');
		hoveredLine = -1;
	}
	drawCircles();
}
function drawCircles(){
	const ctx = canvas.getContext("2d");
	ctx.lineWidth = 1;
	ctx.strokeStyle = "black";
	for(let i = 0; i < rows; i++){
		for(let j = 0; j < columns; j++){
			let x_pos = i*spacing + x_b;
			let y_pos = j*spacing + y_b;
			ctx.beginPath();
			ctx.arc(x_pos, y_pos, r, 0, 2 * Math.PI);
			ctx.fillStyle = "black";
			ctx.fill();

			ctx.stroke();
		}
	}
}
function drawRectangle(x,y,color){
	const ctx = canvas.getContext("2d");
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.fillRect(x, y, spacing, spacing);
}
function clickEdge(e){
	if(hoveredLine == -1) return;
	if(selectedEdges[hoveredLine] == 1) return;
	socket.emit("move",hoveredLine);
}
function selectEdge(hoveredLine,color){
	selectedEdges[hoveredLine] = 1;
	x1 = edgePositions[hoveredLine][0];
	y1 = edgePositions[hoveredLine][1];
	x2 = edgePositions[hoveredLine][2];
	y2 = edgePositions[hoveredLine][3];
	let box1 = [];
	let box2 = [];
	for(let i = 0; i < edgePositions.length; i++){
		if(edgePositions[i]==hoveredLine) continue;
		//horizontal or vertical edge
		if(x1 == x2){
			if(edgePositions[i][0] == x1 - spacing && edgePositions[i][1] == y1 && edgePositions[i][2] == x1 && edgePositions[i][3] == y1) box1.push(i);
			if(edgePositions[i][0] == x1 - spacing && edgePositions[i][1] == y1 && edgePositions[i][2] == x1 - spacing && edgePositions[i][3] == y2) box1.push(i);
			if(edgePositions[i][0] == x1 - spacing && edgePositions[i][1] == y2 && edgePositions[i][2] == x1 && edgePositions[i][3] == y2) box1.push(i);

			if(edgePositions[i][0] == x1 && edgePositions[i][1] == y1 && edgePositions[i][2] == x1 + spacing && edgePositions[i][3] == y1) box2.push(i);
			if(edgePositions[i][0] == x1 + spacing && edgePositions[i][1] == y1 && edgePositions[i][2] == x1 + spacing && edgePositions[i][3] == y2) box2.push(i);
			if(edgePositions[i][0] == x1 && edgePositions[i][1] == y2 && edgePositions[i][2] == x1 + spacing && edgePositions[i][3] == y2) box2.push(i);
		}else{
			if(edgePositions[i][0] == x1 && edgePositions[i][1] == y1 - spacing && edgePositions[i][2] == x1 && edgePositions[i][3] == y1) box1.push(i);
			if(edgePositions[i][0] == x1 && edgePositions[i][1] == y1 - spacing && edgePositions[i][2] == x2 && edgePositions[i][3] == y2 - spacing) box1.push(i);
			if(edgePositions[i][0] == x2 && edgePositions[i][1] == y2 - spacing && edgePositions[i][2] == x2 && edgePositions[i][3] == y2) box1.push(i);

			if(edgePositions[i][0] == x1 && edgePositions[i][1] == y1 && edgePositions[i][2] == x1 && edgePositions[i][3] == y1 + spacing) box2.push(i);
			if(edgePositions[i][0] == x1 && edgePositions[i][1] == y1 + spacing && edgePositions[i][2] == x2 && edgePositions[i][3] == y2 + spacing) box2.push(i);
			if(edgePositions[i][0] == x2 && edgePositions[i][1] == y2 && edgePositions[i][2] == x2 && edgePositions[i][3] == y2 + spacing) box2.push(i);
		}

	} 
	let res = true;
	//fill box1
	box1.forEach(element => {
		if(selectedEdges[element] != 1) res = false;
		x1 = Math.min(x1,edgePositions[element][0],edgePositions[element][2]);
		y1 = Math.min(y1,edgePositions[element][1],edgePositions[element][3]);
	});
	if(res && box1.length==3){
		drawRectangle(x1,y1,color)
		box1.forEach(element => drawSingleLine(edgePositions[element][0],edgePositions[element][1],edgePositions[element][2],edgePositions[element][3], 'green'));
	}
	//fill box2
	res = true;
	box2.forEach(element => {
		if(selectedEdges[element] != 1) res = false;
		x2 = Math.min(x2,edgePositions[element][0],edgePositions[element][2]);
		y2 = Math.min(y2,edgePositions[element][1],edgePositions[element][3]);
	});
	if(res && box2.length==3){
		drawRectangle(x2,y2,color)
		box2.forEach(element => drawSingleLine(edgePositions[element][0],edgePositions[element][1],edgePositions[element][2],edgePositions[element][3], 'green'));
	}
	drawSingleLine(edgePositions[hoveredLine][0],edgePositions[hoveredLine][1],edgePositions[hoveredLine][2],edgePositions[hoveredLine][3], 'green');
	drawCircles();
}
