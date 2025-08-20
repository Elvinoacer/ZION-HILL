import React, { useState, useRef } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';

interface ImageCropModalProps {
  src: string;
  onCrop: (croppedImageUrl: string) => void;
  onClose: () => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({ src, onCrop, onClose }) => {
  const [crop, setCrop] = useState<Crop>();
  const imageRef = useRef<HTMLImageElement>(null);

  const getCroppedImg = () => {
    if (!imageRef.current || !crop || !crop.width || !crop.height) {
      return;
    }

    const canvas = document.createElement('canvas');
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    ctx.drawImage(
      imageRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise<string>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        const fileUrl = window.URL.createObjectURL(blob);
        resolve(fileUrl);
      }, 'image/png');
    });
  };

  const handleCrop = async () => {
    const croppedImageUrl = await getCroppedImg();
    if (croppedImageUrl) {
      onCrop(croppedImageUrl);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Crop Image</h2>
        <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
          <img ref={imageRef} src={src} alt="Crop preview" />
        </ReactCrop>
        <div className="mt-4 flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCrop}>Crop</Button>
        </div>
      </div>
    </div>
  );
};