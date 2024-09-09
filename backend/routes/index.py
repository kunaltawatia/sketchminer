from flask import Blueprint, request, jsonify

from image_processing import process_image_data_url

router = Blueprint('router', __name__, url_prefix='/api')


@router.route('/process', methods=['POST'])
def process():
    request_data = request.get_json()
    image_data_url = request_data['image']

    denoised_image_data_url, transparent_image_data_url = process_image_data_url(
        image_data_url
    )

    return jsonify({
        "denoised_image": denoised_image_data_url,
        "illustration_image": transparent_image_data_url
    })
