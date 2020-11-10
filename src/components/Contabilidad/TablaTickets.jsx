import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  TableSortLabel,
  Paper,
} from "@material-ui/core";
import moment from "moment";

function TablaTickets(props) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState(props.rows);

  const colores = ["", "#00bcd4", "#FFC107", "#4caf50", "#e91e63"];

  //   UTILS
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  // TABLE HEAD
  function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const headCells = [
      {
        id: "ticketNo",
        label: "No de Ticket",
        sortDisabled: false,
      },
      { id: "fecha", label: "Fecha de pago", sortDisabled: false },
      { id: "nombre", label: "Nombre", sortDisabled: false },
      { id: "estudios", label: "Estudio(s)", sortDisabled: true },
      { id: "precioEstudio", label: "Precio", sortDisabled: true },
      {
        id: "fechaEstudios",
        label: "Fecha de estudio(s)",
        sortDisabled: false,
      },
      {
        id: "metodoDePago",
        label: "Metodo de pago",
        sortDisabled: true,
      },
      {
        id: "total",
        label: "Total",
        sortDisabled: true,
      },
    ];

    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={"center"}
              sortDirection={orderBy === headCell.id ? order : false}>
              <TableSortLabel
                active={orderBy === headCell.id}
                disabled={headCell.sortDisabled}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}>
                {headCell.label}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  //   TABLE
  return (
    <div className="tablaTicketsC">
      <Paper>
        <TableContainer>
          <Table
            aria-labelledby="tableTitle"
            size="small"
            stickyHeader
            aria-label="enhanced table">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover key={index}>
                      <TableCell align={"center"}>{row.pagado}</TableCell>
                      <TableCell align={"center"}>
                        {moment(row.pagado).format("DD-MMM-YY HH:mm")}
                      </TableCell>
                      <TableCell align={"center"}>{row.nombre}</TableCell>
                      <TableCell align={"center"}>
                        {row.estudios.map((estudio, ind) => {
                          return (
                            <li
                              key={ind}
                              style={{
                                color: colores[estudio.resourceId],
                              }}>
                              {estudio.sala}
                            </li>
                          );
                        })}
                      </TableCell>
                      <TableCell align={"center"}>
                        {row.estudios.map((estudio, ind) => {
                          return (
                            <li
                              key={ind}
                              style={{
                                color: colores[estudio.resourceId],
                              }}>
                              {estudio.precio}
                            </li>
                          );
                        })}
                      </TableCell>
                      <TableCell align={"center"}>
                        {moment(row.start).format("DD-MMM-YY")}
                      </TableCell>
                      <TableCell align={"center"}>{row.formaDePago}</TableCell>
                      <TableCell align={"center"}>{row.total}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          labelRowsPerPage={"Filas por pagina"}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default TablaTickets;
