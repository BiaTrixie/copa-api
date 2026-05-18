import type { FastifyInstance } from "fastify";
import {
  getPlayerById,
  getTournament,
  listAllPlayers,
  loadTeamsFile,
} from "../data/loadDataset.js";

function withCountryNames(players: ReturnType<typeof listAllPlayers>) {
  const map = new Map(
    loadTeamsFile().teams.map((t) => [t.countryCode, t.countryName] as const),
  );
  return players.map((p) => ({
    ...p,
    countryName: map.get(p.countryCode) ?? p.countryCode,
  }));
}

export async function registerPlayerRoutes(app: FastifyInstance) {
  app.get<{
    Querystring: { countryCode?: string };
  }>("/players", async (req, reply) => {
    const code = req.query.countryCode?.toUpperCase();
    const all = listAllPlayers();
    const filtered = code
      ? all.filter((p) => p.countryCode.toUpperCase() === code)
      : all;
    return reply.send({
      tournament: getTournament(),
      count: filtered.length,
      players: withCountryNames(filtered),
    });
  });

  app.get<{ Params: { id: string } }>("/players/:id", async (req, reply) => {
    const p = getPlayerById(req.params.id);
    if (!p) {
      return reply.status(404).send({ error: "Jogador não encontrado", id: req.params.id });
    }
    const map = new Map(
      loadTeamsFile().teams.map((t) => [t.countryCode, t.countryName] as const),
    );
    return reply.send({
      ...p,
      countryName: map.get(p.countryCode) ?? p.countryCode,
    });
  });
}
