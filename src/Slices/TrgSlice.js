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
      localStorage.setItem("dotsMM", JSON.stringify(state.dotsMM));
    },
  },
});

export const { setGetFileUrl, setAddToLs } = TrgSlice.actions;
export default TrgSlice.reducer;