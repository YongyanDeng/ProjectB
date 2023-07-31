import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "./employeeSlice";
import errorReducer from "./errorSlice";
import hrReducer from "./hrSlice";

export default configureStore({
    reducer: {
        employee: employeeReducer,
        error: errorReducer,
        hr: hrReducer,
    },
    devTools: true,
});
