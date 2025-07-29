import { AxiosInstance } from "@/routes/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
};

// export const addReview = createAsyncThunk(
//   "/order/addReview",
//   async (formdata) => {
//     const response = await AxiosInstance.post(
//       `/shop/review/add`,
//       formdata
//     );

//     return response.data;
//   }
// );

export const addReview = createAsyncThunk(
  "/order/addReview",
  async (formdata, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post(`/shop/review/add`, formdata);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data); // ⬅️ This captures backend message
    }
  }
);

export const updateReview = createAsyncThunk(
  "/review/update",
  async ({ reviewId, reviewMessage, reviewValue }, { rejectWithValue }) => {
    try {
      const res = await AxiosInstance.put(`/shop/review/${reviewId}`, {
        reviewMessage,
        reviewValue,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteReview = createAsyncThunk(
  "/review/delete",
  async (reviewId, { rejectWithValue }) => {
    try {
      const res = await AxiosInstance.delete(`/shop/review/${reviewId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const getReviews = createAsyncThunk("/order/getReviews", async (id) => {
  const response = await AxiosInstance.get(
    `/shop/review/${id}`
  );

  return response.data;
});

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      }).addCase(addReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addReview.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        // Optional: you can log or track rejected messages here
        console.error("Review failed:", action.error.message);
      }).addCase(updateReview.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateReview.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteReview.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteReview.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default reviewSlice.reducer;
