import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
    uploadRegisterToken,
    fetchAllProfiles,
    fetchProfileDetail,
    fetchAllVisas,
    fetchEmailHistory,
    fetchAllOBApplication,
    fetchVisaDetail,
    uploadVisaReview,
} from "services/hr";
import { addError, removeError } from "./errorSlice";

const initialState = {
    employees: [],
    inProgress: [],
    selectedEmployee: {},
    emailHistory: [],
    obApplications: [],
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

export const getProfileList = createAsyncThunk("hr/getProfileList", async (data, thunkAPI) => {
    try {
        const res = await fetchAllProfiles(data);
        thunkAPI.dispatch(removeError());
        return res;
    } catch (err) {
        thunkAPI.dispatch(addError(err.message));
        return thunkAPI.rejectWithValue(err.message);
    }
});

export const getProfileDetail = createAsyncThunk("hr/getProfileDetail", async (data, thunkAPI) => {
    try {
        const res = await fetchProfileDetail(data);
        thunkAPI.dispatch(removeError());
        return res;
    } catch (err) {
        thunkAPI.dispatch(addError(err.message));
        return thunkAPI.rejectWithValue(err.message);
    }
});

// Onboarding application section
export const getEmailHistory = createAsyncThunk("hr/getEmailHistory", async (data, thunkAPI) => {
    try {
        const res = await fetchEmailHistory(data);
        thunkAPI.dispatch(removeError());
        return res;
    } catch (err) {
        thunkAPI.dispatch(addError(err.message));
        return thunkAPI.rejectWithValue(err.message);
    }
});

export const getAllOBApplication = createAsyncThunk(
    "hr/getOnboardingApplication",
    async (data, thunkAPI) => {
        try {
            const res = await fetchAllOBApplication(data);
            thunkAPI.dispatch(removeError());
            return res;
        } catch (err) {
            thunkAPI.dispatch(addError(err.message));
            return thunkAPI.rejectWithValue(err.message);
        }
    },
);

// Visa section
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

export const getVisaDetail = createAsyncThunk("hr/getVisaDetail", async (data, thunkAPI) => {
    try {
        const res = await fetchVisaDetail(data);
        thunkAPI.dispatch(removeError());
        return res;
    } catch (err) {
        thunkAPI.dispatch(addError(err.message));
        return thunkAPI.rejectWithValue(err.message);
    }
});

export const reviewVisa = createAsyncThunk("hr/reviewVisa", async (data, thunkAPI) => {
    try {
        const res = await uploadVisaReview(data);
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

        // Fetch all profils
        builder.addCase(getProfileList.fulfilled, (state, action) => {
            state.employees = action.payload;
            state.status = "successed";
        });
        builder.addCase(getProfileList.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(getProfileList.pending, (state, action) => {
            state.status = "pending";
        });

        builder.addCase(getProfileDetail.fulfilled, (state, action) => {
            state.selectedEmployee = action.payload;
            state.status = "successed";
        });
        builder.addCase(getProfileDetail.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(getProfileDetail.pending, (state, action) => {
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

        // Get email history list
        builder.addCase(getEmailHistory.fulfilled, (state, action) => {
            state.emailHistory = action.payload;
            state.status = "successed";
        });
        builder.addCase(getEmailHistory.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(getEmailHistory.pending, (state, action) => {
            state.status = "pending";
        });

        // Get all onboarding applicatons
        builder.addCase(getAllOBApplication.fulfilled, (state, action) => {
            state.obApplications = action.payload;
            state.status = "successed";
        });
        builder.addCase(getAllOBApplication.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(getAllOBApplication.pending, (state, action) => {
            state.status = "pending";
        });

        // Get an employee's visa detail
        builder.addCase(getVisaDetail.fulfilled, (state, action) => {
            state.selectedEmployee = action.payload;
            state.status = "successed";
        });
        builder.addCase(getVisaDetail.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(getVisaDetail.pending, (state, action) => {
            state.status = "pending";
        });

        // Upload file review & feedback
        builder.addCase(reviewVisa.fulfilled, (state, action) => {
            state.selectedEmployee = action.payload;
            state.status = "successed";
        });
        builder.addCase(reviewVisa.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(reviewVisa.pending, (state, action) => {
            state.status = "pending";
        });
    },
});

// export const {} = hrSlice.actions;
export default hrSlice.reducer;
