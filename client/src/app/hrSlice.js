import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { uploadRegisterToken, fetchAllApplications, fetchAllVisas } from "services/hr";
import { addError, removeError } from "./errorSlice";

const initialState = {
    employees: [],
    inProgress: [],
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

export const getApplicationList = createAsyncThunk(
    "hr/getApplicationList",
    async (data, thunkAPI) => {
        try {
            const res = await fetchAllApplications(data);
            thunkAPI.dispatch(removeError());
            return res;
        } catch (err) {
            thunkAPI.dispatch(addError(err.message));
            return thunkAPI.rejectWithValue(err.message);
        }
    },
);

export const getVisaList = createAsyncThunk("hr/getVisaList", async (data, thunkAPI) => {
    try {
        const res = await fetchAllVisas(data);
        thunkAPI.dispatch(removeError());
        return res;
    } catch (err) {
        thunkAPI.dispatch(addError(err.message));
        return thunkAPI.rejectWithValue(err.message);
    }
});

const hrSlice = createSlice({
    name: "hr",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Send register token to db
        builder.addCase(sendRegisterToken.fulfilled, (state, action) => {
            state.status = "successed";
        });
        builder.addCase(sendRegisterToken.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(sendRegisterToken.pending, (state, action) => {
            state.status = "pending";
        });

        // Fetch all applications
        builder.addCase(getApplicationList.fulfilled, (state, action) => {
            state.employees = action.payload;
            state.status = "successed";
        });
        builder.addCase(getApplicationList.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(getApplicationList.pending, (state, action) => {
            state.status = "pending";
        });

        // Fetch all employees visa status
        builder.addCase(getVisaList.fulfilled, (state, action) => {
            state.employees = action.payload.all;
            state.inProgress = action.payload.inProgress;
            state.status = "successed";
        });
        builder.addCase(getVisaList.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(getVisaList.pending, (state, action) => {
            state.status = "pending";
        });
    },
});

// export const {} = hrSlice.actions;
export default hrSlice.reducer;
