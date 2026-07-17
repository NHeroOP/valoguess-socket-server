export type Role = "Duelist" | "Initiator" | "Controller" | "Sentinel";

export type Agent = {
  id: string;
  name: string;
  role: Role;
};

export const AGENTS: Agent[] = [
  { id: "astra", name: "astra", role: "Controller" },
  { id: "breach", name: "breach", role: "Initiator" },
  { id: "brimstone", name: "brimstone", role: "Controller" },
  { id: "chamber", name: "chamber", role: "Sentinel" },
  { id: "clove", name: "clove", role: "Controller" },
  { id: "cypher", name: "cypher", role: "Sentinel" },
  { id: "deadlock", name: "deadlock", role: "Sentinel" },
  { id: "fade", name: "fade", role: "Initiator" },
  { id: "gekko", name: "gekko", role: "Initiator" },
  { id: "harbor", name: "harbor", role: "Controller" },
  { id: "iso", name: "iso", role: "Duelist" },
  { id: "jett", name: "jett", role: "Duelist" },
  { id: "kayo", name: "kayo", role: "Initiator" },
  { id: "killjoy", name: "killjoy", role: "Sentinel" },
  { id: "miks", name: "miks", role: "Sentinel" },
  { id: "neon", name: "neon", role: "Duelist" },
  { id: "omen", name: "omen", role: "Controller" },
  { id: "phoenix", name: "phoenix", role: "Duelist" },
  { id: "raze", name: "raze", role: "Duelist" },
  { id: "reyna", name: "reyna", role: "Duelist" },
  { id: "sage", name: "sage", role: "Sentinel" },
  { id: "skye", name: "skye", role: "Initiator" },
  { id: "sova", name: "sova", role: "Initiator" },
  { id: "tejo", name: "tejo", role: "Initiator" },
  { id: "veto", name: "veto", role: "Controller" },
  { id: "viper", name: "viper", role: "Controller" },
  { id: "vyse", name: "vyse", role: "Sentinel" },
  { id: "waylay", name: "waylay", role: "Duelist" },
  { id: "yoru", name: "yoru", role: "Duelist" },
];