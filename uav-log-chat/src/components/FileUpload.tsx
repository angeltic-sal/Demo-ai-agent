'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios, { AxiosError } from 'axios';

interface UploadData {
  log_id: string;
  message: string;
  summary: {
    max_altitude: number;
    flight_time: number;
    message_types: string[];
  };
}

interface FileUploadProps {
  onUploadSuccess: (data: UploadData) => void;
  onFileSelected: (file: File) => void;
}

export default function FileUpload({ onUploadSuccess, onFileSelected }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Check file extension
    if (!file.name.endsWith('.bin')) {
      setError('Please upload a .bin file');
      return;
    }

    setError(null);
    setUploading(true);
    setUploadProgress(0);
    onFileSelected(file);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post<UploadData>('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });

      onUploadSuccess(response.data);
    } catch (error) {
      console.error('Upload error:', error);
      const axiosError = error as AxiosError;
      
      if (axiosError.response?.status === 400) {
        setError('Invalid file format. Please upload a valid .bin file.');
      } else if (axiosError.response?.status === 500) {
        setError('Server error while processing the file. Please try again.');
      } else if (axiosError.code === 'ECONNREFUSED') {
        setError('Cannot connect to backend server. Make sure the backend server is running on http://localhost:8000');
      } else {
        setError('Upload failed. Please try again.');
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [onUploadSuccess, onFileSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/octet-stream': ['.bin']
    },
    multiple: false,
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${uploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg 
              className={`w-12 h-12 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
          </div>
          
          {uploading ? (
            <div className="space-y-2">
              <p className="text-blue-600 font-medium">Uploading and processing...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">{uploadProgress}%</p>
            </div>
          ) : isDragActive ? (
            <p className="text-blue-600 font-medium">Drop the .bin file here</p>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-600 font-medium">
                Drag & drop your .bin log file here, or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports MAVLink binary log files (.bin) up to 100MB
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
} 