import cv2
import numpy as np

from dataclasses import dataclass
from pydantic import BaseModel, Field

from .translator import data_url_to_cv2_image, cv2_image_to_data_url


class DenoisingConfiguration(BaseModel):
    h: int = 7
    templateWindowSize: int = 9
    searchWindowSize: int = 35


class ThresholdingConfiguration(BaseModel):
    blockSize: int = 25
    C: int = 0


class ImageProcessingConfiguration(BaseModel):
    denoisingConfiguration: DenoisingConfiguration
    thresholdingConfiguration: ThresholdingConfiguration
    sketchGrayscaleValue: int = 31
    transparent_sketch: bool = True


def process_image_data_url(image_data_url: str, image_processing_configuration: ImageProcessingConfiguration):
    image = data_url_to_cv2_image(image_data_url)

    denoised_image, sketch_image = process_image(
        image, image_processing_configuration)

    return cv2_image_to_data_url(denoised_image), cv2_image_to_data_url(sketch_image)


def process_image(image: cv2.typing.MatLike, image_processing_configuration: ImageProcessingConfiguration):
    gray_image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)

    denoised_image = _denoise_image(gray_image,
                                    image_processing_configuration.denoisingConfiguration)

    thresholded_image = _threshold_image(
        denoised_image, image_processing_configuration.thresholdingConfiguration)

    sketch_image = _lighten_bw_image(thresholded_image,
                                     image_processing_configuration.sketchGrayscaleValue)

    if image_processing_configuration.transparent_sketch:
        sketch_image = _remove_white_background(sketch_image)

    return denoised_image, sketch_image


def _denoise_image(image: cv2.typing.MatLike, denoising_configuration: DenoisingConfiguration):
    return cv2.fastNlMeansDenoising(image, h=denoising_configuration.h, templateWindowSize=denoising_configuration.templateWindowSize, searchWindowSize=denoising_configuration.searchWindowSize)


def _threshold_image(image: cv2.typing.MatLike, thresholding_configuration: ThresholdingConfiguration):
    thresholded_image = cv2.adaptiveThreshold(
        image, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        blockSize=thresholding_configuration.blockSize,
        C=thresholding_configuration.C
    )

    return thresholded_image


def _remove_white_background(image: cv2.typing.MatLike):
    rgba_image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGBA)

    alpha_mask = np.zeros(image.shape)
    alpha_mask[image < 255] = 255
    rgba_image[..., 3] = alpha_mask

    return rgba_image


def _lighten_bw_image(image: cv2.typing.MatLike, sketch_grayscale_value: int):
    image = image.copy()
    image[image == 0] = sketch_grayscale_value

    return image
