import type { FastifyInstance } from "fastify";
import {
  getTeamByCode,
  getPlayersByCountry,
  getTournament,
  listTeamsSummary,
} from "../data/loadDataset.js";

export async function registerTeamRoutes(app: FastifyInstance) {
  app.get("/teams", async (_req, reply) => {
    return reply.send({
      tournament: getTournament(),
      count: listTeamsSummary().length,
      teams: listTeamsSummary(),
    });
  });

  app.get<{ Params: { countryCode: string } }>(
    "/teams/:countryCode",
    async (req, reply) => {
      const team = getTeamByCode(req.params.countryCode);
      if (!team) {
        return reply.status(404).send({
          error: "Seleção não encontrada",
          countryCode: req.params.countryCode.toUpperCase(),
        });
      }
      return reply.send(team);
    },
  );

  app.get<{ Params: { countryCode: string } }>(
    "/teams/:countryCode/players",
    async (req, reply) => {
      const team = getTeamByCode(req.params.countryCode);
      if (!team) {
        return reply.status(404).send({
          error: "Seleção não encontrada",
          countryCode: req.params.countryCode.toUpperCase(),
        });
      }
      const players = getPlayersByCountry(req.params.countryCode).map((p) => ({
        ...p,
        countryName: team.countryName,
      }));
      return reply.send({ tournament: getTournament(), team, players });
    },
  );
}
