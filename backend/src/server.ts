import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`🚀 ClipZone API pronta em http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Erro ao inicializar o servidor", error);
    process.exit(1);
  }
}

startServer();
