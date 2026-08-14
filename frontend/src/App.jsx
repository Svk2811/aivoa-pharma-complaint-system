import React from 'react';
import ComplaintForm from './components/ComplaintForm';
import AIIntake from './components/AIIntake';
import CopilotChat from './components/CopilotChat';

export default function App() {
  const handleSave = () => {
    // Hook this up to a POST /api/complaints endpoint when the
    // persistence layer (PostgreSQL/MySQL) is wired up.
    // eslint-disable-next-line no-alert
    alert('Complaint saved (stub) — wire this up to your persistence API.');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] text-slate-800 p-6">
      <header className="max-w-7xl mx-auto mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Log Customer Complaint</h1>
          <p className="text-sm text-slate-500">API & FDF Quality Assurance Module</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: Log Complaint Form */}
        <ComplaintForm onSave={handleSave} />

        {/* RIGHT PANEL: AI Intake + Copilot */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <AIIntake />
          <CopilotChat />
        </div>
      </main>
    </div>
  );
}
