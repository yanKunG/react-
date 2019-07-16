import React from "react";
import "./App.css";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import Login from "./Login";
import axios from "axios";
import AuthCheck from "./AuthCheck"
import Main from './module/Main.js';


axios.defaults.baseURL = "http://47.96.21.88:8086/";
axios.interceptors.request.use(function(config) {
  if (!config.url.endsWith("/login")) {
    config.headers.Authorization = sessionStorage.getItem("mytoken");
  }
  return config;
});
axios.interceptors.response.use(function(res) {
  return res.data;
});

function Hello() {
  return <div>hello</div>
}
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/home" component={Main} />
        <Redirect from="/" to="/login" />
        <AuthCheck path="/hello" component={Hello}></AuthCheck>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
