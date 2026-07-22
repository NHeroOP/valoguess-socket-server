import * as z from "zod";

export const playerSchema =  z.object({
  id: z.string(),
  username: z.string(),
})

export type playerInput = z.infer<typeof playerSchema>;

export const joinRoomSchema = z.object({
  roomId: z.string(),
  player: playerSchema,
});


export type joinRoomPayload = z.infer<typeof joinRoomSchema>;

export const updateRoomSchema = z.object({
  roomId: z.string(),
  settings: z.object({
    maxNos: z.number().int().min(1).max(10),
    maxRounds: z.number().int().min(1).max(10),
    timePerRound: z.number().int().min(10).max(300),
  }),
});

export type updateRoomPayload = z.infer<typeof updateRoomSchema>;