import logging

# Configure logging
logging.basicConfig(
    filename="app.log", 
    level=logging.INFO,  
    format="%(asctime)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)

logger.info("Logger is working! Check your log output.")
