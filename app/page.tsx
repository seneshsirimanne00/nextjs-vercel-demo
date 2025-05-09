'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [text, setText] = useState('Hello World');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleTextChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const response = await fetch('/api/updateText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: e.target.value }),
    });
    const data = await response.json();
    setText(data.text);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setIsUploading(true);
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const blob = await response.json();
      setUploadedImageUrl(blob.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">Image Comparison Demo</h1>
        
        <div className="grid grid-cols-2 gap-8">
          {/* Static Image */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Static Image</h2>
            <div className="relative h-64 w-full">
              <Image 
                src="/testimage.png"
                alt="Static Image"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Uploaded Image */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Uploaded Image (Vercel Blob)</h2>
            <div className="relative h-64 w-full bg-gray-100 rounded-lg">
              {uploadedImageUrl ? (
                <Image 
                  src={uploadedImageUrl}
                  alt="Uploaded Image"
                  fill
                  className="object-cover rounded-lg"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">
                    {isUploading ? 'Uploading...' : 'No image uploaded yet'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Update Text</label>
            <input
              type="text"
              onChange={handleTextChange}
              placeholder="Enter new text"
              className="w-full p-2 border rounded"
            />
            <p className="mt-2">Current text: {text}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Upload Image</label>
            <input
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
              className="w-full p-2 border rounded"
              disabled={isUploading}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
