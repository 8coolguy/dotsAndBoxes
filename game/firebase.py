import os
import pyrebase

config={
  "apiKey": os.getenv("APIKEY"),
  "authDomain": os.getenv("AUTH"),
  "databaseURL": os.getenv("DB"),
  "storageBucket": os.getenv("STORE")
}
#initialize firebase
firebase = pyrebase.initialize_app(config)
db = firebase.database()