import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import { Typography, Paper, Box } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const SalesStats = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      const res = await api.get("/sales");
      setSales(res.data.sales || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  
  const salesByUser = Object.values(
    sales.reduce((acc, sale) => {
      const name = sale.createdBy?.name || "Desconocido";
      if (!acc[name]) acc[name] = { name, count: 0 };
      acc[name].count += 1;
      return acc;
    }, {})
  );


  const cuposByProduct = Object.values(
    sales.reduce((acc, sale) => {
      const product = sale.product;
      const amount = parseFloat(sale.requestedAmount.toString().replace(/\./g, "")) || 0;
      if (!acc[product]) acc[product] = { name: product, total: 0 };
      acc[product].total += amount;
      return acc;
    }, {})
  );

  
  const salesByDate = Object.values(
    sales.reduce((acc, sale) => {
      const date = new Date(sale.createdAt).toLocaleDateString("es-CO");
      if (!acc[date]) acc[date] = { date, count: 0 };
      acc[date].count += 1;
      return acc;
    }, {})
  );

  if (loading) return <Typography>Cargando estadísticas...</Typography>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Ventas por Asesor
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesByUser}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#0088FE" name="Cantidad de Ventas" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Cupos por Producto
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={cuposByProduct}
              dataKey="total"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {cuposByProduct.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toLocaleString("es-CO")}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Ventas por Fecha
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesByDate}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#00C49F" name="Cantidad de Ventas" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default SalesStats;
