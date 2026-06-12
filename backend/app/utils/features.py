from urllib.parse import urlparse
import re
import tldextract
import math
from collections import Counter

SUSPICIOUS_WORDS = [
    "login",
    "verify",
    "secure",
    "account",
    "bank",
    "update",
    "signin",
    "password",
    "confirm"
]

def calculate_entropy(text):
    counter = Counter(text)
    length = len(text)
    entropy = 0

    for count in counter.values():
        probability = count / length
        entropy -= probability * math.log2(probability)
    return round(entropy, 3)

def extract_features(url):
    parsed = urlparse(url)
    extracted = tldextract.extract(url)
    domain = extracted.domain
    subdomain = extracted.subdomain

def extract_features(url):
    parsed = urlparse(url)
    extracted = tldextract.extract(url)

    domain = extracted.domain
    subdomain = extracted.subdomain

    features = {
        "url_length": len(url),
        "domain_length": len(domain),
        "subdomain_length": len(subdomain),
        "dot_count": url.count("."),
        "hyphen_count": url.count("-"),
        "slash_count": url.count("/"),
        "question_mark_count": url.count("?"),
        "equal_count": url.count("="),
        "has_ip": 1 if re.match(r"^\d+\.\d+\.\d+\.\d+", parsed.netloc) else 0,
        "digit_count": sum(char.isdigit() for char in url),
        "suspicious_word_count": sum(
            word in url.lower() for word in SUSPICIOUS_WORDS
        ),
        "entropy": calculate_entropy(url)
    }

    return features