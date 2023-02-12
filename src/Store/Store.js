import { configureStore } from "@reduxjs/toolkit";
import TrgSlice from "../Slices/TrgSlice";

export const store = configureStore({
  reducer: {
    trg: TrgSlice,
  },
});
