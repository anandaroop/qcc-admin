import { NextApiRequest, NextApiResponse } from "next"
import { base } from "../../lib/airtable"

const records = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { tableName, viewName, primaryFieldName } = req.query

  const additionalFieldNames: string = req.query.additionalFieldNames as string // pipe-delimeted list
  let additionalFieldNameList: string[] = []

  if (additionalFieldNames.length > 0) {
    additionalFieldNameList = additionalFieldNames.split("|")
  }

  const records = await base(tableName as string)
    .select({
      view: viewName as string,
      fields: [
        primaryFieldName as string,
        "Geocode cache",
        ...additionalFieldNameList,
      ],
    })
    .all()

  res.statusCode = 200
  res.json(records)
}

export default records
