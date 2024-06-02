import json
class Dot: 
    def __init__(self, row, col) -> None:
        self.row = row
        self.col = col
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
        return self.edge1.isClicked() and self.edge2.isClicked() and self.edge3.isClicked() and self.edge4.isClicked()
    def setOwnedPlayer(self, player):
        self.ownedPlayer = player
    def clickEdge(self, edge: Edge):
        if self.topedge == edge:
            self.topedge.clicked = True
        elif self.leftedge == edge:
            self.leftedge.clicked = True
        elif self.rightedge == edge:
            self.rightedge.clicked = True
        elif self.bottomedge == edge:
            self.bottomedge.clicked = True

            

class Board:
    def __init__(self, rows, columns, numPlayers) -> None:
        self.rows = rows
        self.columns = columns
        self.scores = [0 for i in range(numPlayers)]
        #self.arrayofdots = [[Dot(i,j) for j in range(columns)] for i in range(rows)]
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
        for rowboxes in self.boxes:
            for box in rowboxes:
                box.clickEdge(edgeChosen)
                if box.isFilled():
                    box.setOwnedPlayer(player)
                    self.scores[player-1] += 1

    def checkGameEnd(self):
        for rowboxes in self.boxes:
            for box in rowboxes:
                if not box.isFilled():
                    return False
        return True
