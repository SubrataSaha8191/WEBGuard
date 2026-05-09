import socket
import ssl
import whois
from urllib.parse import urlparse
from datetime import datetime

SUSPICIOUS_TLDS = [
    ".ru",
    ".tk",
    ".xyz",
    ".top",
    ".gq",
    ".ml",
    ".cf",
    ".work",
    ".support"
]

PHISHING_KEYWORDS = [
    "login",
    "verify",
    "secure",
    "update",
    "account",
    "bank",
    "paypal",
    "signin",
    "security",
    "confirm",
    "wallet",
    "crypto",
    "free",
    "bonus"
]


def get_domain(url):
    parsed = urlparse(url)
    return parsed.netloc.lower()


def check_suspicious_tld(domain):
    for tld in SUSPICIOUS_TLDS:
        if domain.endswith(tld):
            return True
    return False


def keyword_score(url):
    score = 0

    url_lower = url.lower()

    for word in PHISHING_KEYWORDS:
        if word in url_lower:
            score += 1

    return score


def get_domain_age(domain):
    try:
        info = whois.whois(domain)

        creation_date = info.creation_date

        if isinstance(creation_date, list):
            creation_date = creation_date[0]

        if creation_date is None:
            return -1

        age_days = (datetime.now() - creation_date).days

        return age_days

    except Exception:
        return -1


def has_valid_ssl(domain):
    try:
        context = ssl.create_default_context()

        with socket.create_connection((domain, 443), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=domain):
                return True

    except Exception:
        return False


def calculate_threat_score(
    url,
    ml_prediction,
    confidence
):
    domain = get_domain(url)

    score = 0

    # ML model contribution
    if ml_prediction == "phishing":
        score += 50

    score += int(confidence * 0.3)

    # Suspicious TLD
    if check_suspicious_tld(domain):
        score += 15

    # Phishing keywords
    score += keyword_score(url) * 5

    # Domain age
    age = get_domain_age(domain)

    if age != -1:
        if age < 30:
            score += 25

        elif age < 180:
            score += 10

    # SSL validation
    ssl_valid = has_valid_ssl(domain)

    if not ssl_valid:
        score += 20

    return {
        "threat_score": min(score, 100),
        "domain_age_days": age,
        "ssl_valid": ssl_valid,
        "suspicious_tld": check_suspicious_tld(domain),
        "keyword_score": keyword_score(url)
    }