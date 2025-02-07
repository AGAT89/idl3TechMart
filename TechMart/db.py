import pymssql

class DB:
    def __init__(self):
        self.server = 'DbTechMart.mssql.somee.com'
        self.database = 'DbTechMart'
        self.username = 'usr_developer'
        self.password = '2025+idl3'

    def obtener_conexion(self):
        try:
            conexion = pymssql.connect(server=self.server, user=self.username, password=self.password, database=self.database)
            return conexion
        except Exception as e:
            print(f'Error al conectar a la base de datos: {e}')
            return None