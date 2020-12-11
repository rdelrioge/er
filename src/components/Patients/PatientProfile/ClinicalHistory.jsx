import React, { useState, useEffect } from "react";

// Material
import {
  TextField,
  InputLabel,
  OutlinedInput,
  MenuItem,
  FormControl,
  Select,
  InputAdornment,
  DialogTitle,
  DialogContent,
  Button,
  Dialog,
  Zoom,
  Slide,
} from "@material-ui/core";

import Draggable from "react-draggable";

function ClinicalHistory(props) {
  const [patient, setPatient] = useState(props.patient);

  useEffect(() => {
    setPatient(props.patient);
  }, [props]);

  const handlePersonalData = () => {
    props.patRef.update({
      ...patient,
      edited: new Date(),
      editedBy: props.user,
    });
    handleClose();
  };

  const handleClose = () => {
    props.onClose();
  };

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="form-dialog-name"
      TransitionComponent={Slide}
      TransitionProps={{ direction: "down" }}>
      <Draggable handle=".header">
        <div className="clinicalHistoryModal">
          <div className="header">
            <DialogTitle id="form-dialog-name">
              Historia Clínica
              <Button
                variant="contained"
                color="primary"
                onClick={handlePersonalData}>
                Guardar
              </Button>
            </DialogTitle>
          </div>
          <DialogContent className="sectionContent">
            <div className="row0">
              <TextField
                label="Peso"
                variant="outlined"
                autoFocus
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">Kg</InputAdornment>
                  ),
                }}
                value={patient.weight ? patient.weight : ""}
                onChange={(e) =>
                  setPatient({ ...patient, weight: e.target.value })
                }
              />
              <TextField
                label="Estatura"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">cms</InputAdornment>
                  ),
                }}
                value={patient.height ? patient.height : ""}
                onChange={(e) =>
                  setPatient({ ...patient, height: e.target.value })
                }
              />
              <FormControl variant="outlined">
                <InputLabel htmlFor="bloodGroup">Tipo de sangre</InputLabel>
                <Select
                  value={patient.bloodGroup ? patient.bloodGroup : ""}
                  onChange={(e) =>
                    setPatient({ ...patient, bloodGroup: e.target.value })
                  }
                  input={
                    <OutlinedInput
                      labelWidth={80}
                      name="bloodGroup"
                      id="bloodGroup"
                    />
                  }>
                  <MenuItem value="">
                    <em>Unknown</em>
                  </MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="A+">B+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                </Select>
              </FormControl>
            </div>
            <TextField
              label="Alergias"
              variant="outlined"
              multiline
              rows="4"
              value={patient.allergies ? patient.allergies : ""}
              onChange={(e) =>
                setPatient({ ...patient, allergies: e.target.value })
              }
            />
            <TextField
              label="Medicamentos"
              variant="outlined"
              multiline
              rows="4"
              value={patient.medications ? patient.medications : ""}
              onChange={(e) =>
                setPatient({ ...patient, medications: e.target.value })
              }
            />

            <TextField
              label="Enfermedades congénitas"
              variant="outlined"
              multiline
              rows="4"
              value={patient.disorders ? patient.disorders : ""}
              onChange={(e) =>
                setPatient({ ...patient, disorders: e.target.value })
              }
            />
            <TextField
              label="Notas"
              variant="outlined"
              multiline
              rows="4"
              value={patient.notes ? patient.notes : ""}
              onChange={(e) =>
                setPatient({ ...patient, notes: e.target.value })
              }
            />
          </DialogContent>
        </div>
      </Draggable>
    </Dialog>
  );
}

export default ClinicalHistory;
