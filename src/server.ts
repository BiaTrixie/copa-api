import cors from "@fastify/cors";
import Fastify from "fastify";
import { registerPlayerRoutes } from "./routes/players.js";
import { registerTeamRoutes } from "./routes/teams.js";

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });

app.get("/health", async () => ({ status: "ok" }));

await registerTeamRoutes(app);
await registerPlayerRoutes(app);

const port = Number(process.env.PORT) || 8000;
const host = process.env.HOST || "0.0.0.0";

try {
  await app.listen({ port, host });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
