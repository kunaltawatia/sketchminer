import axios from 'axios';

const client = axios.create({
	baseURL:
		process.env.NODE_ENV === 'development'
			? 'http://127.0.0.1:5000/api'
			: '/api',
});

interface DenoisingConfiguration {
	h: number;
	templateWindowSize: number;
	searchWindowSize: number;
}

interface ThresholdingConfiguration {
	blockSize: number;
	C: number;
}

export interface ImageProcessingConfiguration {
	denoisingConfiguration: DenoisingConfiguration;
	thresholdingConfiguration: ThresholdingConfiguration;
	sketchGrayscaleValue: number;
	transparent_sketch: boolean;
}

interface ImageProcessingResponse {
	denoised_image: string;
	sketch_image: string;
	configuration: ImageProcessingConfiguration;
}

export async function processImage(
	imageDataUrl: string,
	configuration: ImageProcessingConfiguration,
) {
	const response = await client.post<ImageProcessingResponse>('/process', {
		image: imageDataUrl,
		configuration,
	});

	const {
		denoised_image,
		sketch_image,
		configuration: responseConfiguration,
	} = response.data;
	return {
		denoisedImageDataUrl: denoised_image,
		sketchImageDataUrl: sketch_image,
		configuration: responseConfiguration,
	};
}
