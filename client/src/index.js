import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { StyleProvider } from "@ant-design/cssinjs";
import jwtDecode from "jwt-decode";

import "antd/dist/reset.css";
import "./index.css";

import App from "./App";
import store from "app/store";
import { setCurrentEmployee } from "app/employeeSlice";

// Decode the token
if (localStorage.getItem("token")) {
    store.dispatch(setCurrentEmployee(jwtDecode(localStorage.getItem("token"))));
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <StyleProvider hashPriority="low">
            <App />
        </StyleProvider>
    </Provider>,
);
