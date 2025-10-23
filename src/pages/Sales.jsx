import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import Swal from "sweetalert2";
import FormDialog from "../components/FormDialog";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [formData, setFormData] = useState({
    product: "",
    requestedAmount: "",
    franchise: "",
    rate: "",
  });

  const fetchSales = async () => {
    try {
      const res = await api.get("/sales");
      const data = res.data || {};
      setSales(data.sales || []);
      setTotalAmount(data.totalCupo || 0);
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "No se pudieron cargar las ventas", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleOpen = (sale = null) => {
    setEditingSale(sale);
    setFormData(
      sale
        ? {
            product: sale.product,
            requestedAmount: sale.requestedAmount,
            franchise: sale.franchise || "",
            rate: sale.rate || "",
          }
        : { product: "", requestedAmount: "", franchise: "", rate: "" }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSale(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingSale) {
        await api.put(`/sales/${editingSale.id}`, formData);
        Swal.fire("Actualizado", "Venta actualizada con éxito", "success");
      } else {
        await api.post("/sales", formData);
        Swal.fire("Creada", "Venta registrada correctamente", "success");
      }
      handleClose();
      fetchSales();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Error al guardar",
        "error"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar venta?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });
    if (confirm.isConfirmed) {
      await api.delete(`/sales/${id}`);
      Swal.fire("Eliminada", "Venta eliminada correctamente", "success");
      fetchSales();
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Ventas Registradas
      </Typography>

      {loading ? (
        <Typography>Cargando ventas...</Typography>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              mr: 2,
            }}
          >
            <Typography sx={{ mb: 2 }}>
              <strong>Total cupo solicitado:</strong> $
              {totalAmount.toLocaleString("es-CO")}
            </Typography>

            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{ mb: 2 }}
              onClick={() => handleOpen()}
            >
              Radicar Venta
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Producto</TableCell>
                  <TableCell>Cupo Solicitado</TableCell>
                  <TableCell>Franquicia</TableCell>
                  <TableCell>Tasa</TableCell>
                  <TableCell>Fecha de Creación</TableCell>
                  <TableCell>Creado Por</TableCell>
                  <TableCell>Última Actualización</TableCell> {/* Nuevo */}
                  <TableCell>Actualizado Por</TableCell> {/* Nuevo */}
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sales.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.id}</TableCell>
                    <TableCell>{s.product}</TableCell>
                    <TableCell>${s.requestedAmount}</TableCell>
                    <TableCell>{s.franchise || "-"}</TableCell>
                    <TableCell>{s.rate ? `${s.rate}%` : "-"}</TableCell>
                    <TableCell>
                      {s.createdAt
                        ? new Date(s.createdAt).toLocaleString("es-CO")
                        : "Sin fecha"}
                    </TableCell>
                    <TableCell>
                      {s.createdBy?.name || s.userCreatedId}
                    </TableCell>
                    <TableCell>
                      {s.updatedAt
                        ? new Date(s.updatedAt).toLocaleString("es-CO")
                        : "Sin fecha"}
                    </TableCell>
                    <TableCell>
                      {s.updatedBy?.name || s.userUpdatedId}
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpen(s)}>
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(s.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <FormDialog
        open={open}
        onClose={handleClose}
        title={editingSale ? "Editar Venta" : "Registrar Venta"}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Producto"
          name="product"
          select
          fullWidth
          margin="normal"
          value={formData.product}
          onChange={handleChange}
        >
          <MenuItem value="Credito de Consumo">Credito de Consumo</MenuItem>
          <MenuItem value="Libranza Libre Inversión">
            Libranza Libre Inversión
          </MenuItem>
          <MenuItem value="Tarjeta de Credito">Tarjeta de Credito</MenuItem>
        </TextField>

        <TextField
          label="Monto Solicitado"
          name="requestedAmount"
          fullWidth
          margin="normal"
          value={formData.requestedAmount}
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, "");
            value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            setFormData({ ...formData, requestedAmount: value });
          }}
          inputProps={{ inputMode: "numeric" }}
        />

        {formData.product === "Tarjeta de Credito" && (
          <TextField
            label="Franquicia"
            name="franchise"
            select
            fullWidth
            margin="normal"
            value={formData.franchise}
            onChange={handleChange}
          >
            <MenuItem value="AMEX">AMEX</MenuItem>
            <MenuItem value="VISA">VISA</MenuItem>
            <MenuItem value="MASTERCARD">MASTERCARD</MenuItem>
          </TextField>
        )}

        {(formData.product === "Credito de Consumo" ||
          formData.product === "Libranza Libre Inversión") && (
          <TextField
            label="Tasa (%)"
            name="rate"
            fullWidth
            margin="normal"
            type="number"
            inputProps={{ step: "0.01", min: 0, max: 100 }}
            value={formData.rate}
            onChange={(e) => {
              const value = e.target.value;
              if (
                value === "" ||
                (/^\d*\.?\d*$/.test(value) &&
                  Number(value) >= 0 &&
                  Number(value) <= 100)
              ) {
                setFormData({ ...formData, rate: value });
              }
            }}
            helperText="La tasa debe estar entre 0 y 100"
          />
        )}
      </FormDialog>
    </Paper>
  );
};

export default Sales;
