import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import logo from "./logo.svg";

import AuthApi from "./AuthApi";

import Login from "./components/login";
import Dashboard from "./components/dashboard";
import Register from "./components/register";

function App() {
  const [auth, setAuth] = useState(false);

  const readCookie = () => {
    const user = Cookies.get("user");
    if (user) {
      setAuth(true);
    }
  };

  React.useEffect(() => {
    readCookie();
  }, []);

  return (
    <div className="App ">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Node Auth-1 Project</p>
      </header>
      <main className="container">
        <AuthApi.Provider value={{ auth, setAuth }}>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </AuthApi.Provider>
      </main>
    </div>
  );
}

const Routes = () => {
  const Auth = React.useContext(AuthApi);
  return (
    <Switch>
      <ProtectedLogin
        exact
        path="/"
        component={Login}
        auth={Auth.auth}
        setAuth={Auth.setAuth}
      />
      <Route exact path="/register" component={Register} />
      <ProtectedRoute
        exact
        path="/dashboard"
        auth={Auth.auth}
        component={Dashboard}
      />
    </Switch>
  );
};

const ProtectedRoute = ({ auth, component: Component, ...rest }) => {
  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

const ProtectedLogin = ({ setAuth, auth, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        !auth ? (
          <Component myAuth={setAuth} {...props} />
        ) : (
          <Redirect to="/dashboard" />
        )
      }
    />
  );
};

export default App;

// auth ? <Component {...props} /> : <Redirect to="/" />
