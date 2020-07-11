import React from "react";

import Calendario from "./Calendar";

import "./Agenda.scss";

const Agenda = () => {
  return (
    <div className="agenda">
      <h1>Agenda</h1>
      <div className="calendar">
        <Calendario />
      </div>
    </div>
  );
};

export default Agenda;
