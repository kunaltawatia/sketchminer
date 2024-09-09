import cv2
import numpy as np

from .converter import data_url_to_cv2_image, cv2_image_to_data_url


def process_image_data_url(image_data_url: str):
    image = data_url_to_cv2_image(image_data_url)

    denoised_image, transparent_image = process_image(image)

    return cv2_image_to_data_url(denoised_image), cv2_image_to_data_url(transparent_image)


def process_image(image: cv2.typing.MatLike):
    gray_image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)

    denoised_image = _denoise_image(gray_image)

    thresholded_image = _threshold_image(denoised_image)

    light_image = _lighten_bw_image(thresholded_image)

    transparent_image = _remove_white_background(light_image)

    return denoised_image, transparent_image


def _denoise_image(image: cv2.typing.MatLike):
    return cv2.fastNlMeansDenoising(image, None, 21, 5, 39)


def _threshold_image(image: cv2.typing.MatLike):
    thresholded_image = cv2.adaptiveThreshold(
        image, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        25, 2
    )

    return thresholded_image


def _remove_white_background(image: cv2.typing.MatLike):
    rgba_image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGBA)

    alpha_mask = np.zeros(image.shape)
    alpha_mask[image < 255] = 255
    rgba_image[..., 3] = alpha_mask

    return rgba_image


def _lighten_bw_image(image: cv2.typing.MatLike, pencil_grayscale_value=31):
    image = image.copy()
    image[image == 0] = pencil_grayscale_value

    return image
