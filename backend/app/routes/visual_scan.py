from fastapi import APIRouter
from pydantic import BaseModel

import cv2
import os
import time
import math

from app.cv.capture_processor import (
    decode_base64_image
)

from app.cv.screenshot_model import (
    analyze_visual_risk
)

router = APIRouter()


class ImagePayload(BaseModel):
    image: str


@router.post("/analyze-visual")
async def analyze_visual(
    payload: ImagePayload
):

    # DECODE IMAGE

    image = decode_base64_image(
        payload.image
    )

    # RUN VISUAL ANALYSIS

    visual_result = analyze_visual_risk(
        image
    )

    # SAFE RISK SCORE

    risk_score = visual_result.get(
        "risk_score",
        0
    )

    # HANDLE NaN / INVALID VALUES

    if (
        risk_score is None or
        isinstance(risk_score, str) or
        math.isnan(float(risk_score))
    ):

        risk_score = 0.0

    # ROUND SCORE

    risk_score = round(
        float(risk_score),
        2
    )

    # DEBUG TERMINAL OUTPUT

    print("\n========== VISUAL SCAN ==========")

    print(
        f"Visual Threat: "
        f"{visual_result.get('visual_threat')}"
    )

    print(
        f"Risk Score: "
        f"{risk_score}"
    )

    print("=================================\n")

    # CREATE DEBUG FOLDER

    timestamp = int(time.time())

    os.makedirs(
        "debug_images",
        exist_ok=True
    )

    debug_path = (
        f"debug_images/"
        f"scan_{timestamp}.png"
    )

    # LABEL

    label = (
        "SUSPICIOUS"
        if visual_result.get(
            "visual_threat"
        )
        else "SAFE"
    )

    # COLOR

    color = (
        (0, 0, 255)
        if visual_result.get(
            "visual_threat"
        )
        else (0, 255, 0)
    )

    # DRAW TEXT ON IMAGE

    cv2.putText(
        image,

        f"{label} | "
        f"Risk: {risk_score}%",

        (30, 50),

        cv2.FONT_HERSHEY_SIMPLEX,

        1,

        color,

        3
    )

    # SAVE DEBUG IMAGE

    cv2.imwrite(
        debug_path,
        image
    )

    print(
        f"Debug image saved: "
        f"{debug_path}"
    )

    # RESPONSE

    return {

        "status":
            "success",

        "prediction":
            "suspicious"
            if visual_result.get(
                "visual_threat"
            )
            else "safe",

        "confidence":
            risk_score,

        "saved_image":
            debug_path
    }