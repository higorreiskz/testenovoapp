import mongoose from "mongoose";

async function connectDB(): Promise<void> {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("Variável de ambiente MONGO_URI não definida.");
  }

  await mongoose.connect(uri, {
    dbName: "clipzone",
  });

  mongoose.connection.on("connected", () => {
    console.log("✅ Conexão com MongoDB estabelecida");
  });

  mongoose.connection.on("error", (error) => {
    console.error("❌ Erro na conexão com MongoDB", error);
  });
}

export default connectDB;
