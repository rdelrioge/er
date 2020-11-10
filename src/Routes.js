import Agenda from "./components/Agenda/Agenda";
import Patients from "./components/Patients/Patients";
import PatientProfile from "./components/Patients/PatientProfile/PatientProfile";
import Venta from "./components/Venta/Venta";
import Contabilidad from "./components/Contabilidad/Contabilidad";

const routes = [
  {
    path: "/",
    component: Venta,
  },
  {
    path: "/agenda",
    component: Agenda,
  },
  {
    path: "/patients",
    component: Patients,
  },
  {
    path: "/patient/:uid",
    component: PatientProfile,
  },
  {
    path: "/admindb",
    component: Contabilidad,
  },
];

export default routes;
