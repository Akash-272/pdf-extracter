"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { saveExtractedData } from '@/actions';
import { UploadCloud } from 'lucide-react';

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Uploading file:', file.name);
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process PDF');
      }

      const { parsedData } = data;
      console.log('Parsed data received:', parsedData);
      
      // Save to database using server action
      const result = await saveExtractedData(parsedData);

      if (result.success) {
        toast.success('Form data extracted and saved successfully');
      } else {
        throw new Error(result.error || 'Failed to save data');
      }
    } catch (error) {
      console.error('Error processing form:', error);
      toast.error(
        error instanceof Error 
          ? `Error: ${error.message}` 
          : 'Failed to process and save form data'
      );
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: false,
    disabled: isUploading,
  });

  return (
    <main className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadCloud className="w-6 h-6" />
            Upload PDF Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary hover:bg-primary/5'}
              ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <p>Processing...</p>
            ) : isDragActive ? (
              <p>Drop the PDF here ...</p>
            ) : (
              <p>Drag and drop a PDF form here, or click to select one</p>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}