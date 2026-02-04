import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Feedback } from '../../types';
import { fetchFeedback as fetchFeedbackApi } from '../../api/feedback';

interface FeedbackState {
  feedback: Feedback[];
  loading: boolean;
  error: string | null;
}

const initialState: FeedbackState = {
  feedback: [],
  loading: false,
  error: null,
};

// Load feedback from localStorage if available
const storedFeedback = localStorage.getItem('feedback');
if (storedFeedback) {
  try {
    initialState.feedback = JSON.parse(storedFeedback);
  } catch (error) {
    console.error('Failed to parse feedback from localStorage', error);
  }
}

export const fetchFeedback = createAsyncThunk(
  'feedback/fetchFeedback',
  async (_, { rejectWithValue }) => {
    try {
      const feedback = await fetchFeedbackApi();
      return feedback;
    } catch {
      return rejectWithValue('Failed to fetch feedback');
    }
  }
);

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    addFeedback: (state, action: PayloadAction<Feedback>) => {
      state.feedback.push(action.payload);
      localStorage.setItem('feedback', JSON.stringify(state.feedback));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedback.fulfilled, (state, action) => {
        state.feedback = action.payload;
        state.loading = false;
        localStorage.setItem('feedback', JSON.stringify(action.payload));
      })
      .addCase(fetchFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;
