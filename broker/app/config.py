from pydantic_settings import BaseSettings, SettingsConfigDict

class Config(BaseSettings):
    secret_key: str
    algoritmo: str = "HS256"
    minutos_expiracion: int = 30
    url_ms_vuelos: str = "http://localhost:3001"
    url_ms_pasajeros: str = ""
    url_ms_equipaje: str = ""
    db_host: str = "127.0.0.1"
    db_port: int = 3306
    db_usuario: str = "root"
    db_password: str = ""
    db_name: str = "aeropuerto_broker"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

config = Config()
