import { z } from "zod";

export const playerPositionSchema = z.enum(["GK", "DEF", "MID", "FWD"]);

export const listTypeSchema = z.enum([
  "pre-list",
  "final",
  "provisional",
  "album",
]);

/** Metadados da seleção (sem lista de jogadores) */
export const teamMetaSchema = z.object({
  countryCode: z.string().min(3).max(3),
  countryName: z.string(),
  logoUrl: z.string().url(),
  listType: listTypeSchema,
  asOf: z.string(),
  sourceUrl: z.string().url().nullable().optional(),
  notes: z.string().optional(),
});

export const teamsFileSchema = z.object({
  tournament: z.literal("FIFA World Cup 2026"),
  teams: z.array(teamMetaSchema),
});

/**
 * countryCode = seleção na Copa (nacionalidade / país que o jogador representa no álbum).
 */
export const playerRecordSchema = z.object({
  id: z.string(),
  name: z.string(),
  countryCode: z.string().min(3).max(3),
  position: playerPositionSchema.optional(),
  club: z.string().optional(),
  age: z.number().int().min(15).max(55).optional(),
  imageUrl: z.string().url().optional(),
  /** Origem dos dados extra (thesportsdb, thesportsdb-no-match, etc.) */
  enrichmentSource: z.string().optional(),
});

export const playersFileSchema = z.object({
  tournament: z.literal("FIFA World Cup 2026"),
  players: z.array(playerRecordSchema),
});

export type TeamMeta = z.infer<typeof teamMetaSchema>;
export type PlayerRecord = z.infer<typeof playerRecordSchema>;
