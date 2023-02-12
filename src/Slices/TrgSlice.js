import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  fileUrl: "",
};

export const TrgSlice = createSlice({
  name: "Trg",
  initialState,
  reducers: {
    setGetFileUrl: (state, action) => {
      state.fileUrl = action.payload;
    },
  },
});

export const { setGetFileUrl } = TrgSlice.actions;
export default TrgSlice.reducer;
