# UAV Log Analyzer - AI-Powered Flight Data Analysis

A modern Next.js application for uploading and analyzing MAVLink .bin log files using AI-powered chat interface.

![UAV Log Analyzer](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan)

## Features

- **Drag & Drop Upload**: Easy file upload for MAVLink .bin log files
- **AI-Powered Analysis**: Chat with AI to analyze flight data and detect issues
- **Real-time Processing**: Live upload progress and instant analysis
- **Responsive Design**: Modern, mobile-friendly interface
- **Error Handling**: Comprehensive error handling and user feedback

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Upload**: React Dropzone for file handling
- **HTTP Client**: Axios for API communication
- **Backend**: FastAPI (separate service)

## Prerequisites

1. **Backend Server**: The FastAPI backend must be running on `http://localhost:8000`
2. **Node.js**: Version 18 or higher
3. **npm**: Package manager

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd uav-log-chat
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000`

## Backend Setup

Make sure the FastAPI backend is running on port 8000. The backend should have these endpoints:

- `POST /api/upload` - Upload .bin files
- `POST /api/chat/{log_id}` - Chat with AI about the uploaded log

## Usage

### 1. Upload a Log File

- Drag and drop a `.bin` file onto the upload area, or click to browse
- The file will be uploaded and processed automatically
- You'll see a summary with key flight metrics

### 2. Chat with AI

- Once uploaded, use the chat interface to ask questions about your flight data
- Try suggested questions or ask your own
- The AI can analyze:
  - Flight altitude and duration
  - GPS signal issues
  - Battery status
  - Critical errors
  - Mode changes
  - And much more!

### Example Questions

- "What was the maximum altitude reached during this flight?"
- "Were there any GPS issues during the flight?"
- "What was the battery status throughout the flight?"
- "Did any critical errors occur during the flight?"
- "How many mode changes happened during the flight?"

## Project Structure

```
uav-log-chat/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main application page
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   └── components/
│       ├── FileUpload.tsx    # File upload component
│       └── ChatWindow.tsx    # Chat interface component
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── package.json
```

## Configuration

The app is configured to proxy API requests to the backend:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- API proxy: `/api/*` → `http://localhost:8000/api/*`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. **New Components**: Add to `src/components/`
2. **API Changes**: Update the proxy configuration in `next.config.ts`
3. **Styling**: Use Tailwind CSS classes or extend the configuration

## Troubleshooting

### Backend Connection Issues

If you see "Cannot connect to backend server" errors:

1. Make sure the FastAPI backend is running on `http://localhost:8000`
2. Check that the backend has CORS enabled for `http://localhost:3000`
3. Verify the backend endpoints are working with curl or Postman

### Upload Issues

- Ensure your file is a valid `.bin` MAVLink log file
- Check file size (max 100MB)
- Verify backend has write permissions for uploads

### Chat Issues

- Make sure you've uploaded a file first
- Check browser console for detailed error messages
- Verify the backend AI service is properly configured

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- Check the troubleshooting section above
- Create an issue in the repository
- Contact the development team
