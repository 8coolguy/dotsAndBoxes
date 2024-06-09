from flask import Flask ,redirect, render_template, request, session
from Classes.gameObject import Board
from flask_socketio import SocketIO
from flask_session import Session
from flask_socketio import emit,join_room,leave_room
from firebase import db

#Setting encoded into <r,c,n>
DEFAULT = 332 # if a room setting does not exist

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
    room_id = str(request.referrer.split("/")[-1])
    if "?" in room_id: return
    print(room_id)
    setting = db.child("rooms").child(room_id).child("settings").get().val()
    if not setting or setting == 0: setting = DEFAULT
    print(setting)
    emit("connect",{"r":setting//100 % 10,"c":setting//10 % 10,"n":setting % 10})
    print("User Connected")
#
# Handle Funciton Disconnect 
@socketio.on("disconnect")
def handleConnection():
    print("User Disconnected")
    if session.get("uid",False):
        db.child("players").child(session["uid"]).remove()
        return
    room_id = str(request.referrer.split("/")[-1])
    if session.get("playerId",False):
        db.child("rooms").child(room_id).child("players").remove()
#
# Handle Auto Id 
@socketio.on("autoid")
def handleConnection():
    print("Id generated")
    result = db.child("players").push(1)
    session["uid"] = result["name"]
    join_room(result["name"])

@socketio.on("init")
def handleInit(rows,columns,numPlayers):
    # join a room with all the players the id has to be unique to the room

    nextNum = 0
    room_id = str(request.referrer.split("/")[-1])
    players = db.child("rooms").child(room_id).child("players").get().val()
    if players: nextNum = max(players) + 1
    if nextNum == numPlayers: 
        return emit("redirect","/")
    player_id = player_num = nextNum
    db.child("rooms").child(room_id).child("players").child(player_id).set(player_num)
    join_room(room_id)    
    session["playerId"] = player_num
    session["board"] = Board(rows,columns,numPlayers)

#
# Change the game state
@socketio.on('update')
def updateBoard(lineId):
    #check if the state is started
    pos = getEdge(lineId,session["board"].rows,session["board"].columns)
    session["board"].move(session["playerId"], pos[0], pos[1], pos[2], pos[3])
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
    player = session["playerId"]
    # check whether the correct player moved
    if player != session["board"].nextPlayer: return
    room_id = str(request.referrer.split("/")[-1])
    emit("move",{"lineId":lineId,"color":["orange","purple","green","blue","yellow"][session["board"].nextPlayer]},to=room_id)

#
# Add to the queue
#
# Post to
@socketio.on('queue')
def pushQueue(settings):
    #check queue to see if the correct count of players exist yet
    queue = db.child("queue").get().val()
    if not queue: return db.child("queue").child(session["uid"]).set(settings)
    numPlayers = settings % 10
    buffer = []
    for player in queue.keys():
        if queue[player] == 0 or queue[player] == settings and len(buffer) < numPlayers - 1:
            if db.child("players").child(player).get().val():
                buffer.append(player)
            else: db.child("queue").child(player).remove()
    if len(buffer) == numPlayers - 1:
        room_id = db.child("rooms").push({"settings":settings})["name"]
        for player in buffer:
            emit("redirect","/game/"+room_id, to=player)
            db.child("queue").remove(player)
        emit("redirect","/game/"+room_id)
    else:
        db.child("queue").child(session["uid"]).set(settings)
    
#
# Page Routes
#
# Game
@app.route("/game/<string:room_id>",methods=["GET"])
def index(room_id):
    return render_template("index.html")
#
# Matchmaking
@app.route("/",methods=["GET"])
def matchmaking():
    return render_template("home.html")


