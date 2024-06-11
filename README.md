# Dots and Boxes Multiplayer

How to build project from source:   

```
cd game
pip install -r requirements.txt
```
After installiing the dependencies, you need to create firebase project. Here at https://firebase.google.com/.  Once you have your keys. Execute these commands to set environment variables in your terminal.   
```
export APIKEY="<key>"
export DB="<db url>"
export AUTH="< auth url>"
export STORE="<storage url>"
```
Now, the project is ready to run with:
```
flask run
```
