import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { processComplaint } from '../redux/complaintSlice';

export default function AIIntake() {
  const dispatch = useDispatch();
  const { loading, progress, error } = useSelector((state) => state.complaint);
  const [pasteText, setPasteText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file);
  };

  const handleTriggerAI = () => {
    if (!pasteText && !selectedFile) return;
    dispatch(processComplaint({ text: pasteText, file: selectedFile }));
  };

  return (
    <section className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
      <div>
        <h2 className="text-lg font-bold text-slate-900">AI Complaint Intake Assistant</h2>
        <p className="text-sm text-slate-500">
          Upload a document or paste complaint text to auto-fill the form.
        </p>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.eml,.csv"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files?.[0])}
        />
        <p className="text-sm font-semibold text-slate-700">
          {selectedFile ? selectedFile.name : 'Drag & drop a complaint document (PDF/TXT)'}
        </p>
        <p className="text-xs text-slate-400 mt-1">or click to browse</p>
      </div>

      {/* Paste Text */}
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">
          Or paste complaint text / email
        </label>
        <textarea
          rows="6"
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          placeholder="Paste the complaint email or text here..."
          className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Progress Bar */}
      {loading && (
        <div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">Extracting... {progress}%</p>
        </div>
      )}

      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleTriggerAI}
        disabled={loading || (!pasteText && !selectedFile)}
        className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Extract & Auto-Fill'}
      </button>
    </section>
  );
}
