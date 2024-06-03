from flask import Flask ,redirect,render_template, session
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
    # join a room with all the players
    join_room(1)

#
# Handle a move message from a player
@socketio.on('move')
def handleMove(lineId):
    app.config['i']+=1
    emit("moveAccept",{"lineId":lineId,"color":["orange","purple"][app.config['i']%2]},to=1)



@app.route("/",methods=["GET"])
def index():
    return render_template("index.html")


