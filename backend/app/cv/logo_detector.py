import cv2


SUSPICIOUS_BRANDS = [
    "paypal",
    "google",
    "microsoft",
    "facebook",
    "instagram",
    "bank",
    "apple"
]


def detect_brand_impersonation(url):

    url = url.lower()

    detected = []

    for brand in SUSPICIOUS_BRANDS:

        if brand in url:
            detected.append(brand)

    return detected