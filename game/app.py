from flask import Flask ,redirect, render_template, request, session
from Classes.gameObject import Board
from flask_socketio import SocketIO
from flask_session import Session
from flask_socketio import emit,join_room,leave_room

app = Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = 'secret!'
app.config['i'] = 0
Session(app)
socketio = SocketIO(app, cors_allowed_origins="*")

#
# Handle Funciton Connection 
@socketio.on("connect")
def handleConnection():
    # check if all the players are here and start the game
    print("User Connected")

@socketio.on("init")
def handleInit(rows,columns,numPlayers):
    # join a room with all the players the id has to be unique to the room
    room_id = str(request.referrer.split("/")[-1])
    print("Init",room_id)
    join_room(room_id)
    session["board"] = Board(rows,columns,numPlayers)

#
# Change the game state
@socketio.on('update')
def updateBoard(lineId):
    #check if the state is started
    pos = getEdge(lineId,session["board"].rows,session["board"].columns)
    session["board"].move(app.config['i']%session['board'].numPlayers, pos[0], pos[1], pos[2], pos[3])
    if session["board"].checkGameEnd():
        #notify all the players the game is over
        pass

def getEdge(lineId,rows,cols):
    count = 0
    for i in range(rows):
        for j in range(cols):
            if i != rows - 1: 
                if count == lineId:
                    return [j,i,j,i+1]
                count+=1
            if j != cols - 1:
                if count == lineId:
                    return [j,i,j+1,i]
                count+=1
    return [0,0,0,0]

#
# Handle a move message from a player
@socketio.on('move')
def handleMove(lineId):
    app.config['i']+=1
    room_id = str(request.referrer.split("/")[-1])

    emit("move",{"lineId":lineId,"color":["orange","purple"][app.config['i']%session["board"].numPlayers]},to=room_id)
#
# Page Routes
#
# Game
@app.route("/<string:room_id>",methods=["GET"])
def index(room_id):
    return render_template("index.html")
#
# Matchmaking
@app.route("/",methods=["GET"])
def matchmaking():
    return render_template("index.html")


