

import re

def clean_suchtext(suchtext):
    """Cleans the `suchtext` field by removing structured alphanumeric codes and extra spaces."""
    if not suchtext:
        return "No Description"

    # Remove structured alphanumeric codes like "03C75703", "03D07464", "INH_19067_09692"
    cleaned_text = re.sub(r"\b[A-Z]?\d{2,}[A-Z]?\d*\b", "", suchtext, flags=re.IGNORECASE)

    # Remove patterns like "ING_19071_32964", "IB_54321", "IMAGO_67890", "INH_XXXXXX"
    cleaned_text = re.sub(r"\b(?:ING|IB|INH)_(\w+_?)+\b", "", cleaned_text, flags=re.IGNORECASE)

    # Normalize spaces and remove trailing dots
    cleaned_text = re.sub(r"\s+", " ", cleaned_text.strip().replace(".", ""))

    return cleaned_text