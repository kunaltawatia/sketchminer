import React, { useState } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { processImage } from './services/image_processing';

function App() {
	const [selectedImageName, setSelectedImageName] = useState<string>();
	const [selectedImageUrl, setSelectedImageUrl] = useState<string>();
	const [denoisedImageDataUrl, setDenoisedImageDataUrl] = useState<string>();
	const [illustrationImageDataUrl, setIllustrationImageDataUrl] =
		useState<string>();

	const handleImageUpload = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0] ?? null;
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				if (typeof reader.result === 'string') {
					setSelectedImageUrl(reader.result);
					setSelectedImageName(file.name);
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async () => {
		if (!selectedImageUrl) return;

		const { denoisedImageDataUrl, illustrationImageDataUrl } =
			await processImage(selectedImageUrl);
		setDenoisedImageDataUrl(denoisedImageDataUrl);
		setIllustrationImageDataUrl(illustrationImageDataUrl);
	};

	return (
		<div className="flex flex-col items-center p-4 space-y-4">
			<h1 className="text-2xl font-bold">Extract Illustrations!</h1>
			<label className="neu-down px-4 py-2 cursor-pointer">
				<input
					type="file"
					accept="image/*"
					className="hidden"
					onChange={handleImageUpload}
				/>
				{selectedImageName ? (
					<div className="text-center space-y-4">
						<span>{selectedImageName}</span>
						<img src={selectedImageUrl} className="max-w-96 rounded-md" />
					</div>
				) : (
					<span>Choose Image</span>
				)}
			</label>
			<button onClick={handleSubmit} className="flex items-center space-x-1">
				<span>Process</span>
				<PencilSquareIcon className="size-4" />
			</button>
			{illustrationImageDataUrl && (
				<div className="flex space-x-8">
					<div className="neu-up px-4 py-2 text-center space-y-4">
						<p className="font-bold">Denoised Image</p>
						<img
							src={denoisedImageDataUrl}
							className="max-w-96 rounded-md border-2"
						/>
					</div>

					<div className="neu-up px-4 py-2 text-center space-y-4">
						<p className="font-bold">Illustration</p>
						<img
							src={illustrationImageDataUrl}
							className="max-w-96 rounded-md"
						/>
					</div>
				</div>
			)}
		</div>
	);
}

export default App;
