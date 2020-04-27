import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import AuthApi from "../AuthApi";

export default class dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      welcomeMessage: localStorage.getItem("welcome"),
      userList: [],
    };
  }

  static contextType = AuthApi;

  componentDidMount() {
    axios
      .get("http://localhost:5300/api/users")
      .then((res) => {
        this.setState({
          userList: res.data,
        });
      })
      .catch((err) => console.log(err));
  }

  logout = (e) => {
    e.preventDefault();
    const Auth = this.context;
    axios
      .get("http://localhost:5301/api/auth/logout")
      .then((res) => {
        console.log("logout: ", res);
        Auth.setAuth(false);
        // Cookies.remove("user");
        localStorage.setItem("logoutMessage", res.data);
        this.props.history.push("/");
      })
      .catch((err) => console.log("logout", err));
  };
  render() {
    return (
      <div>
        <section className="dashboard-header">
          <h1 className="heading-primary">{this.state.welcomeMessage}</h1>
          <nav className="nabBar">
            <Link className="nabBar__item" to="/dashboard">
              View All Users
            </Link>
            <span onClick={this.logout} className="btn-logout nabBar__item">
              Logout
            </span>
          </nav>
        </section>
        <section className="content">
          <h2 className="heading-secondary">
            {this.state.userList.length} Users Found
          </h2>
          <div className="content__container">
            {this.state.userList.map((user) => {
              return (
                <p key={user.id} className="content__item">
                  {user.username}
                </p>
              );
            })}
          </div>
        </section>
      </div>
    );
  }
}
