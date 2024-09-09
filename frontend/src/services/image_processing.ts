import axios from 'axios';

const client = axios.create({
	baseURL:
		process.env.NODE_ENV === 'development'
			? 'http://127.0.0.1:5000/api'
			: '/api',
});

export async function processImage(imageDataUrl: string) {
	const response = await client.post<{
		denoised_image: string;
		illustration_image: string;
	}>('/process', { image: imageDataUrl });

	const { denoised_image, illustration_image } = response.data;
	return {
		denoisedImageDataUrl: denoised_image,
		sketchImageDataUrl: illustration_image,
	};
}
