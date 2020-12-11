import React, { useState, useEffect, useContext } from "react";
import "./Cobrar.scss";

import { UserContext } from "../../Store";

import {
  RadioGroup,
  FormControlLabel,
  Button,
  Radio,
  Modal,
  DialogContent,
} from "@material-ui/core";
import Draggable from "react-draggable";

import { db } from "../../index";

function Cobrar(props) {
  const [user] = useContext(UserContext);

  const [total, setTotal] = useState(props.transaccion.total);
  const [pagacon, setPagaCon] = useState("");
  const [cambio, setCambio] = useState("");
  const [porpagar, setPorpagar] = useState(0);
  const [formaDePago, setFormaDePago] = useState("efectivo");
  const [tipoDeTarjeta, setTipoDeTarjeta] = useState("visamastercard");
  const [digitos, setDigitos] = useState("");
  const [autorizacion, setAutorizacion] = useState("");

  const [porPagarColor, setPorPagarColor] = useState("gray");
  const [cambioColor, setCambioColor] = useState("gray");
  const [cambioFontSize, setCambioFontSize] = useState("1em");

  useEffect(() => {
    console.log(pagacon);
    calcular();
  }, [pagacon]);

  const calcular = () => {
    console.log(total);
    console.log(pagacon);
    let ppagar = total - Number(pagacon);
    console.log(ppagar);
    if (ppagar <= 0) {
      setPorpagar(0);
      setPorPagarColor("gray");
    } else {
      setPorpagar(ppagar);
      setPorPagarColor("#f44336");
    }
    let micambio = Number(pagacon) - total;
    if (micambio <= 0) {
      setCambio(0);
      setCambioColor("gray");
      setCambioFontSize("1em");
    } else {
      setCambio(micambio);
      setCambioColor("#2196f3");
      setCambioFontSize("2em");
    }
  };
  const sendNum = (v) => {
    console.log(v);
    if (pagacon === "") {
      if (
        v === "back" ||
        v === "clear" ||
        v === "." ||
        v === "0" ||
        v === "00"
      ) {
        setPagaCon("");
      } else {
        let temp = pagacon + v;
        console.log(temp);
        setPagaCon(temp);
      }
    } else {
      if (v === "back") {
        setPagaCon(pagacon.substring(0, pagacon.length - 1));
      } else {
        if (v === "clear") {
          setPagaCon("");
        } else {
          let temp = pagacon + v;
          console.log(temp);
          setPagaCon(temp);
        }
      }
    }
  };

  const sendTicket = () => {
    console.log("sendTicket");
    let myTime = new Date().getTime();
    console.log({
      ...props.transaccion,
      pagado: myTime,
      ticket: myTime,
      pagacon,
      cambio,
      formaDePago,
      tipoDeTarjeta,
      digitos,
      autorizacion,
      owner: user,
    });
    db.collection("tickets").add({
      ...props.transaccion,
      pagado: myTime,
      ticket: myTime,
      pagacon,
      cambio,
      formaDePago,
      tipoDeTarjeta,
      digitos,
      autorizacion,
      owner: user,
    });
    handleClose();
  };

  const handleClose = () => {
    props.onClose();
  };

  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="form-dialog-name"
      // onRendered={resetProps}
    >
      <Draggable handle=".cobrarC">
        <div className="cobrarC">
          <div className="left">
            <h1>Total a Pagar:</h1>
            <h3 id="total">${total}</h3>
            {pagacon ? (
              <div className="gridCambio">
                <p style={{ color: porPagarColor }}>por pagar:</p>
                <strong style={{ color: porPagarColor }}>{porpagar}</strong>
                <p style={{ color: cambioColor }}>cambio:</p>
                <strong
                  style={{ color: cambioColor, fontSize: cambioFontSize }}>
                  {cambio}
                </strong>
              </div>
            ) : null}
            {formaDePago === "efectivo" && porpagar === 0 ? (
              <button className="cobrar" onClick={() => sendTicket()}>
                Aceptar
              </button>
            ) : null}
            {formaDePago === "tarjeta" && autorizacion !== "" ? (
              <button className="cobrar" onClick={() => sendTicket()}>
                Aceptar
              </button>
            ) : null}
          </div>
          <div className="right">
            <div className="pago">
              <div className="radioFormaDePago">
                <RadioGroup
                  value={formaDePago}
                  className="radioGroupFdP"
                  onChange={(ev) => setFormaDePago(ev.target.value)}>
                  <FormControlLabel
                    value="efectivo"
                    control={<Radio />}
                    label="Efectivo"
                  />
                  <FormControlLabel
                    value="tarjeta"
                    control={<Radio />}
                    label="Tarjeta"
                  />
                </RadioGroup>
              </div>
              {formaDePago === "efectivo" ? (
                <div className="efectivo">
                  <input
                    className="inputKB"
                    autoFocus
                    onChange={
                      (ev) =>
                        setPagaCon(ev.target.value.replace(/[^\d*\.?^\d*]/, ""))
                      // setPagaCon(ev.target.value.replace(/[^\d]/, ""))
                    }
                    value={pagacon}
                  />
                  <div className="KB">
                    <div className="numKB">
                      <div className="num1-9">
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => sendNum("1")}>
                          1
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => sendNum("2")}>
                          2
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => sendNum("3")}>
                          3
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => sendNum("4")}>
                          4
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => sendNum("5")}>
                          5
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => sendNum("6")}>
                          6
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => sendNum("7")}>
                          7
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => sendNum("8")}>
                          8
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => sendNum("9")}>
                          9
                        </Button>
                      </div>
                      <div className="num0-00">
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => sendNum("0")}>
                          0
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => sendNum("00")}>
                          00
                        </Button>
                      </div>
                    </div>
                    <div>
                      <div className="back">
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => sendNum("back")}>
                          <i className="material-icons">keyboard_backspace</i>
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => sendNum("clear")}>
                          <i className="material-icons">clear</i>
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => sendNum(".")}>
                          .
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form>
                  <div className="tarjeta">
                    <ol>
                      <li>Seleccione tipo de tarjeta</li>
                      <RadioGroup
                        className="tipoTarjeta"
                        value={tipoDeTarjeta}
                        onChange={(ev) => setTipoDeTarjeta(ev.target.value)}
                        required>
                        <FormControlLabel
                          value="visamastercard"
                          control={<Radio />}
                          label="Visa / MasterCard"
                        />
                        <FormControlLabel
                          value="amex"
                          control={<Radio />}
                          label="American Express"
                        />
                      </RadioGroup>
                      <li>Ingrese últimos 4 digitos de la tarjeta</li>
                      <div className="digitos">
                        {tipoDeTarjeta === "visamastercard" ? (
                          <p>XXXX-XXXX-XXXX-</p>
                        ) : (
                          <p>XXXX-XXXXXX-X</p>
                        )}
                        <input
                          type="text"
                          name="digitos"
                          value={digitos}
                          onChange={(ev) =>
                            setDigitos(ev.target.value.replace(/[^\d]/, ""))
                          }
                          maxLength={4}
                          placeholder="1234"
                          required
                        />
                      </div>
                      <li>Realice transacción en terminal</li>
                      <p className="espacio">
                        <i className="material-icons">credit_card</i>
                      </p>
                      <li>Ingrese número de autorización</li>
                      <p className="autorizacion">
                        <input
                          type="text"
                          name="autorizacion"
                          value={autorizacion}
                          onChange={(ev) =>
                            setAutorizacion(
                              ev.target.value.replace(/[^\d]/, "")
                            )
                          }
                          maxLength={6}
                          placeholder="123456"
                          required
                        />
                      </p>
                    </ol>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </Draggable>
    </Modal>
  );
}

export default Cobrar;
