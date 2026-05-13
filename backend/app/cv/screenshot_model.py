import cv2
import numpy as np

# DETECT CENTER LOGIN-LIKE CARD

def detect_center_form(image):
    gray = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)
    height, width = gray.shape

    center_region = gray[
        height // 3: height * 2 // 3,
        width // 3: width * 2 // 3
    ]

    brightness = np.mean(center_region)

    return brightness > 110


# DETECT DARK BACKGROUND

def detect_dark_theme(image):
    gray = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)
    brightness = np.mean(gray)

    return brightness < 90


# DETECT RED WARNING COLORS

def detect_red_warning(image):
    hsv = cv2.cvtColor(image,cv2.COLOR_BGR2HSV)

    # LOWER RED RANGE
    lower_red1 = np.array([0, 120, 70])
    upper_red1 = np.array([10, 255, 255])

    # UPPER RED RANGE
    lower_red2 = np.array([170, 120, 70])
    upper_red2 = np.array([180, 255, 255])

    mask1 = cv2.inRange(hsv,lower_red1,upper_red1)
    mask2 = cv2.inRange(hsv,lower_red2,upper_red2)

    red_mask = mask1 + mask2
    red_pixels = np.sum(red_mask > 0)

    total_pixels = (image.shape[0] * image.shape[1])
    red_ratio = (red_pixels / total_pixels)

    return red_ratio > 0.15


# MAIN VISUAL ANALYSIS

def analyze_visual_risk(image):

    risk_score = 0
    reasons = []

    # CENTERED FORM
    centered_form = detect_center_form(image)

    if centered_form:
        risk_score += 20
        reasons.append("Centered login-like form")

    # DARK THEME
    dark_theme = detect_dark_theme(image)

    if dark_theme:
        risk_score += 5
        reasons.append("Dark themed interface")

    # RED WARNING COLORS

    red_warning = detect_red_warning(image)

    if red_warning:
        risk_score += 15
        reasons.append("Large amount of red colors")

    # FINAL DECISION
    visual_threat = (risk_score >= 70)

    # SAFE DEFAULT

    if len(reasons) == 0:
        reasons.append("No suspicious visual traits")

    return {
        "visual_threat":visual_threat,
        "risk_score":round(risk_score,2),
        "reason": reasons
    }