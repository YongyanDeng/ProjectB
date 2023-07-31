import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { signup, signin, updatePassword, register } from "services/auth";
import { addError, removeError } from "./errorSlice";

const initialState = {
    isAuthenticated: false,
    employee: {},
    status: "idle",
};

export const signUpEmployee = createAsyncThunk(
    "currentEmployee/signUpEmployee",
    async (data, thunkAPI) => {
        try {
            const newEmployee = await signup(data);
            thunkAPI.dispatch(removeError());
            return newEmployee;
        } catch (err) {
            thunkAPI.dispatch(addError(err.message));
            return thunkAPI.rejectWithValue(err.message);
        }
    },
);

export const signInEmployee = createAsyncThunk(
    "currentEmployee/signInEmployee",
    async (data, thunkAPI) => {
        try {
            const employee = await signin(data);
            localStorage.setItem("token", employee.token);
            thunkAPI.dispatch(removeError());
            return employee;
        } catch (err) {
            thunkAPI.dispatch(addError(err.message));
            return thunkAPI.rejectWithValue(err.message);
        }
    },
);

export const updateEmployeePassword = createAsyncThunk(
    "currentEmployee/updateEmployeePassword",
    async (data, thunkAPI) => {
        try {
            const employee = await updatePassword(data);
            thunkAPI.dispatch(removeError());
            return employee;
        } catch (err) {
            thunkAPI.dispatch(addError(err.message));
            return thunkAPI.rejectWithValue(err.message);
        }
    },
);

// Check if register token expired or not
export const registerCheck = createAsyncThunk(
    "currentEmployee/registerTokenCheck",
    async (data, thunkAPI) => {
        try {
            const res = await register(data);
            thunkAPI.dispatch(removeError());
            return res;
        } catch (err) {
            thunkAPI.dispatch(addError(err.message));
            return thunkAPI.rejectWithValue(err.message);
        }
    },
);

const currentEmployeeSlice = createSlice({
    name: "currentEmployee",
    initialState,
    reducers: {
        setCurrentEmployee: (state, action) => {
            state.isAuthenticated = !!Object.keys(action.payload).length;
            state.employee = action.payload;
        },
        logOut: (state, action) => {
            state.isAuthenticated = false;
            state.employee = {};
            state.status = "idle";
            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        // Sign in
        builder.addCase(signInEmployee.fulfilled, (state, action) => {
            state.isAuthenticated = !!Object.keys(action.payload).length;
            state.cart = action.payload.cart;
            const { id, username, role, name, ducoments, feedback } = action.payload;
            state.employee = { id, username, role, name, ducoments, feedback };
            state.status = "successed";
        });
        builder.addCase(signInEmployee.rejected, (state, action) => {
            state.isAuthenticated = false;
            state.employee = {};
            state.status = "failed";
        });
        builder.addCase(signInEmployee.pending, (state, action) => {
            state.status = "pending";
        });

        // Sign up
        builder.addCase(signUpEmployee.fulfilled, (state, action) => {
            state.status = "successed";
        });
        builder.addCase(signUpEmployee.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(signUpEmployee.pending, (state, action) => {
            state.status = "pending";
        });

        // Update Password
        builder.addCase(updateEmployeePassword.fulfilled, (state, action) => {
            state.status = "successed";
        });
        builder.addCase(updateEmployeePassword.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(updateEmployeePassword.pending, (state, action) => {
            state.status = "pending";
        });

        // Register
        builder.addCase(registerCheck.fulfilled, (state, action) => {
            state.status = "successed";
        });
        builder.addCase(registerCheck.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(registerCheck.pending, (state, action) => {
            state.status = "pending";
        });
    },
});

export const { setCurrentEmployee, logOut } = currentEmployeeSlice.actions;
export default currentEmployeeSlice.reducer;
