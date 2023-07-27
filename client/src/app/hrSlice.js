import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { uploadRegisterToken } from "services/hr";
import { addError, removeError } from "./errorSlice";

const initialState = {
    employees: {},
    signleEmployee: {},
    status: "idle",
};

export const sendRegisterToken = createAsyncThunk(
    "hr/sendRegisterToken",
    async (data, thunkAPI) => {
        try {
            const { createdToken } = await uploadRegisterToken(data);
            thunkAPI.dispatch(removeError());
            return createdToken;
        } catch (err) {
            thunkAPI.dispatch(addError(err.message));
            return thunkAPI.rejectWithValue(err.message);
        }
    },
);

const hrSlice = createSlice({
    name: "hr",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(sendRegisterToken.fulfilled, (state, action) => {
            state.status = "successed";
        });
        builder.addCase(sendRegisterToken.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(sendRegisterToken.pending, (state, action) => {
            state.status = "pending";
        });
    },
});

// export const {} = hrSlice.actions;
export default hrSlice.reducer;
