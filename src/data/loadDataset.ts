import { readFileSync } from "node:fs";
import path from "node:path";
import {
  playersFileSchema,
  teamsFileSchema,
  type PlayerRecord,
  type TeamMeta,
} from "../schema.js";

const teamsPath = path.join(process.cwd(), "data", "teams.json");
const playersPath = path.join(process.cwd(), "data", "players.json");

let teamsCache: ReturnType<typeof teamsFileSchema.parse> | null = null;
let playersCache: ReturnType<typeof playersFileSchema.parse> | null = null;

export function loadTeamsFile() {
  if (!teamsCache) {
    const raw = readFileSync(teamsPath, "utf8");
    teamsCache = teamsFileSchema.parse(JSON.parse(raw));
  }
  return teamsCache;
}

export function loadPlayersFile() {
  if (!playersCache) {
    const raw = readFileSync(playersPath, "utf8");
    playersCache = playersFileSchema.parse(JSON.parse(raw));
  }
  return playersCache;
}

export function getTournament() {
  return loadTeamsFile().tournament;
}

function countByCountry() {
  const counts: Record<string, number> = {};
  for (const p of loadPlayersFile().players) {
    counts[p.countryCode] = (counts[p.countryCode] ?? 0) + 1;
  }
  return counts;
}

export function listTeamsSummary() {
  const counts = countByCountry();
  return loadTeamsFile().teams.map((t) => ({
    countryCode: t.countryCode,
    countryName: t.countryName,
    logoUrl: t.logoUrl,
    listType: t.listType,
    asOf: t.asOf,
    playerCount: counts[t.countryCode] ?? 0,
    hasSource: Boolean(t.sourceUrl),
  }));
}

export function getTeamByCode(code: string): TeamMeta | undefined {
  const u = code.toUpperCase();
  return loadTeamsFile().teams.find((t) => t.countryCode.toUpperCase() === u);
}

export function getPlayersByCountry(code: string): PlayerRecord[] {
  const u = code.toUpperCase();
  return loadPlayersFile().players.filter((p) => p.countryCode.toUpperCase() === u);
}

export function getPlayerById(id: string): PlayerRecord | undefined {
  const needle = id.toLowerCase();
  return loadPlayersFile().players.find((p) => p.id.toLowerCase() === needle);
}

export function listAllPlayers() {
  return loadPlayersFile().players;
}
