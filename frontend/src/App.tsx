import React, { useState } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { processImage } from './services/image_processing';

function App() {
	const [selectedImageName, setSelectedImageName] = useState<string>();
	const [selectedImageUrl, setSelectedImageUrl] = useState<string>();
	const [denoisedImageDataUrl, setDenoisedImageDataUrl] = useState<string>();
	const [sketchImageDataUrl, setSkectImageDataUrl] = useState<string>();
	const [isLoading, setIsLoading] = useState<boolean>(false);

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

		setIsLoading(true);
		setDenoisedImageDataUrl(undefined);
		setSkectImageDataUrl(undefined);
		const { denoisedImageDataUrl, sketchImageDataUrl } =
			await processImage(selectedImageUrl);
		setDenoisedImageDataUrl(denoisedImageDataUrl);
		setSkectImageDataUrl(sketchImageDataUrl);
		setIsLoading(false);
	};

	return (
		<div className="flex flex-col items-center p-4 space-y-4">
			<h1 className="text-2xl font-bold">SketchMiner</h1>
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
			<button
				onClick={handleSubmit}
				disabled={isLoading}
				className="flex items-center space-x-1"
			>
				{isLoading ? (
					<span>Processing...</span>
				) : (
					<>
						<span>Process</span>
						<PencilSquareIcon className="size-4" />
					</>
				)}
			</button>
			{sketchImageDataUrl && (
				<div className="flex space-x-8">
					<div className="neu-up px-4 py-2 text-center space-y-4">
						<p className="font-bold">Denoised Image</p>
						<img
							src={denoisedImageDataUrl}
							className="max-w-96 rounded-md border-2"
						/>
					</div>

					<div className="neu-up px-4 py-2 text-center space-y-4">
						<p className="font-bold">Sketch</p>
						<img src={sketchImageDataUrl} className="max-w-96 rounded-md" />
					</div>
				</div>
			)}
		</div>
	);
}

export default App;
