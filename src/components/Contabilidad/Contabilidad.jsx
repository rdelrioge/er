import React, { useEffect, useState } from "react";
import TablaTickets from "./TablaTickets";

import "./Contabilidad.scss";

import { db } from "../..";
import moment from "moment";

import { Button } from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import MomentUtils from "@date-io/moment";

function Contabilidad() {
  const [inicio, setInicio] = useState(
    moment().startOf("day").subtract(3, "days").valueOf()
  );
  const [final, setFinal] = useState(moment().endOf("day").valueOf());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rango, setRango] = useState("recientes");

  useEffect(() => {
    readData();
  }, []);

  //   useEffect(() => {
  //     console.log(data);
  //     console.log(inicio);
  //     console.log(moment(inicio).format("DD-MM-YY HH:mm"));
  //     console.log(final);
  //     console.log(moment(final).format("DD-MM-YY HH:mm"));
  //   }, [final]);

  useEffect(() => {
    readData();
  }, [rango]);

  useEffect(() => {
    if (data.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [data]);

  const readData = () => {
    console.log(inicio);
    console.log(moment(inicio).format("DD-MM-YY HH:mm"));
    console.log(final);
    console.log(moment(final).format("DD-MM-YY HH:mm"));
    let tempArr = [];
    db.collection("tickets")
      .where("pagado", ">=", inicio)
      .where("pagado", "<=", final)
      .get()
      .then((tickets) => {
        tickets.forEach((ticket) => {
          tempArr.push({
            ...ticket.data(),
          });
        });
        console.log(tempArr);
        setData(tempArr);
      });
  };

  //   BOTONES TIEMPOS
  const handleRango = (ev, rango) => {
    switch (rango) {
      case "hoy":
        getToday();
        setRango(rango);
        break;
      case "ayer":
        getYesterday();
        setRango(rango);
        break;
      case "recientes":
        getRecientes();
        setRango(rango);
        break;
      case "mes":
        getThisMonth();
        setRango(rango);
        break;
      case "mesPasado":
        getMesPasado();
        setRango(rango);
        break;
      case "custom":
        getToday();
        setRango(rango);
        break;
      default:
        break;
    }
  };

  const getToday = () => {
    setInicio(moment().startOf("day").valueOf());
    setFinal(moment().endOf("day").valueOf());
    // readData();
  };
  const getYesterday = () => {
    setInicio(moment().startOf("day").subtract(1, "days").valueOf());
    setFinal(moment().endOf("day").subtract(1, "days").valueOf());
    // readData();
  };
  const getRecientes = () => {
    setInicio(moment().startOf("day").subtract(3, "days").valueOf());
    setFinal(moment().endOf("day").valueOf());
    // readData();
  };
  const getThisMonth = () => {
    setInicio(moment().startOf("month").valueOf());
    setFinal(moment().endOf("day").valueOf());
    // readData();
  };
  const getMesPasado = () => {
    setInicio(moment().startOf("month").subtract(1, "months").valueOf());
    setFinal(moment().endOf("month").subtract(1, "months").valueOf());
    // readData();
  };

  return (
    <div className="contabilidadC">
      <div>
        <h1>Selecciones</h1>
        <ToggleButtonGroup
          value={rango}
          exclusive
          onChange={handleRango}
          aria-label="Rango de tiempo">
          <ToggleButton value="hoy" aria-label="left aligned">
            <span>Hoy</span>
          </ToggleButton>
          <ToggleButton value="ayer" aria-label="centered">
            <span>Ayer</span>
          </ToggleButton>
          <ToggleButton value="recientes" aria-label="right aligned">
            <span>Recientes (4 días)</span>
          </ToggleButton>
          <ToggleButton value="mes" aria-label="justified">
            <span>Este mes</span>
          </ToggleButton>
          <ToggleButton value="mesPasado" aria-label="justified">
            <span>Mes pasado</span>
          </ToggleButton>
          <ToggleButton value="custom" aria-label="justified">
            <span>Otra fecha</span>
          </ToggleButton>
        </ToggleButtonGroup>
        {rango === "custom" ? (
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              autoOk
              inputVariant="outlined"
              label="Inicio"
              size="small"
              value={inicio}
              onChange={(ev) => setInicio(ev.valueOf())}
            />
            <DatePicker
              autoOk
              inputVariant="outlined"
              label="Final"
              size="small"
              value={final}
              onChange={(ev) => setFinal(ev.valueOf())}
            />
          </MuiPickersUtilsProvider>
        ) : null}
      </div>
      <div>
        <h2>Cuadros de datos</h2>
      </div>
      {loading ? <span>No data</span> : <TablaTickets rows={data} />}
      <span>
        <h3>Graficas</h3>
      </span>
    </div>
  );
}

export default Contabilidad;
