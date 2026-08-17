export const DIFFICULTY_PERCENTAGES = {
  low: 0.5,
  medium: 0.3,
  high: 0.2,
} as const;

export type QuestionDifficulty =
  | "low"
  | "medium"
  | "high";

export type QuestionCategory =
  | "offense"
  | "defense"
  | "information"
  | "mobility"
  | "control"
  | "support"
  | "utility"
  | "unique";

export type QuestionId = string;

export type Question = {
  label: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  description?: string;
};

export const QUESTIONS: Record<QuestionId, Question> = {
  // =========================
  // Offense
  // =========================

  "deals-damage": {
    label: "Deals Damage",
    category: "offense",
    difficulty: "low",
    description: "Can any of the agent's abilities directly damage enemies?",
  },

  "damage-over-time": {
    label: "Damage Over Time",
    category: "offense",
    difficulty: "medium",
    description: "Can the agent create an effect that damages enemies over time?",
  },

  "hits-multiple-enemies": {
    label: "Hits Multiple Enemies",
    category: "offense",
    difficulty: "medium",
    description: "Can an ability damage multiple enemies at once?",
  },

  "destroys-utility": {
    label: "Destroys Utility",
    category: "offense",
    difficulty: "medium",
    description: "Can an ability destroy enemy deployables or utility?",
  },

  "can-kill": {
    label: "Can Kill",
    category: "offense",
    difficulty: "high",
    description: "Can an ability directly kill an enemy?",
  },

  "affects-weapons": {
    label: "Affects Weapons",
    category: "offense",
    difficulty: "high",
    description: "Can an ability directly affect an enemy's weapon?",
  },

  "ultimate-deals-damage": {
    label: "Ultimate Deals Damage",
    category: "offense",
    difficulty: "medium",
    description: "Does the agent's ultimate deal damage?",
  },

  // =========================
  // Defense
  // =========================

  "creates-barrier": {
    label: "Creates Barrier",
    category: "defense",
    difficulty: "medium",
    description: "Can the agent create a physical barrier?",
  },

  "blocks-bullets": {
    label: "Blocks Bullets",
    category: "defense",
    difficulty: "medium",
    description: "Can the agent create something that blocks bullets?",
  },

  "provides-protection": {
    label: "Provides Protection",
    category: "defense",
    difficulty: "medium",
    description: "Can an ability provide direct protection to a player?",
  },

  "creates-cover": {
    label: "Creates Cover",
    category: "defense",
    difficulty: "low",
    description: "Can the agent create temporary cover?",
  },

  "denies-area": {
    label: "Can Deny Area",
    category: "defense",
    difficulty: "low",
    description:
      "Can the agent make an area difficult or dangerous for enemies to enter?",
  },

  // =========================
  // Information
  // =========================

  "reveals-enemies": {
    label: "Reveals Enemies",
    category: "information",
    difficulty: "low",
    description: "Can an ability reveal enemy positions?",
  },

  "detects-enemies": {
    label: "Detects Enemies",
    category: "information",
    difficulty: "low",
    description: "Can the agent detect nearby enemies?",
  },

  "tracks-enemies": {
    label: "Tracks Enemies",
    category: "information",
    difficulty: "medium",
    description:
      "Can an ability track an enemy after detecting them?",
  },

  "reveals-through-walls": {
    label: "Reveals Through Walls",
    category: "information",
    difficulty: "medium",
    description:
      "Can the agent reveal enemies without requiring direct line of sight?",
  },

  "uses-utility-for-info": {
    label: "Uses Utility for Info",
    category: "information",
    difficulty: "medium",
    description:
      "Can the agent deploy something that provides information?",
  },

  "can-scout": {
    label: "Can Scout",
    category: "information",
    difficulty: "medium",
    description:
      "Can the agent use an ability to safely check an area?",
  },

  // =========================
  // Mobility
  // =========================

  "has-fast-movement": {
    label: "Has Fast Movement",
    category: "mobility",
    difficulty: "low",
    description:
      "Can an ability significantly increase the agent's movement speed?",
  },

  "can-dash": {
    label: "Can Dash",
    category: "mobility",
    difficulty: "high",
    description: "Can the agent quickly move a short distance?",
  },

  "can-teleport": {
    label: "Can Teleport",
    category: "mobility",
    difficulty: "high",
    description:
      "Can the agent teleport to another location?",
  },

  "can-change-dimension": {
    label: "Can Change Dimension",
    category: "mobility",
    difficulty: "high",
    description:
      "Can the agent temporarily leave normal gameplay space?",
  },

  "can-return": {
    label: "Can Return",
    category: "mobility",
    difficulty: "high",
    description:
      "Can the agent return to a previous or marked location?",
  },

  "can-move-vertically": {
    label: "Can Move Vertically",
    category: "mobility",
    difficulty: "medium",
    description:
      "Can the agent use an ability to gain significant vertical movement?",
  },

  // =========================
  // Control
  // =========================

  "can-slow": {
    label: "Can Slow",
    category: "control",
    difficulty: "low",
    description: "Can the agent slow enemy movement?",
  },

  "restricts-movement": {
    label: "Restricts Movement",
    category: "control",
    difficulty: "medium",
    description:
      "Can an ability prevent or heavily restrict enemy movement?",
  },

  "can-displace": {
    label: "Can Displace",
    category: "control",
    difficulty: "high",
    description:
      "Can the agent push, pull, lift, or otherwise displace enemies?",
  },

  "can-concuss": {
    label: "Can Concuss",
    category: "control",
    difficulty: "medium",
    description:
      "Can the agent apply the Concussed effect?",
  },

  "can-suppress": {
    label: "Can Suppress",
    category: "control",
    difficulty: "high",
    description:
      "Can the agent temporarily disable enemy abilities?",
  },

  "can-detain": {
    label: "Can Detain",
    category: "control",
    difficulty: "high",
    description: "Can the agent detain an enemy?",
  },

  "can-deafen": {
    label: "Can Deafen",
    category: "control",
    difficulty: "high",
    description:
      "Can the agent apply an effect that interferes with enemy audio?",
  },

  "can-hinder": {
    label: "Can Hinder",
    category: "control",
    difficulty: "high",
    description:
      "Can the agent apply the Hindered effect?",
  },

  // =========================
  // Support
  // =========================

  "can-heal-allies": {
    label: "Can Heal Allies",
    category: "support",
    difficulty: "high",
    description:
      "Can the agent directly heal a teammate?",
  },

  "can-heal-self": {
    label: "Can Heal Self",
    category: "support",
    difficulty: "high",
    description:
      "Can the agent restore their own health?",
  },

  "can-revive": {
    label: "Can Revive",
    category: "support",
    difficulty: "high",
    description:
      "Can the agent bring a dead player back?",
  },

  "can-buff-allies": {
    label: "Can Buff Allies",
    category: "support",
    difficulty: "medium",
    description:
      "Can the agent directly enhance a teammate?",
  },

  "supports-from-distance": {
    label: "Supports From Distance",
    category: "support",
    difficulty: "medium",
    description:
      "Can the agent provide an effect to an ally from a significant distance?",
  },

  // =========================
  // Utility
  // =========================

  "blocks-vision": {
    label: "Blocks Vision",
    category: "utility",
    difficulty: "low",
    description:
      "Can the agent block an enemy's line of sight?",
  },

  "can-blind": {
    label: "Can Blind",
    category: "utility",
    difficulty: "medium",
    description:
      "Can the agent impair enemy vision with an ability?",
  },

  "creates-vision-cover": {
    label: "Creates Vision Cover",
    category: "utility",
    difficulty: "low",
    description:
      "Can the agent create an area that obscures vision?",
  },

  "has-deployable": {
    label: "Has Deployable",
    category: "utility",
    difficulty: "low",
    description:
      "Can the agent place persistent utility on the map?",
  },

  "controls-utility": {
    label: "Controls Utility",
    category: "utility",
    difficulty: "medium",
    description:
      "Can the agent directly control deployed utility?",
  },

  "can-recall-utility": {
    label: "Can Recall Utility",
    category: "utility",
    difficulty: "high",
    description:
      "Can the agent retrieve or recall deployed utility?",
  },

  "can-reuse-utility": {
    label: "Can Reuse Utility",
    category: "utility",
    difficulty: "medium",
    description:
      "Can an ability be recovered and used again?",
  },

  "creates-decoy": {
    label: "Creates Decoy",
    category: "utility",
    difficulty: "high",
    description:
      "Can the agent create something designed to fool enemies?",
  },

  "uses-projectile": {
    label: "Uses Projectile",
    category: "utility",
    difficulty: "low",
    description:
      "Does the agent have an ability that is thrown or launched as a projectile?",
  },

  "places-ground-utility": {
    label: "Places Ground Utility",
    category: "utility",
    difficulty: "low",
    description:
      "Can the agent place an ability directly onto the ground?",
  },

  "casts-through-walls": {
    label: "Casts Through Walls",
    category: "utility",
    difficulty: "medium",
    description:
      "Can an ability affect an area or enemy through a wall?",
  },

  // =========================
  // Unique
  // =========================

  "has-alternate-form": {
    label: "Has Alternate Form",
    category: "unique",
    difficulty: "high",
    description:
      "Can the agent enter a substantially different form?",
  },

  "acts-after-death": {
    label: "Acts After Death",
    category: "unique",
    difficulty: "high",
    description:
      "Can the agent continue influencing the round after dying?",
  },

  "has-companion": {
    label: "Has Companion",
    category: "unique",
    difficulty: "high",
    description:
      "Can the agent deploy a creature or companion?",
  },

  "creates-copy": {
    label: "Creates Copy",
    category: "unique",
    difficulty: "high",
    description:
      "Can the agent create a copy or imitation of themselves?",
  },

  "can-become-invulnerable": {
    label: "Can Become Invulnerable",
    category: "unique",
    difficulty: "high",
    description:
      "Can the agent temporarily become immune to damage?",
  },

  "can-return-after-death": {
    label: "Can Return After Death",
    category: "unique",
    difficulty: "high",
    description:
      "Can the agent return to the round after being eliminated?",
  },

  "can-affect-spike": {
    label: "Can Affect Spike",
    category: "unique",
    difficulty: "high",
    description:
      "Can an ability directly interact with the Spike?",
  },

  "uses-map-targeting": {
    label: "Uses Map Targeting",
    category: "unique",
    difficulty: "medium",
    description:
      "Can the agent target an ability using a tactical map interface?",
  },

  "has-rechargeable-ability": {
    label: "Has Rechargeable Ability",
    category: "unique",
    difficulty: "medium",
    description:
      "Can an ability recharge during a round?",
  },

  "has-ability-modes": {
    label: "Has Ability Modes",
    category: "unique",
    difficulty: "high",
    description:
      "Can an ability switch between different effects or modes?",
  },
};