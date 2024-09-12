import React from 'react';
import { ImageProcessingConfiguration } from '../services/image_processing';
import { ArrowUpRightIcon } from '@heroicons/react/24/solid';

interface ImageProcessingConfigurationFormProps {
	configuration: ImageProcessingConfiguration;
	setConfiguration: (configuration: ImageProcessingConfiguration) => void;
}

export default function ImageProcessingConfigurationForm({
	configuration,
	setConfiguration,
}: ImageProcessingConfigurationFormProps) {
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = event.target;
		const keys = name.split('.');

		if (keys.length === 2) {
			const firstKey = keys[0];
			setConfiguration({
				...configuration,
				[firstKey]: {
					...(firstKey === 'thresholdingConfiguration'
						? configuration.thresholdingConfiguration
						: configuration.denoisingConfiguration),
					[keys[1]]: value,
				},
			});
		} else {
			setConfiguration({
				...configuration,
				[name]: type === 'checkbox' ? checked : value,
			});
		}
	};

	return (
		<div className="flex flex-col space-y-4 text-center border-2 p-4 rounded-sm">
			<h1 className="font-bold underline">Image Processing Configuration</h1>
			<div className="flex space-x-4">
				<div className="flex flex-col space-y-2 items-center">
					<a
						href="https://docs.opencv.org/3.4/d1/d79/group__photo__denoise.html#ga4c6b0031f56ea3f98f768881279ffe93"
						target="blank"
						className="font-semibold flex items-center space-x-2"
					>
						<span>Denoising Configuration</span>
						<ArrowUpRightIcon className="size-4" />
					</a>
					<label className="flex items-center space-x-2">
						<span>h:</span>
						<input
							type="number"
							name="denoisingConfiguration.h"
							value={configuration.denoisingConfiguration.h}
							onChange={handleChange}
							required
						/>
					</label>
					<label className="flex items-center space-x-2">
						<span>Template Window Size:</span>
						<input
							type="number"
							name="denoisingConfiguration.templateWindowSize"
							value={configuration.denoisingConfiguration.templateWindowSize}
							onChange={handleChange}
							required
						/>
					</label>
					<label className="flex items-center space-x-2">
						<span>Search Window Size:</span>
						<input
							type="number"
							name="denoisingConfiguration.searchWindowSize"
							value={configuration.denoisingConfiguration.searchWindowSize}
							onChange={handleChange}
							required
						/>
					</label>
				</div>
				<div className="flex flex-col space-y-2 items-center">
					<a
						href="https://docs.opencv.org/4.x/d7/d1b/group__imgproc__misc.html#ga72b913f352e4a1b1b397736707afcde3"
						target="blank"
						className="font-semibold flex items-center space-x-2"
					>
						<span>Thresholding Configuration</span>
						<ArrowUpRightIcon className="size-4" />
					</a>
					<label className="flex items-center space-x-2">
						<span>Block Size:</span>
						<input
							type="number"
							name="thresholdingConfiguration.blockSize"
							value={configuration.thresholdingConfiguration.blockSize}
							onChange={handleChange}
							required
						/>
					</label>
					<label className="flex items-center space-x-2">
						<span>C:</span>
						<input
							type="number"
							name="thresholdingConfiguration.C"
							value={configuration.thresholdingConfiguration.C}
							onChange={handleChange}
							required
						/>
					</label>
				</div>
				<div className="flex flex-col space-y-2 items-center">
					<h2 className="font-semibold">Sketch Configuration</h2>
					<label className="flex items-center space-x-2">
						<span>Sketch Grayscale Value:</span>
						<input
							type="number"
							name="sketchGrayscaleValue"
							value={configuration.sketchGrayscaleValue}
							onChange={handleChange}
							required
						/>
					</label>
					<label className="flex items-center space-x-2">
						<span>Transparent Sketch:</span>
						<input
							type="checkbox"
							name="transparent_sketch"
							checked={configuration.transparent_sketch}
							onChange={handleChange}
							className="w-auto"
						/>
					</label>
				</div>
			</div>
		</div>
	);
}
