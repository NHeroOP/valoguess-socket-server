  import * as z from "zod";

  export const createRoomSchema = z.object({
    player: z.object({
      username: z.string(),
      id: z.string(),
    }),
    settings: z.object({
      maxNos: z.number().int(),
      maxRounds: z.number().int(),
      timePerRound: z.number().int(),
    }),
  })

  export type createRoomPayload = z.infer<typeof createRoomSchema>;

  export const joinRoomSchema = z.object({
    roomId: z.string(),
    player: z.object({
      username: z.string(),
      id: z.string(),
    }),
  })

  export type joinRoomPayload = z.infer<typeof joinRoomSchema>;

  export const updateRoomSchema = z.object({
    roomId: z.string(),
    playerId: z.string(),
    settings: z.object({
      maxNos: z.number().int().min(1).max(10),
      maxRounds: z.number().int().min(1).max(10),
      timePerRound: z.number().int().min(10).max(300),
    }),
  });

  export type updateRoomPayload = z.infer<typeof updateRoomSchema>;