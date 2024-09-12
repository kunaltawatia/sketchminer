import numpy as np
import cv2
import base64


def data_url_to_cv2_image(image_data_url: str) -> cv2.typing.MatLike:
    _, base64_data = image_data_url.split(',', 1)

    nparr = np.fromstring(base64.b64decode(base64_data), np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    return image


def cv2_image_to_data_url(image: cv2.typing.MatLike) -> str:
    _, buffer = cv2.imencode('.png', image)
    image_data = base64.b64encode(buffer).decode('utf-8')
    data_url = f'data:image/png;base64,{image_data}'

    return data_url
