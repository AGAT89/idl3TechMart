from db import DB

db = DB()
conexion = db.obtener_conexion()

class Producto:
    def __init__(self, id, nombre, descripcion, precio, stock):
        self.id = id
        self.nombre = nombre
        self.descripcion = descripcion
        self.precio = precio
        self.stock = stock

    @staticmethod
    def obtener_todos():
        cur = conexion.cursor()
        cur.execute("SELECT * FROM productos")
        productos = cur.fetchall()
        cur.close()
        return productos