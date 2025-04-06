import app from "./src/app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
