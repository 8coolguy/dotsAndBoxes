from Classes.gameObject import Board
import json

board = Board(4,4,2)
print(json.dumps(board.__dict__))
print("Hello")