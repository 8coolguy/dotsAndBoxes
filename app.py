from flask import Flask ,redirect,render_template,session
from Classes.gameObject import Board

app = Flask(__name__)

@app.route("/",methods=["GET"])
def index():
    return render_template("index.html")

@app.route("/gameMove/<row1>/<col1>/<row2>/<col2>",methods=["GET"])
def gameMove(row1, col1, row2, col2):
    print(row1,col1,row2,col2)
    return render_template("index.html")
