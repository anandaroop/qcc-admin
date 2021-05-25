import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/client"
import { omitBy, isUndefined } from "lodash"

import { airtable } from "../../lib/airtable"
import { AirtableRecordListParams } from "../../types"

const records = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const session = await getSession({ req })
  if (session) {
    const {
      baseId,
      tableIdOrName,
      maxRecords,
      fields,
      filterByFormula,
      view,
      sort,
    } = (req.query as unknown) as AirtableRecordListParams

    const criteria = omitBy(
      {
        maxRecords: parseInt((maxRecords as unknown) as string),
        fields,
        filterByFormula,
        view,
        sort: JSON.parse((sort as string) || "[]"),
      },
      isUndefined
    )

    try {
      const base: Airtable.Base = airtable.base(
        baseId || process.env.AIRTABLE_BASE_ID
      )
      const records = await base(tableIdOrName as string)
        .select(criteria)
        .all()
      res.statusCode = 200
      res.json(records)
    } catch (error) {
      res.statusCode = error.statusCode || 500
      res.json(error)
    }
    res.end()
  } else {
    res.status(401)
  }
  res.end()
}

export default records
