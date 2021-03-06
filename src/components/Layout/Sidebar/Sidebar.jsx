import React from "react";
import { NavLink } from "react-router-dom";
import firebase from "firebase/app";

import "./Sidebar.scss";
import variables from "../../../index.scss";

const Sidebar = () => {
  const logout = () => {
    firebase.auth().signOut();
    console.log("logout");
  };

  return (
    <ul>
      <NavLink
        className="li"
        exact
        to="/"
        activeStyle={{ color: variables.primary }}>
        <i className="material-icons">point_of_sale</i>
        <span>Venta</span>
      </NavLink>
      <NavLink
        className="li"
        to="/agenda"
        activeStyle={{ color: variables.primary }}>
        <i className="material-icons">event</i>
        <span>Agenda</span>
      </NavLink>
      <NavLink
        className="li"
        to="/patients"
        activeStyle={{ color: variables.primary }}>
        <i className="material-icons">people</i>
        <span>Patients</span>
      </NavLink>
      <NavLink
        className="li"
        to="/admindb"
        activeStyle={{ color: variables.primary }}>
        <i className="material-icons">receipt</i>
        <span>Contabilidad</span>
      </NavLink>
      <span className="spacer" />
      <div className="li" onClick={logout}>
        <i className="material-icons">exit_to_app</i>
        <span>Logout</span>
      </div>
    </ul>
  );
};

export default Sidebar;
