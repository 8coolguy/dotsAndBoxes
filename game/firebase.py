import os
import pyrebase

config={
  "apiKey": os.getenv("APIKEY"),
  "authDomain": os.getenv("AUTH"),
  "databaseURL": os.getenv("databaseURL"),
  "storageBucket": os.getenv("storageBucket")
}
#initialize firebase
firebase = pyrebase.initialize_app(config)
db = firebase.database()