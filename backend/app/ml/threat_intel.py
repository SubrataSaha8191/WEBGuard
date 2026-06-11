import socket
import ssl
import whois
import tldextract
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
    "signin",
    "security",
    "confirm",
    "wallet",
    "crypto",
    "free",
    "bonus",
    "password"
]

BRAND_KEYWORDS = [
    "paypal",
    "amazon",
    "apple",
    "microsoft",
    "google",
    "netflix"
]

SAFE_TRAINING_DOMAINS = [
    "google-gruyere.appspot.com",
    "portswigger.net",
    "portswigger-labs.net",
    "owasp.org"
]

KNOWN_SAFE_DOMAINS = [
    "google.com",
    "github.com",
    "stackoverflow.com",
    "leetcode.com",
    "zerodha.com"
]


def get_domain(url):
    parsed = urlparse(url)
    return parsed.netloc.lower()


def get_registered_domain(url):
    extracted = tldextract.extract(url)

    if extracted.suffix:
        return f"{extracted.domain}.{extracted.suffix}".lower()

    return extracted.domain.lower()


def is_safe_training_page(url):
    netloc = get_domain(url)
    return netloc in SAFE_TRAINING_DOMAINS


def is_known_safe_domain(url):
    return get_registered_domain(url) in KNOWN_SAFE_DOMAINS


def check_suspicious_tld(domain):
    for tld in SUSPICIOUS_TLDS:
        if domain.endswith(tld):
            return True
    return False


def keyword_score(url):
    url_lower = url.lower()
    registered_domain = get_registered_domain(url)

    action_score = sum(
        1 for word in PHISHING_KEYWORDS
        if word in url_lower
    )

    brand_score = sum(
        1 for word in BRAND_KEYWORDS
        if word in url_lower and word not in registered_domain
    )

    return action_score, brand_score


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
    parsed = urlparse(url)
    domain = get_domain(url)
    has_https = parsed.scheme.lower() == "https"

    score = 0

    # ML model contribution
    if ml_prediction == "phishing":
        score += 50

    score += int(confidence * 0.3)

    age = get_domain_age(domain)

    # Known safe / training domains override
    if is_known_safe_domain(url) or is_safe_training_page(url):
        ssl_valid = has_valid_ssl(domain)

        return {
            "threat_score": 0,
            "domain_age_days": age,
            "ssl_valid": ssl_valid,
            "suspicious_tld": False,
            "keyword_score": 0,
            "has_https": parsed.scheme.lower() == "https"
        }

    # Suspicious TLD
    is_suspicious_tld = check_suspicious_tld(domain)
    if is_suspicious_tld:
        score += 15

    # Phishing keywords
    action_score, brand_score = keyword_score(url)
    score += action_score * 15
    score += brand_score * 5

    # Strict rule: high keywords + suspicious TLD
    if action_score >= 2 and is_suspicious_tld:
        score += 40

    # Domain age
    age = get_domain_age(domain)

    if age != -1:
        if age < 30:
            score += 25

        elif age < 180:
            score += 10

    # SSL / protocol scoring
    ssl_valid = has_valid_ssl(domain)

    total_keyword_score = action_score + brand_score

    if not has_https:
        if ssl_valid:
            score += 5 if (total_keyword_score > 0 or is_suspicious_tld) else 2
        else:
            score += 20
    else:
        if total_keyword_score == 0 and not is_suspicious_tld:
            score = max(score - 5, 0)

    return {
        "threat_score": min(score, 100),
        "domain_age_days": age,
        "ssl_valid": ssl_valid,
        "suspicious_tld": is_suspicious_tld,
        "keyword_score": total_keyword_score,
        "has_https": has_https,
    }