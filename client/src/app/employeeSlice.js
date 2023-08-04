import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { signup, signin, updatePassword, register } from "services/auth";
import {
    fetchEmployee,
    updateEmployee,
    uploadDocument,
    fetchDocuments,
    deleteDocument,
} from "services/employee";
import { addError, removeError } from "./errorSlice";

const initialState = {
    isAuthenticated: false,
    employee: {},
    documents: [],
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

export const fetchEmployeeAction = createAsyncThunk(
    "currentEmployee/fetchEmployeeInfo",
    async (data, thunkAPI) => {
        try {
            const employee = await fetchEmployee(data);
            thunkAPI.dispatch(removeError());
            return employee;
        } catch (err) {
            thunkAPI.dispatch(addError(err.message));
            return thunkAPI.rejectWithValue(err.message);
        }
    },
);

export const updateEmployeeAction = createAsyncThunk(
    "currentEmployee/updateEmployeeInfo",
    async (data, thunkAPI) => {
        try {
            const employee = await updateEmployee(data);
            thunkAPI.dispatch(removeError());
            return employee;
        } catch (err) {
            thunkAPI.dispatch(addError(err.message));
            return thunkAPI.rejectWithValue(err.message);
        }
    },
);

export const fetchDocumentsAction = createAsyncThunk(
    "currentEmployee/fetchDocuments",
    async (data, thunkAPI) => {
        try {
            const documents = await fetchDocuments(data);
            thunkAPI.dispatch(removeError());
            return documents;
        } catch (err) {
            thunkAPI.dispatch(addError(err.message));
            return thunkAPI.rejectWithValue(err.message);
        }
    },
);

// export const fetchOneDocumentAction = createAsyncThunk(
//     "currentEmployee/fetchDocuments",
//     async (data, thunkAPI) => {
//         try {
//             const document = await fetchOneDocument(data);
//             thunkAPI.dispatch(removeError());
//             return document;
//         } catch (err) {
//             thunkAPI.dispatch(addError(err.message));
//             return thunkAPI.rejectWithValue(err.message);
//         }
//     }
// );

export const uploadDocumentAction = createAsyncThunk(
    "currentEmployee/uploadDocument",
    async (data, thunkAPI) => {
        try {
            const uploadedDocument = await uploadDocument(data);
            thunkAPI.dispatch(removeError());
            return uploadedDocument;
        } catch (err) {
            thunkAPI.dispatch(addError(err.message));
            return thunkAPI.rejectWithValue(err.message);
        }
    },
);

export const deleteDocumentAction = createAsyncThunk(
    "currentEmployee/deleteDocuments",
    async (data, thunkAPI) => {
        try {
            const Document = await deleteDocument(data);
            thunkAPI.dispatch(removeError());
            return Document;
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
            state.documents = [];
            state.status = "idle";
            localStorage.removeItem("token");
        },
        setTextInfo: (state, action) => {
            const path = action.payload.name;
            if (path.length === 3) {
                state.employee[path[0]][path[1]][path[2]] = action.payload.content;
            } else if (path.length === 2) {
                state.employee[path[0]][path[1]] = action.payload.content;
            } else if (path.length) {
                state.employee[path[0]] = action.payload.content;
            }
        },
        setOnboardingApplication: (state, action) => {
            state.employee = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Sign in
        builder.addCase(signInEmployee.fulfilled, (state, action) => {
            state.isAuthenticated = !!Object.keys(action.payload).length;
            const { id, username, role, name, documents, feedback } = action.payload;
            state.employee = { id, username, role, name, documents, feedback };
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

        //get employee info
        builder.addCase(fetchEmployeeAction.fulfilled, (state, action) => {
            let dob = action.payload.identification_info.date_of_birth;
            if (dob) {
                dob = new Date(dob).toLocaleString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                });
            }
            action.payload.identification_info.date_of_birth = dob;

            state.employee = action.payload;
            state.documents = action.payload.documents;
            state.status = "successed";
        });
        builder.addCase(fetchEmployeeAction.rejected, (state, action) => {
            state.employee = state.status = "failed";
        });
        builder.addCase(fetchEmployeeAction.pending, (state, action) => {
            state.status = "pending";
        });

        //update employee info
        builder.addCase(updateEmployeeAction.fulfilled, (state, action) => {
            let dob = action.payload.identification_info.date_of_birth;
            if (dob) {
                dob = new Date(dob).toLocaleString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                });
            }
            action.payload.identification_info.date_of_birth = dob;

            state.employee = action.payload;
            state.documents = action.payload.documents;
            state.status = "successed";
        });
        builder.addCase(updateEmployeeAction.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(updateEmployeeAction.pending, (state, action) => {
            state.status = "pending";
        });

        //upload document
        builder.addCase(uploadDocumentAction.fulfilled, (state, action) => {
            state.status = "successed";
        });
        builder.addCase(uploadDocumentAction.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(uploadDocumentAction.pending, (state, action) => {
            state.status = "pending";
        });

        //get docuemnts info
        builder.addCase(fetchDocumentsAction.fulfilled, (state, action) => {
            state.status = "successed";
            state.documents = action.payload;
        });
        builder.addCase(fetchDocumentsAction.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(fetchDocumentsAction.pending, (state, action) => {
            state.status = "pending";
        });

        //remove seleted document
        builder.addCase(deleteDocumentAction.fulfilled, (state, action) => {
            state.status = "successed";
        });
        builder.addCase(deleteDocumentAction.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(deleteDocumentAction.pending, (state, action) => {
            state.status = "pending";
        });

        // //get employee info
        // builder.addCase(updateEmployeePassword.fulfilled, (state, action) => {
        //     state.status = "successed";
        // });
        // builder.addCase(updateEmployeePassword.rejected, (state, action) => {
        //     state.status = "failed";
        // });
        // builder.addCase(updateEmployeePassword.pending, (state, action) => {
        //     state.status = "pending";
        // });
    },
});

export const { setCurrentEmployee, logOut, setTextInfo, setOnboardingApplication } =
    currentEmployeeSlice.actions;
export default currentEmployeeSlice.reducer;
//
