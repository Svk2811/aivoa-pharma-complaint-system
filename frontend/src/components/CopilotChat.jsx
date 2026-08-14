import React from 'react';
import { useSelector } from 'react-redux';

const severityColor = {
  Critical: 'bg-red-100 text-red-700 border-red-200',
  Major: 'bg-amber-100 text-amber-700 border-amber-200',
  Minor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const priorityColor = {
  High: 'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-amber-100 text-amber-700 border-amber-200',
  Low: 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function CopilotChat() {
  const { assessment, loading } = useSelector((state) => state.complaint);

  return (
    <section className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <h2 className="text-lg font-bold text-slate-900">AI Risk & CAPA Summary</h2>

      {!assessment && !loading && (
        <p className="text-sm text-slate-500">
          Upload a document to extract complaint details. A risk assessment and CAPA
          recommendation will appear here once processing completes.
        </p>
      )}

      {loading && <p className="text-sm text-slate-500">Analyzing complaint...</p>}

      {assessment && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                severityColor[assessment.initial_severity] || 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              Severity: {assessment.initial_severity}
            </span>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                priorityColor[assessment.priority] || 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              Priority: {assessment.priority}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
              Completeness: {assessment.completeness_score}%
            </span>
          </div>

          {assessment.missing_fields?.length > 0 && (
            <div className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2">
              <span className="font-semibold">Missing fields: </span>
              {assessment.missing_fields.join(', ')}
            </div>
          )}

          <div>
            <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">
              Probable Root Cause
            </h3>
            <p className="text-sm text-slate-700">{assessment.probable_root_cause}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">
              Recommended CAPA
            </h3>
            <p className="text-sm text-slate-700">{assessment.recommended_capa}</p>
          </div>
        </div>
      )}
    </section>
  );
}
