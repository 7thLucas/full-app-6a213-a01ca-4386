/* START: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */
export interface FieldSchemaType {
  fieldName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "color"
    | "url"
    | "enum"
    | "datetime"
    | "file"
    | "files";
  required?: boolean;
  label?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  fields?: FieldSchemaType[];
  item?: FieldSchemaType;
}
/* END: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */

export type ConfigurableSchemas = {
  formSchema: FieldSchemaType[];
};



export const configurableSchemas: ConfigurableSchemas = {
  formSchema: [
    {
      fieldName: "appName",
      type: "string",
      required: true,
      label: "App Name",
    },
    {
      fieldName: "tagline",
      type: "string",
      required: false,
      label: "Tagline",
      maxLength: 120,
    },
    {
      fieldName: "logoUrl",
      type: "url",
      required: true,
      label: "Logo URL",
    },
    {
      fieldName: "brandColor",
      type: "object",
      required: true,
      label: "Brand Colors",
      fields: [
        { fieldName: "primary", type: "color", required: true, label: "Primary (Honey Gold)" },
        { fieldName: "secondary", type: "color", required: true, label: "Secondary (Bee Amber)" },
        { fieldName: "accent", type: "color", required: true, label: "Accent (Hive Brown)" },
        { fieldName: "background", type: "color", required: false, label: "Background (Warm Cream)" },
        { fieldName: "success", type: "color", required: false, label: "Success (Garden Green)" },
        { fieldName: "alert", type: "color", required: false, label: "Alert (Coral Red)" },
      ],
    },
    {
      fieldName: "welcomeMessage",
      type: "string",
      required: false,
      label: "Welcome Message",
      maxLength: 200,
    },
    {
      fieldName: "welcomeSubtitle",
      type: "string",
      required: false,
      label: "Welcome Subtitle",
      maxLength: 200,
    },
    {
      fieldName: "enableDailyChallenge",
      type: "boolean",
      required: false,
      label: "Enable Daily Challenge Mode",
    },
    {
      fieldName: "enableMultiplayer",
      type: "boolean",
      required: false,
      label: "Enable Multiplayer / Leaderboard",
    },
    {
      fieldName: "enableShop",
      type: "boolean",
      required: false,
      label: "Enable In-Game Shop",
    },
    {
      fieldName: "dailyLoginCoins",
      type: "number",
      required: false,
      label: "Daily Login Reward (coins)",
      min: 0,
      max: 1000,
    },
    {
      fieldName: "startingCoins",
      type: "number",
      required: false,
      label: "Starting Coins for New Players",
      min: 0,
      max: 10000,
    },
    {
      fieldName: "gameModes",
      type: "array",
      required: false,
      label: "Available Game Modes",
      item: { type: "string", required: true },
    },
    {
      fieldName: "socialLinks",
      type: "object",
      required: false,
      label: "Social Links",
      fields: [
        { fieldName: "twitter", type: "url", required: false, label: "Twitter / X" },
        { fieldName: "instagram", type: "url", required: false, label: "Instagram" },
        { fieldName: "facebook", type: "url", required: false, label: "Facebook" },
      ],
    },
    {
      fieldName: "footerText",
      type: "string",
      required: false,
      label: "Footer Text",
      maxLength: 200,
    },
  ],
};
