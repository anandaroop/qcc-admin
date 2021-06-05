import { stringifyUrl } from "query-string"

import { AirtableTableParams } from "../../types"

interface NewRecord<TFields> {
  fields: TFields
}

interface Response<TFields> {
  /** A function to perform the create and promise the created records */
  createRecords: (
    records: NewRecord<TFields>[]
  ) => Promise<Airtable.Records<TFields>>
}

/**
 * A hook that provides a function to create one or more Airtable records.
 *
 * Returns a promise for the created records, which can be used with an SWR mutation.
 */
export const useAirtableRecordCreate = <TFields>({
  baseId,
  tableIdOrName,
}: AirtableTableParams): Response<TFields> => {
  const url = stringifyUrl(
    {
      url: "/api/create-airtable-records",
      query: { baseId, tableIdOrName },
    },
    {
      skipNull: true,
    }
  )

  return {
    createRecords: creater<TFields>(url),
  }
}

const creater = <TFields>(url: string) => async (
  records: NewRecord<TFields>[]
): Promise<Airtable.Records<TFields>> => {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(records),
  })

  if (!res.ok) {
    const error = new AirtableRecordCreateException(
      "An error occurred while creating the records."
    )
    error.details = await res.json()
    throw error
  }
  return res.json()
}

class AirtableRecordCreateException {
  readonly name: string
  message: string
  details: unknown

  constructor(message: string) {
    this.name = "AirtableRecordCreateException"
    this.message = message
  }
}
