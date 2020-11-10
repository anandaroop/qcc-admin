import { NextApiRequest, NextApiResponse } from "next"
import { base } from "../../lib/airtable"

export default async (
  _req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const records = await base("Meta").select({ view: "Mappable" }).all()

  res.statusCode = 200
  res.json(records)
}
