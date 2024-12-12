"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: true
  });

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };

  const handleUpload = () => {
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setProgress(progress);
      if (progress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          setFiles([]);
          setProgress(0);
        }, 1000);
      }
    }, 500);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-500'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag & drop files here, or click to select files
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supports PDF, PNG, JPG, JPEG
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <File className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">{file.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFile(file)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {progress > 0 && (
            <Progress value={progress} className="w-full" />
          )}

          <Button
            className="w-full"
            onClick={handleUpload}
            disabled={progress > 0}
          >
            Upload {files.length} file{files.length > 1 ? 's' : ''}
          </Button>
        </div>
      )}
    </div>
  );
}