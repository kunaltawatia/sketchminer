from flask import Blueprint, request, jsonify

from image_processing import process_image_data_url, ImageProcessingConfiguration

router = Blueprint('router', __name__, url_prefix='/api')


@router.route('/process', methods=['POST'])
def process():
    request_data = request.get_json()
    image_data_url = request_data['image']
    image_processing_configuration = ImageProcessingConfiguration(
        **request_data['configuration']
    )

    denoised_image_data_url, transparent_image_data_url = process_image_data_url(
        image_data_url,
        image_processing_configuration
    )

    return jsonify({
        "denoised_image": denoised_image_data_url,
        "sketch_image": transparent_image_data_url,
        "configuration": image_processing_configuration.model_dump_json(),
    })
