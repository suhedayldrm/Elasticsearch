from elasticsearch import Elasticsearch
from .config import ES_HOST, ES_USER, ES_PASSWORD, ES_INDEX
import re
from .utils import clean_suchtext


es = Elasticsearch(
    [ES_HOST],
    http_auth=(ES_USER, ES_PASSWORD),
    verify_certs=False,
)



def extract_hit_data(hit):
    """Extracts relevant fields from an Elasticsearch hit and cleans `suchtext`."""
    source = hit.get("_source", {})
    return {
        "bildnummer": source.get("bildnummer", ""),
        "breite": source.get("breite", ""),
        "hoehe": source.get("hoehe", ""),
        "datum": source.get("datum", ""),
        "fotografen": source.get("fotografen", ""),
        "suchtext": clean_suchtext(source.get("suchtext", "")),
    }

def search(query, page=1, page_size=100):
    """Search Elasticsearch for media content based on keywords with pagination."""
    
    es_query = {
        "query": {
            "query_string": {
                "query": query,
                "fields": ["*"]
            }
        },
        "from": (page - 1) * page_size,
        "size": page_size 
    }

    # Send request to Elasticsearch
    response = es.search(index=ES_INDEX, body=es_query)

    # Extract and clean results
    results = [extract_hit_data(hit) for hit in response.get("hits", {}).get("hits", [])]

    return {"total_results": response["hits"]["total"]["value"], "results": results}

