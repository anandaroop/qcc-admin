import { base } from "../../lib/airtable";

export default async (_req, res) => {
  const records = await base("Meta").select({ view: "Mappable" }).all();

  res.statusCode = 200;
  res.json(records);
};
