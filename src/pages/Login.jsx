import { useForm } from "react-hook-form";
import {
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Box,
  Avatar,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import Captcha from "../components/Captcha";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    try {
      const captchaToken = window.grecaptcha.getResponse();
      if (!captchaToken) {
        Swal.fire("Error", "Por favor completa el captcha", "error");
        return;
      }

      const result = await dispatch(
        loginUser({
          email: data.email,
          password: data.password,
          captchaToken,
        })
      );

      if (loginUser.fulfilled.match(result)) {
        window.location.href = "/dashboard";
      } else {
        Swal.fire(
          "Error",
          result.payload || "Credenciales incorrectas",
          "error"
        );
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Fallo en el login", "error");
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: 4,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Box display="flex" justifyContent="center" mb={2}>
          <Avatar sx={{ bgcolor: "primary.main", width: 80, height: 80 }}>
            <AccountCircleIcon sx={{ fontSize: 50 }} />
          </Avatar>
        </Box>

        <Typography variant="h5" align="center" gutterBottom>
          Inicio de sesión
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("email")}
            label="Correo electrónico"
            type="email"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            {...register("password")}
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            required
          />
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
            <Captcha />
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Iniciar sesión"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
