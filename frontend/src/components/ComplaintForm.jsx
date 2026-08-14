import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateField, resetForm } from '../redux/complaintSlice';

const FieldGroup = ({ label, children }) => (
  <div>
    <label className="text-xs font-semibold text-slate-600 block mb-1">{label}</label>
    {children}
  </div>
);

const inputClass =
  'w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none';

export default function ComplaintForm({ onSave }) {
  const dispatch = useDispatch();
  const { formData, loading } = useSelector((state) => state.complaint);

  const handleInputChange = (field, value) => {
    dispatch(updateField({ field, value }));
  };

  const handleReset = () => {
    dispatch(resetForm());
  };

  return (
    <section className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
      {/* Section 1: Origin & Customer Details */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3">
          1. Origin & Customer Details
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <FieldGroup label="Complaint Source">
            <input
              type="text"
              value={formData.complaint_source || ''}
              onChange={(e) => handleInputChange('complaint_source', e.target.value)}
              placeholder="Awaiting AI extraction..."
              className={inputClass}
            />
          </FieldGroup>
          <FieldGroup label="Customer Name">
            <input
              type="text"
              value={formData.customer_name || ''}
              onChange={(e) => handleInputChange('customer_name', e.target.value)}
              placeholder="Awaiting AI extraction..."
              className={inputClass}
            />
          </FieldGroup>
        </div>
      </div>

      {/* Section 2: Product & Batch Identification */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3">
          2. Product & Batch Identification
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <FieldGroup label="Product Name">
            <input
              type="text"
              value={formData.product_name || ''}
              onChange={(e) => handleInputChange('product_name', e.target.value)}
              placeholder="Awaiting AI extraction..."
              className={inputClass}
            />
          </FieldGroup>
          <FieldGroup label="Product Strength/Grade">
            <input
              type="text"
              value={formData.product_strength_grade || ''}
              onChange={(e) => handleInputChange('product_strength_grade', e.target.value)}
              placeholder="Awaiting AI extraction..."
              className={inputClass}
            />
          </FieldGroup>
          <FieldGroup label="Batch/Lot Number">
            <input
              type="text"
              value={formData.batch_lot_number || ''}
              onChange={(e) => handleInputChange('batch_lot_number', e.target.value)}
              placeholder="Awaiting AI extraction..."
              className={`${inputClass} font-mono`}
            />
          </FieldGroup>
          <FieldGroup label="Quantity Affected">
            <input
              type="text"
              value={formData.quantity_affected || ''}
              onChange={(e) => handleInputChange('quantity_affected', e.target.value)}
              placeholder="Awaiting AI extraction..."
              className={inputClass}
            />
          </FieldGroup>
          <FieldGroup label="Manufacturing Date">
            <input
              type="date"
              value={formData.manufacturing_date || ''}
              onChange={(e) => handleInputChange('manufacturing_date', e.target.value)}
              className={inputClass}
            />
          </FieldGroup>
          <FieldGroup label="Expiry Date">
            <input
              type="date"
              value={formData.expiry_date || ''}
              onChange={(e) => handleInputChange('expiry_date', e.target.value)}
              className={inputClass}
            />
          </FieldGroup>
        </div>
      </div>

      {/* Section 3: Complaint Details */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3">
          3. Complaint Details
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FieldGroup label="Complaint Type">
              <input
                type="text"
                value={formData.complaint_type || ''}
                onChange={(e) => handleInputChange('complaint_type', e.target.value)}
                placeholder="Awaiting AI extraction..."
                className={inputClass}
              />
            </FieldGroup>
            <FieldGroup label="Complaint Date">
              <input
                type="date"
                value={formData.complaint_date || ''}
                onChange={(e) => handleInputChange('complaint_date', e.target.value)}
                className={inputClass}
              />
            </FieldGroup>
          </div>
          <FieldGroup label="Detailed Complaint Description">
            <textarea
              rows="3"
              value={formData.detailed_description || ''}
              onChange={(e) => handleInputChange('detailed_description', e.target.value)}
              placeholder="Awaiting AI extraction..."
              className={inputClass}
            />
          </FieldGroup>
        </div>
      </div>

      {/* Section 4: Initial Assessment & Priority */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3">
          4. Initial Assessment & Priority
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <FieldGroup label="Initial Severity">
            <select
              value={formData.initial_severity || ''}
              onChange={(e) => handleInputChange('initial_severity', e.target.value)}
              className={inputClass}
            >
              <option value="">Select severity...</option>
              <option value="Critical">Critical</option>
              <option value="Major">Major</option>
              <option value="Minor">Minor</option>
            </select>
          </FieldGroup>
          <FieldGroup label="Priority">
            <select
              value={formData.priority || ''}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className={inputClass}
            >
              <option value="">Select priority...</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </FieldGroup>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
        >
          Reset Form
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={loading}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          Save Complaint
        </button>
      </div>
    </section>
  );
}
