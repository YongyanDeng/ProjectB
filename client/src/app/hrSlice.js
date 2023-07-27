import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {} from "services/hr";

const initialState = {
    employees: {},
    signleEmployee: {},
    status: "idle",
};

const hrSlice = createSlice({});
