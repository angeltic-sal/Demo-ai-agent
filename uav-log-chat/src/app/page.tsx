'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ChatWindow from '@/components/ChatWindow';

interface UploadData {
  log_id: string;
  message: string;
  summary: {
    max_altitude: number;
    flight_time: number;
    message_types: string[];
  };
}

export default function Home() {
  const [logId, setLogId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [uploadedData, setUploadedData] = useState<UploadData | null>(null);

  const handleUploadSuccess = (data: UploadData) => {
    setLogId(data.log_id);
    setUploadedData(data);
  };

  const handleFileSelected = (file: File) => {
    setFileName(file.name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            UAV Log Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your MAVLink .bin log files and chat with AI to analyze flight data, 
            detect issues, and gain insights about your drone flights.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* File Upload Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Log File
            </h2>
            <FileUpload 
              onUploadSuccess={handleUploadSuccess}
              onFileSelected={handleFileSelected}
            />
            
            {uploadedData && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-lg font-medium text-green-800 mb-2">Upload Successful!</h3>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>File:</strong> {fileName}</p>
                  <p><strong>Log ID:</strong> {uploadedData.log_id}</p>
                  <p><strong>Max Altitude:</strong> {uploadedData.summary?.max_altitude?.toFixed(2)}m</p>
                  <p><strong>Flight Time:</strong> {uploadedData.summary?.flight_time?.toFixed(1)}s</p>
                  <p><strong>Message Types:</strong> {uploadedData.summary?.message_types?.length || 0}</p>
                </div>
              </div>
            )}
          </div>

          {/* Chat Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-2.773-.98L5 21l2.052-5.227A8.957 8.957 0 013 12a8 8 0 018-8 8 8 0 018 8z" />
              </svg>
              AI Flight Analyst
            </h2>
            <ChatWindow logId={logId} fileName={fileName} />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">How it works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-800 mb-2">1. Upload</h4>
              <p className="text-sm text-gray-600">Upload your MAVLink .bin log file from your drone flight</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-800 mb-2">2. Analyze</h4>
              <p className="text-sm text-gray-600">AI processes telemetry data including GPS, battery, altitude, and errors</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-2.773-.98L5 21l2.052-5.227A8.957 8.957 0 013 12a8 8 0 018-8 8 8 0 018 8z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-800 mb-2">3. Chat</h4>
              <p className="text-sm text-gray-600">Ask questions about your flight data and get intelligent insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
