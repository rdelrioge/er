import React, { useState, useEffect } from "react";

import { db } from "../../index";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import Event from "./Event";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const Calendario = () => {
  const [events, setEvents] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [actualEvent, setActualEvent] = useState(null);
  const [view, setView] = useState("week");
  const [currentDate, setCurrentDate] = useState(moment());

  useEffect(() => {
    getRangeOfTimeAndEvents(currentDate);
  }, [view]);

  const openCreateModal = (ev) => {
    console.log(ev);
    setActualEvent({
      start: ev.start,
      end: ev.end,
      title: "",
      resourceId: ev.resourceId,
    });
    setOpenCreate(true);
  };
  const createEvent = (event) => {
    console.log(event);
    setOpenCreate(false);
    if (event.ready) {
      let newEvent = {
        title: event.patient.name,
        start: event.start,
        startTS: moment(event.start).local().valueOf(),
        end: event.end,
        patientid: event.patient.uid,
        dia: moment(event.start).format("YYYY-MM-DD"),
        resourceId: event.resourceId,
      };
      db.collection("events")
        .add(newEvent)
        .catch((err) => console.log("Error addign event: ", err));
    }
  };

  const openEditModal = (ev) => {
    setActualEvent(ev);
    setOpenEdit(true);
  };

  const closeEditModal = (event) => {
    setOpenEdit(false);
    if (event.ready || event.remove) {
      if (event.remove) {
        deleteEvent(actualEvent);
      } else {
        editEvent({
          event: actualEvent,
          start: event.start,
          end: event.end,
        });
      }
    }
  };

  const editEvent = ({ event, start, end }) => {
    let newEvent = { ...event, start, end };
    db.collection("events")
      .doc(event.uid)
      .update(newEvent)
      .catch((err) => console.error("Error updating event: ", err));
  };

  const deleteEvent = (event) => {
    db.collection("events")
      .doc(event.uid)
      .delete()
      .catch((err) => console.error("Error removing event: ", err));
  };

  const showView = (actualView) => {
    setView(actualView);
  };

  const getRangeOfTimeAndEvents = (date) => {
    setCurrentDate(date);
    let start, end;
    if (view === "day") {
      start = moment(date).startOf("day");
      end = moment(date).endOf("day");
    } else if (view === "week") {
      start = moment(date).startOf("week");
      end = moment(date).endOf("week");
    } else if (view === "month") {
      start = moment(date).startOf("month").subtract(6, "days");
      end = moment(date).endOf("month").add(6, "days");
    } else if (view === "agenda") {
      start = moment(date).startOf("day");
      end = moment(date).endOf("day").add(1, "month");
    }
    let inicio = moment(start).local().valueOf();
    let final = moment(end).local().valueOf();
    db.collection("events")
      .where("startTS", ">=", inicio)
      .where("startTS", "<=", final)
      .onSnapshot((data) => {
        let myEvents = [];
        let counter = 0;
        let datalength = data.size;
        data.forEach((ev) => {
          let calStart = new Date(ev.data().start.toMillis());
          let calEnd = new Date(ev.data().end.toMillis());
          let patid = ev.data().patientid;
          db.collection("patients")
            .doc(patid)
            .get()
            .then((pat) => {
              let evn = {
                ...ev.data(),
                start: calStart,
                end: calEnd,
                uid: ev.id,
                title: pat.data().name,
              };
              myEvents.push(evn);
              counter++;
              console.log("read DB");
              if (counter === datalength) {
                console.log(myEvents);
                setEvents(myEvents);
              }
            });
        });
      });
  };

  const resourceMap = [
    { resourceId: 1, sala: "Tomografia", abr: "TAC", color: "#00bcd4" },
    { resourceId: 2, sala: "Rayos X", abr: "RX", color: "#f44336" },
    { resourceId: 3, sala: "Ultrasonido", abr: "UL", color: "#4caf50" },
    { resourceId: 4, sala: "Mastografia", abr: "XM", color: "#e91e63" },
  ];

  return (
    <>
      <div>
        <DragAndDropCalendar
          selectable
          localizer={localizer}
          events={events}
          length={3}
          onEventDrop={editEvent}
          onSelectSlot={openCreateModal}
          onSelectEvent={openEditModal}
          onView={showView}
          onNavigate={getRangeOfTimeAndEvents}
          defaultView={view}
          resources={view === "week" ? null : resourceMap}
          resourceIdAccessor="resourceId"
          resourceTitleAccessor="sala"
          step={30}
          messages={{
            previous: "<",
            next: ">",
            noEventsInRange:
              "Sin pacientes agendados para este rango de fechas",
          }}
          timeslots={2}
          min={new Date("2019, 1, 1, 08:00")}
          max={new Date("2019, 1, 1, 20:00")}
          style={{ height: "72vh" }}
          components={{
            // event: (ev) => (
            //   <span>
            //     {/* <b>
            //       {ev.event.resourceId
            //         ? `${resourceMap[ev.event.resourceId - 1].abr}: `
            //         : null}
            //     </b> */}
            //     {ev.title}
            //   </span>
            // ),
            agenda: {
              event: (ev) => (
                <>
                  {ev.event.resourceId ? (
                    <span
                      style={{
                        color: resourceMap[ev.event.resourceId - 1].color,
                        backgroundColor: "none",
                      }}
                    >
                      {`${ev.title} - ${
                        resourceMap[ev.event.resourceId - 1].sala
                      }`}
                    </span>
                  ) : (
                    <span>{ev.title}</span>
                  )}
                </>
              ),
            },
          }}
          eventPropGetter={(event) => {
            if (event.resourceId === 1 && view !== "agenda") {
              return {
                style: {
                  backgroundColor: resourceMap[event.resourceId - 1].color,
                },
              };
            }
            if (event.resourceId === 2 && view !== "agenda") {
              return {
                style: {
                  backgroundColor: resourceMap[event.resourceId - 1].color,
                },
              };
            }
            if (event.resourceId === 3 && view !== "agenda") {
              return {
                style: {
                  backgroundColor: resourceMap[event.resourceId - 1].color,
                },
              };
            }
            if (event.resourceId === 4 && view !== "agenda") {
              return {
                style: {
                  backgroundColor: resourceMap[event.resourceId - 1].color,
                },
              };
            }
          }}
        />
        {view !== "day" && view !== "agenda" ? (
          <div className="leyenda">
            {resourceMap.map((sala) => {
              return (
                <b key={sala.resourceId} style={{ color: sala.color }}>
                  {sala.sala}
                </b>
              );
            })}
          </div>
        ) : null}
        {openCreate ? (
          <div>
            <Event
              title="New appointment"
              ready={false}
              remove={false}
              delbtn={false}
              open={openCreate}
              event={actualEvent}
              onClose={createEvent}
            />
          </div>
        ) : openEdit ? (
          <div>
            <Event
              title="Edit appointment"
              ready={false}
              remove={false}
              delbtn={true}
              open={openEdit}
              event={actualEvent}
              onClose={closeEditModal}
            />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Calendario;
