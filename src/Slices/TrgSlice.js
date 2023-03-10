import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  fileUrl: "",
  dotsMM: [],
};

export const TrgSlice = createSlice({
  name: "Trg",
  initialState,
  reducers: {
    setGetFileUrl: (state, action) => {
      state.fileUrl = action.payload;
    },
    setAddToLs: (state, action) => {
      state.dotsMM = action.payload;

    },
  },
});

export const { setGetFileUrl, setAddToLs } = TrgSlice.actions;
export default TrgSlice.reducer;
