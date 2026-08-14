import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000';

export const processComplaint = createAsyncThunk(
  'complaint/process',
  async ({ text, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (file) formData.append('file', file);
      if (text) formData.append('text', text);

      const response = await fetch(`${API_BASE_URL}/api/process-complaint`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.detail || 'Failed to process complaint document');
      }
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialFormState = {
  complaint_source: '',
  customer_name: '',
  product_name: '',
  product_strength_grade: '',
  batch_lot_number: '',
  manufacturing_date: '',
  expiry_date: '',
  quantity_affected: '',
  complaint_type: '',
  complaint_date: '',
  detailed_description: '',
  initial_severity: '',
  priority: '',
};

const complaintSlice = createSlice({
  name: 'complaint',
  initialState: {
    formData: initialFormState,
    assessment: null,
    loading: false,
    progress: 0,
    error: null,
  },
  reducers: {
    updateField: (state, action) => {
      state.formData[action.payload.field] = action.payload.value;
    },
    resetForm: (state) => {
      state.formData = initialFormState;
      state.assessment = null;
      state.progress = 0;
      state.error = null;
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(processComplaint.pending, (state) => {
        state.loading = true;
        state.progress = 30;
        state.error = null;
      })
      .addCase(processComplaint.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = 100;
        state.formData = {
          ...state.formData,
          ...action.payload.extracted_data,
          initial_severity: action.payload.assessment.initial_severity,
          priority: action.payload.assessment.priority,
        };
        state.assessment = action.payload.assessment;
      })
      .addCase(processComplaint.rejected, (state, action) => {
        state.loading = false;
        state.progress = 0;
        state.error = action.payload;
      });
  },
});

export const { updateField, resetForm, setProgress } = complaintSlice.actions;
export default complaintSlice.reducer;
