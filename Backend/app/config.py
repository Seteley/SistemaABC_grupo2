import os

DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'dbname': os.getenv('DB_NAME', 'costeoabc'),
    'user': os.getenv('DB_USER', 'seteley'),
    'password': os.getenv('DB_PASSWORD', 'seteley'),
    'port': os.getenv('DB_PORT', '5434')
}
