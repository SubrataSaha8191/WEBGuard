import base64
import cv2
import numpy as np


def decode_base64_image(data_url):

    # REMOVE HEADER
    header, encoded = data_url.split(
        ",",
        1
    )

    image_data = base64.b64decode(
        encoded
    )

    np_arr = np.frombuffer(
        image_data,
        np.uint8
    )

    image = cv2.imdecode(
        np_arr,
        cv2.IMREAD_COLOR
    )

    return image


def preprocess_image(image):

    resized = cv2.resize(
        image,
        (224, 224)
    )

    normalized = resized / 255.0

    return normalized