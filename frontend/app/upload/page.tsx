"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { saveExtractedData } from '@/actions';
import { cn } from "@/lib/utils";
import { CheckCircle, FileSymlink, FileSymlinkIcon, Loader, Loader2, UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

const UploadPage = () => {

  const router = useRouter();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);

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
        toast.error(data.error || 'Failed to process PDF');
        return;
      }

      const { parsedData } = data;

      const result = await saveExtractedData(parsedData);

      if (result.success) {
        toast.success('Form data extracted and saved successfully');
        setUploadSuccess(true);
      } else {
        toast.error(result.error || 'Failed to save data');
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
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Upload PDF Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg px-10 min-h-[200px] flex flex-col items-center justify-center text-center cursor-pointer transition-colors w-full hover:border-purple-500',
              isDragActive ? 'border-purple-500 bg-purple-500/10' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-500/5',
              isUploading ? 'opacity-50 cursor-not-allowed' : ''
            )}
          >
            <input {...getInputProps()} disabled={isUploading} />
            {isUploading ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <Loader2 className="size-12 animate-spin" />
                <p>
                  Processing...
                </p>
              </div>
            ) : isDragActive ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <FileSymlink className="size-12" />
                <p>
                  Yeah! Drop it here
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2 gap-2 w-full">
                <UploadCloud className="w-12" />
                <p>Drag and drop a PDF form here, or click to select one</p>
              </div>
            )}
          </div> */}
          {uploadSuccess ? (
            <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <CheckCircle strokeWidth={1.6} className="w-16 h-16 text-green-500" />
                <h3 className="text-xl font-semibold mt-4">Upload Successful!</h3>
                <p className="text-gray-600 max-w-md">
                  The PDF form has been processed and the data has been successfully saved to the database.
                </p>
              </div>
              <div className="flex gap-4 mt-4">
                <Button
                  onClick={() => router.push('/candidates')}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  View Candidates
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setUploadSuccess(false)}
                >
                  Upload Another
                </Button>
              </div>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg px-10 min-h-[200px] flex flex-col items-center justify-center text-center cursor-pointer transition-colors w-full hover:border-purple-500
                ${isDragActive ? 'border-purple-500 bg-purple-500/10' : 'border-gray-300 hover:border-purple-500 hover:bg-purple-500/5'}
                ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} />
              {isUploading ? (
                <div className="flex flex-col items-center justify-center gap-2">
                  <Loader2 className="size-12 animate-spin" />
                  <p>Processing...</p>
                </div>
              ) : isDragActive ? (
                <div className="flex flex-col items-center justify-center gap-2">
                  <FileSymlink className="size-12" />
                  <p>Yeah! Drop it here</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-2 gap-2 w-full">
                  <UploadCloud className="w-12" />
                  <p>Drag and drop a PDF form here, or click to select one</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default UploadPage;
