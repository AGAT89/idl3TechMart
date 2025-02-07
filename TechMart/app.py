from flask import Flask
from routes import routes  # Importamos el Blueprint
from db import DB  # Importamos la clase DB

app = Flask(__name__)
db = DB()
conexion = db.obtener_conexion()

app.register_blueprint(routes)  # Registra las rutas del Blueprint

if __name__ == '__main__':
    app.run(debug=True)