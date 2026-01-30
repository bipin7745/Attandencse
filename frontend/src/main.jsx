import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import{store} from "./store/store.js";
import Footer from "./layout/Footer.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
       <ToastContainer position="top-center"/>
      <App />
      <Footer/>
    </BrowserRouter>
  </Provider>
);
