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
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import Swal from "sweetalert2";
import FormDialog from "../components/FormDialog";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpen = (user = null) => {
    setEditingUser(user);
    setFormData(
      user
        ? {
            name: user.name,
            email: user.email,
            password: "",
            roleId: user.roleId,
          }
        : { name: "", email: "", password: "", roleId: "" }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, formData);
        Swal.fire("Actualizado", "Usuario actualizado con éxito", "success");
      } else {
        await api.post("/users", formData);
        Swal.fire("Creado", "Usuario creado correctamente", "success");
      }
      handleClose();
      fetchUsers();
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
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });
    if (confirm.isConfirmed) {
      await api.delete(`/users/${id}`);
      Swal.fire("Eliminado", "Usuario eliminado correctamente", "success");
      fetchUsers();
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Gestión de Usuarios
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{ mb: 2 }}
        onClick={() => handleOpen()}
      >
        Agregar Usuario
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.Role?.name}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(u)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(u.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <FormDialog
        open={open}
        onClose={handleClose}
        title={editingUser ? "Editar Usuario" : "Agregar Usuario"}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Nombre"
          name="name"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          label="Correo"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          required
          error={
            formData.email !== "" &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
          }
          helperText={
            formData.email !== "" &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
              ? "Ingrese un correo válido (ej: usuario@dominio.com)"
              : ""
          }
        />
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleChange}
        />
        <TextField
          label="Rol"
          name="roleId"
          select
          fullWidth
          margin="normal"
          value={formData.roleId}
          onChange={handleChange}
        >
          <MenuItem value={1}>Administrador</MenuItem>
          <MenuItem value={2}>Asesor</MenuItem>
        </TextField>
      </FormDialog>
    </Paper>
  );
};

export default Users;
