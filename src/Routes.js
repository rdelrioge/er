import Agenda from "./components/Agenda/Agenda";
import Patients from "./components/Patients/Patients";
import PatientProfile from "./components/Patients/PatientProfile/PatientProfile";
import Venta from "./components/Venta/Venta";

const routes = [
  {
    path: "/",
    component: Venta,
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
    path: "/agenda",
    component: Agenda,
  },
];

export default routes;
