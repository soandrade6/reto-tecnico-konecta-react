# 🧩 Proyecto Frontend — React + MUI + SweetAlert2

Este proyecto es un **frontend** desarrollado con **React**, que utiliza **Material UI (MUI)** para los componentes de la interfaz y **SweetAlert2** para notificaciones y alertas interactivas.
Consume APIs desde un backend y está listo para correr **localmente** o dentro de un contenedor **Docker**.

---

## 🚀 Requisitos previos

* 🐳 **Docker**
* ⚙️ **Docker Compose**
* 💻 **Node.js ≥ 18**
* 📦 **npm** o **yarn**

---

## ⚙️ Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
VITE_API_URL=http://localhost:4000/api
VITE_RECAPTCHA_SITE_KEY=your_site_key

```

> ⚠️ Ajusta `VITE_API_URL` según la URL de tu backend.

---

## 🐋 Ejecución con Docker

### 🔧 Construir y levantar contenedor frontend

```bash
docker-compose up --build
```

### 🌐 Acceder a la aplicación

[http://localhost:3000](http://localhost:5173)

### 🛑 Detener el contenedor

```bash
docker-compose down
```

---

## 💻 Ejecución local (sin Docker)

Si prefieres correrlo directamente:

```bash
npm install
npm start
```

> Esto levantará la app en modo desarrollo en [http://localhost:3000](http://localhost:5173) con **hot-reload** activado.

---

## 🧰 Comandos útiles

| 🧩 Acción                          | 💻 Comando                          |
| ---------------------------------- | ------------------------------------ |
| Instalar dependencias              | `npm install`                        |
| Levantar proyecto en modo dev      | `npm run dev`                        |
| Limpiar caché y reinstalar deps    | `rm -rf node_modules && npm install` |

---

## 🎨 Librerías principales

* **React** — Librería principal de UI
* **MUI (Material UI)** — Componentes visuales y diseño responsivo
* **SweetAlert2** — Alertas y notificaciones
* **Axios** — Peticiones HTTP al backend
* **React Router DOM** — Navegación entre páginas
* **Redux / Redux Toolkit** *(opcional)* — Manejo de estado global


