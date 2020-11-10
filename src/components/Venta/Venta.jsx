import React, { useEffect, useState } from "react";
import ReactWeather from "react-open-weather";
import "react-open-weather/lib/css/ReactWeather.css";

import Cobrar from "./Cobrar";
import "./Venta.scss";

import moment from "moment";
import defaultPPM from "../../assets/ppm.png";
import defaultPPF from "../../assets/ppf.png";
import defaultPPO from "../../assets/ppo.png";
import nothingYet from "../../assets/nothingyet.png";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent,
} from "@material-ui/core";

import Clock from "./Clock";
import { db } from "../../index";

function Venta() {
  const [diaMes, setDiaMes] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  // const [monthCount, setMonthCount] = useState(0);

  const [pagados, setPagados] = useState([]);
  const [transacciones, setTransacciones] = useState([]);

  const [expanded, setExpanded] = useState(false);
  const [expandedP, setExpandedP] = useState(false);
  const [cobrarModal, setCobrarModal] = useState(false);
  const [transaccion, setTransaccion] = useState(null);

  const salas = ["", "Tomografia", "Rayos X", "Ultrasonido", "Mastografía"];
  const precios = ["", 500, 400, 300, 200];
  const colores = ["", "#00bcd4", "#FFC107", "#4caf50", "#e91e63"];

  // Al iniciar buscar en la DB los eventos de hoy
  // Despues si hay eventos (eventos.lenght > 0) agrupar por paciente y calcular total
  useEffect(() => {
    getPagadosHoy();
    getTodayCount();
    getDiaMes();
  }, []);

  useEffect(() => {
    getEventosHoy();
  }, [pagados]);

  const getPagadosHoy = () => {
    let start = new Date();
    let inicio = moment(start).startOf("day").local().valueOf();
    let final = moment(start).endOf("day").local().valueOf();
    // buscar que paciente ya pagó hoy
    db.collection("tickets")
      .where("start", ">=", inicio)
      .where("start", "<=", final)
      .onSnapshot((mistickets) => {
        let patientsWhoPaid = [];
        let contador = 0;
        let mistickersLenght = mistickets.size;
        if (mistickersLenght > 0) {
          mistickets.forEach((ticket) => {
            patientsWhoPaid.push(ticket.data());
            contador++;
            if (contador === mistickersLenght) {
              setPagados(patientsWhoPaid);
            }
          });
        } else {
          getEventosHoy();
        }
      });
  };

  const getEventosHoy = () => {
    let start = new Date();
    let inicio = moment(start).startOf("day").local().valueOf();
    let final = moment(start).endOf("day").local().valueOf();
    db.collection("events")
      .where("startTS", ">=", inicio)
      .where("startTS", "<=", final)
      .onSnapshot((data) => {
        let myEvents = [];
        let counter = 0;
        let datalength = data.size;
        data.forEach((ev) => {
          let patid = ev.data().patientid;
          db.collection("patients")
            .doc(patid)
            .get()
            .then((pat) => {
              let evn = {
                startTS: ev.data().startTS,
                resourceId: ev.data().resourceId,
                patientid: patid,
                title: pat.data().name,
                gender: pat.data().gender,
                uid: ev.id,
              };
              myEvents.push(evn);
              counter++;
              if (counter === datalength) {
                organizarEventosEnPacientes(myEvents);
              }
            });
        });
      });
  };

  const organizarEventosEnPacientes = (evs) => {
    if (evs.length > 0) {
      // Separar cuantos pacientes
      let pats = [evs[0].patientid];
      for (let i = 1; i < evs.length; i++) {
        if (evs[i - 1].patientid !== evs[i].patientid) {
          pats.push(evs[i].patientid);
        }
      }
      // Separar los estudios de cada paciente
      let arrTemp = [];
      for (let j = 0; j < pats.length; j++) {
        let estudios = [];
        let name = "";
        let gender;
        for (let i = 0; i < evs.length; i++) {
          if (evs[i].patientid === pats[j]) {
            estudios.push({
              sala: salas[evs[i].resourceId],
              resourceId: evs[i].resourceId,
              startTS: evs[i].startTS,
              uid: evs[i].uid,
              precio: precios[evs[i].resourceId],
            });
            name = evs[i].title;
            gender = evs[i].gender;
          }
        }
        let total = 0;
        for (let i = 0; i < estudios.length; i++) {
          total = total + estudios[i].precio;
        }
        arrTemp.push({
          nombre: name,
          patientid: pats[j],
          estudios: estudios,
          start: estudios[0].startTS,
          total: total,
          gender: gender,
        });
      }

      // hacer la comparacion
      if (pagados.length > 0) {
        let misPendientes = [];
        for (let i = 0; i < arrTemp.length; i++) {
          let igual = false;
          for (let j = 0; j < pagados.length && !igual; j++) {
            console.warn(`i: ${i} y j: ${j}`);
            if (arrTemp[i].patientid === pagados[j].patientid) {
              igual = true;
            }
          }
          if (!igual) misPendientes.push(arrTemp[i]);
        }
        setTransacciones(misPendientes);
      } else {
        setTransacciones(arrTemp);
      }
    }
  };

  const getTodayCount = () => {
    let hoy = new Date();
    let inicio = moment(hoy).startOf("day").local().valueOf();
    let final = moment(hoy).endOf("day").local().valueOf();
    db.collection("events")
      .where("startTS", ">=", inicio)
      .where("startTS", "<=", final)
      .get()
      .then(async (data) => {
        for (let i = 0; i <= data.size; i++) {
          setTodayCount(i);
          await sleep(50);
        }
      });
  };

  const getDiaMes = async () => {
    for (let i = 0; i <= new Date().getDate(); i++) {
      setDiaMes(i);
      await sleep(100);
    }
  };

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const handleChange = (panel) => (evnt, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const handleChangePagados = (panel) => (evnt, isExpanded) => {
    setExpandedP(isExpanded ? panel : false);
  };

  const calcToNow = (time) => {
    let ahora = new Date();
    if (time > ahora.getTime()) {
      return <b>{moment(time).fromNow()}</b>;
    }
    if (time < ahora.getTime()) {
      return <b>{moment(time).toNow()}</b>;
    }
  };

  const openCobrarM = (transaccion) => {
    setTransaccion(transaccion);
    setCobrarModal(true);
  };

  return (
    <div className="pointOfSales">
      <h1>Dashboard</h1>
      <div className="grid">
        <div className="left">
          {transacciones.length > 0 ? (
            <div className="divider">
              <span></span>
              <b>Pendientes</b>
              <span></span>
            </div>
          ) : pagados.length > 0 ? null : (
            <div className="sinEstudios">
              <img src={nothingYet} alt="nothingYetImg" />
              <h1>No hay estudios el día de hoy</h1>
            </div>
          )}
          {transacciones &&
            transacciones.map((evnt, i) => (
              <Accordion
                expanded={expanded === i}
                onChange={handleChange(i)}
                key={i}
                className="acordion">
                <AccordionSummary
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  className="acordionHeader">
                  <div className="acordionHeaderContent">
                    <div className="tiempoCita">
                      <span>{moment(evnt.start).format("HH:mm")}</span>
                      {calcToNow(evnt.start)}
                    </div>
                    <div className="nombreCita">
                      <img
                        src={
                          evnt.gender === "M"
                            ? defaultPPM
                            : evnt.gender === "F"
                            ? defaultPPF
                            : defaultPPO
                        }
                        alt="PP"
                      />
                      <span>{evnt.nombre}</span>
                    </div>
                    <span className="estudiosLength">
                      {evnt.estudios.length}
                      {evnt.estudios.length > 1 ? " estudios" : " estudio"}
                    </span>
                    <i className="material-icons pending">pending_actions</i>
                  </div>
                </AccordionSummary>
                <AccordionDetails className="acordionDetails">
                  <div className="acordionDetailsGrid">
                    {evnt.estudios.map((estudio, j) => (
                      <li
                        className="estudio"
                        key={j}
                        style={{
                          borderLeftColor: colores[estudio.resourceId],
                        }}>
                        <span>{moment(estudio.startTS).format("HH:mm")}</span>
                        <span>{estudio.sala}</span>
                        <span>${precios[estudio.resourceId]}</span>
                      </li>
                    ))}
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    className="cobrarBtn"
                    onClick={() => openCobrarM(evnt)}>
                    Cobrar
                  </Button>
                </AccordionDetails>
              </Accordion>
            ))}

          <div className="pagados">
            {/* ========== PAGADOS ========*/}
            {pagados.length > 0 ? (
              <div className="divider">
                <span></span>
                <b>Pagados</b>
                <span></span>
              </div>
            ) : null}
            {pagados &&
              pagados.map((evntP, i) => (
                <Accordion
                  expanded={expandedP === i}
                  onChange={handleChangePagados(i)}
                  key={i}
                  className="acordion">
                  <AccordionSummary
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    className="acordionHeader">
                    <div className="acordionHeaderContent">
                      <div className="tiempoCita">
                        <span>{moment(evntP.start).format("HH:mm")}</span>
                        {calcToNow(evntP.start)}
                      </div>
                      <div className="nombreCita">
                        <img
                          src={
                            evntP.gender === "M"
                              ? defaultPPM
                              : evntP.gender === "F"
                              ? defaultPPF
                              : defaultPPO
                          }
                          alt="PP"
                        />
                        <span>{evntP.nombre}</span>
                      </div>
                      <span className="estudiosLength">
                        {evntP.estudios.length}
                        {evntP.estudios.length > 1 ? " estudios" : " estudio"}
                      </span>
                      <i className="material-icons check">
                        check_circle_outline
                      </i>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails className="acordionDetails acordionDetailsP">
                    <div className="acordionDetailsGrid">
                      {evntP.estudios.map((estudio, j) => (
                        <li
                          className="estudio"
                          key={j}
                          style={{
                            borderLeftColor: colores[estudio.resourceId],
                          }}>
                          <span>{moment(estudio.startTS).format("HH:mm")}</span>
                          <span>{estudio.sala}</span>
                          <span>completo</span>
                        </li>
                      ))}
                    </div>
                  </AccordionDetails>
                </Accordion>
              ))}
          </div>
        </div>
        <div className="right">
          <div className="rightSuperior">
            <Card className="cardCount">
              <CardContent className="cardContentCount">
                <b>{todayCount}</b>
                <span>Estudios hoy</span>
              </CardContent>
            </Card>
            <Card className="cardCount">
              <CardContent className="cardContentCount">
                <b className="dia">{diaMes}</b>
                <span className="mes">{moment().format("MMMM")}</span>
                <h1>
                  <Clock />
                </h1>
              </CardContent>
            </Card>
          </div>
          <div className="rightInf">
            <ReactWeather
              forecast="5days"
              apikey="4d86a2006f4a10d56dbdde6d7ec8f48e"
              type="geo"
              lat="25.671"
              lon="-100.309"
              lang="es"
            />
          </div>
        </div>
      </div>

      {cobrarModal ? (
        <Cobrar
          transaccion={transaccion}
          open={cobrarModal}
          onClose={() => {
            setCobrarModal(false);
            getEventosHoy();
          }}
        />
      ) : null}
    </div>
  );
}

export default Venta;
