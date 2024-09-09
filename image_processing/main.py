import os
import cv2
import argparse
import sys

from .processor import process_image


def main(image_path, output_path):
    img = cv2.imread(image_path)

    if img is None:
        print(f'Error: Unable to load image at {image_path}')
        return

    processed_img = process_image(img)

    cv2.imwrite(output_path, processed_img)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Process an image.')
    parser.add_argument('--image_path', type=str,
                        help='Path to the image file')
    parser.add_argument('--output_path', type=str,
                        default="output.png", help='Path to the output destination')

    args = parser.parse_args()

    image_path = args.image_path

    if not os.path.exists(image_path):
        print(f'Error: Unable to locate the file at {image_path}')
        sys.exit(1)

    main(args.image_path, args.output_path)
