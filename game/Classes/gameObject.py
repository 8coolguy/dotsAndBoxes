import json
class Dot: 
    def __init__(self, row, col) -> None:
        self.row = row
        self.col = col
    def __eq__(self, otherDot: object) -> bool:
        return  self.row == otherDot.row and self.col == otherDot.col
class Edge:
    def __init__(self, dot1: Dot, dot2: Dot) -> None:
        self.dot1 = dot1
        self.dot2 = dot2
        self.clicked = False
    
    def __eq__(self, otherEdge: object) -> bool:
        return (self.dot1 == otherEdge.dot1 and self.dot2 == otherEdge.dot2) or (self.dot1 == otherEdge.dot2 and self.dot2 == otherEdge.dot1)
    
    def isClicked(self):
        return self.clicked
class Box:
    def __init__(self, edge1: Edge, edge2: Edge, edge3: Edge, edge4: Edge) -> None:
        self.topedge = edge1
        self.leftedge = edge2
        self.rightedge = edge3
        self.bottomedge = edge4
        self.ownedPlayer = -1
    def isFilled(self):
        return self.topedge.isClicked() and self.leftedge.isClicked() and self.rightedge.isClicked() and self.bottomedge.isClicked()
    def setOwnedPlayer(self, player):
        self.ownedPlayer = player
    def clickEdge(self, edge: Edge):
        temp = False
        if self.topedge == edge:
            temp = self.topedge.clicked
            self.topedge.clicked = True
        elif self.leftedge == edge:
            temp = self.leftedge.clicked
            self.leftedge.clicked = True
        elif self.rightedge == edge:
            temp = self.rightedge.clicked
            self.rightedge.clicked = True
        elif self.bottomedge == edge:
            temp = self.bottomedge.clicked
            self.bottomedge.clicked = True
        return temp

            

class Board:
    def __init__(self, rows, columns, numPlayers) -> None:
        self.rows = rows
        self.columns = columns
        self.scores = [0 for i in range(numPlayers)]
        self.numPlayers = numPlayers
        self.nextPlayer = 0
        self.boxes = [[Box for j in range(columns-1)] for i in range(rows-1)]
        for i in range(rows-1):
            for j in range(columns-1):
                topedge = Edge(Dot(i,j), Dot(i,j+1))
                leftedge = Edge(Dot(i,j), Dot(i+1,j))
                rightedge = Edge(Dot(i,j+1), Dot(i+1,j+1))
                bottomedge = Edge(Dot(i+1,j), Dot(i+1,j+1))
                self.boxes[i][j] = Box(topedge, leftedge, rightedge, bottomedge)
    
    def move(self, player, row1, col1, row2, col2):
        edgeChosen = Edge(Dot(row1, col1), Dot(row2, col2))
        # only update when it is a new update to the board
        scored = False
        #find all the boxes that have the chosen edge
        for r,rowboxes in enumerate(self.boxes):
            for c,box in enumerate(rowboxes):
                # update the edge and change the score if it is a new move
                alreadyClicked = self.boxes[r][c].clickEdge(edgeChosen)
                if alreadyClicked: continue
                if not alreadyClicked and self.boxes[r][c].isFilled() and self.boxes[r][c].ownedPlayer == -1:
                    self.boxes[r][c].setOwnedPlayer(player)
                    self.scores[player] += 1
                    scored = True
        #update the next eligible player
        if not scored:
            self.nextPlayer = (self.nextPlayer + 1) % self.numPlayers

    def checkGameEnd(self):
        for rowboxes in self.boxes:
            for box in rowboxes:
                if not box.isFilled():
                    return False
        return True
