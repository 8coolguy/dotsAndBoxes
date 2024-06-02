console.log("Hello World");
var canvas;
var rows = 10
var columns = 10;
var dotPositions = [];
var edgePositions = [];
var selectedEdges = [];
const r = 6;
const spacing = 50;
window.onload = createBoard(rows,columns);

var hoveredLine;

/*
 * Here our code for the rendering of the board will go. We will also connect to a socket over here to reliably pass inforamtion.
 */
function createBoard(rows,columns){
	canvas = document.getElementById("canvas");
	canvas.onmousemove = hoverEffect;
	canvas.onclick = clickEdge;
	
	if (!canvas.getContext)
		return;
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	for(let i = 0; i < rows; i++){
		for(let j = 0; j < columns; j++){
			let x_pos = i*spacing;
			let y_pos = j*spacing;
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
			let x_pos = i*spacing;
			let y_pos = j*spacing;
			ctx.beginPath();
			ctx.arc(x_pos, y_pos, r, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
		}
	}
}
function clickEdge(e){
	var x  = e.offsetX;
	var y = e.offsetY;
	console.log("fsdjfksdj");
	if(hoveredLine == -1) return;
	selectedEdges[hoveredLine] = 1;
	drawSingleLine(edgePositions[hoveredLine][0],edgePositions[hoveredLine][1],edgePositions[hoveredLine][2],edgePositions[hoveredLine][3], 'green');
	drawCircles();
}
