import urllib3

#Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

#Elasticsearch Config
ES_HOST = "https://5.75.227.63:9200"
ES_USER = "elastic"
ES_PASSWORD = "rQQtbktwzFqAJS1h8YjP"
ES_INDEX = "imago"

# Flask Config
FLASK_DEBUG = True
