from app import create_app
from app.logger import logger
#Create Flask application
app = create_app()

if __name__ == "__main__":
    app.run(port=5000, debug=True)
from app.logger import logger 

logger.info("Flask server started!")
