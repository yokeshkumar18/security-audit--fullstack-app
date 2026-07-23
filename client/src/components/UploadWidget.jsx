import { useRef, useState } from 'react';
import axios from 'axios';
import { Upload, Loader2 } from 'lucide-react';

const UploadWidget = ({ onUploadSuccess }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileText = await file.text();
      let jsonData;
      try {
        jsonData = JSON.parse(fileText);
      } catch (err) {
        alert("Invalid JSON file.");
        setIsUploading(false);
        return;
      }

      // Allow uploading either a single object or an array of objects
      if (!Array.isArray(jsonData)) {
        jsonData = [jsonData];
      }

      const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/logs/bulk` : 'http://localhost:5000/api/logs/bulk';
      await axios.post(API_URL, jsonData);
      alert(`Successfully uploaded ${jsonData.length} records!`);
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload logs. Check console.');
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if needed
      e.target.value = null;
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept=".json" 
        style={{ display: 'none' }} 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button 
        className="upload-btn"
        onClick={() => fileInputRef.current.click()}
        disabled={isUploading}
      >
        {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
        {isUploading ? 'Uploading...' : 'Bulk Upload JSON'}
      </button>
    </div>
  );
};

export default UploadWidget;
