import { stringifyUrl } from "query-string"

import { AirtableRecordParams } from "../../types"

interface Response<TFields> {
  /** A function to perform the update and promise the updated record */
  updateRecord: (fields: Partial<TFields>) => Promise<Airtable.Record<TFields>>
}

/**
 * A hook that provides a function to update a given Airtable record.
 *
 * Returns a promise for the updated record, which can be used with an SWR mutation.
 */
export const useAirtableRecordUpdate = <TFields>({
  baseId,
  tableIdOrName,
  recordId,
}: AirtableRecordParams): Response<TFields> => {
  const url = stringifyUrl(
    {
      url: "/api/update-airtable-record",
      query: { baseId, tableIdOrName, recordId },
    },
    {
      skipNull: true,
    }
  )

  return {
    updateRecord: updater<TFields>(url),
  }
}

const updater = <TFields>(url: string) => async (
  fields: Partial<TFields>
): Promise<Airtable.Record<TFields>> => {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(fields),
  })

  if (!res.ok) {
    const error = new AirtableRecordUpdateException(
      "An error occurred while updating the record."
    )
    error.details = await res.json()
    throw error
  }
  return res.json()
}

class AirtableRecordUpdateException {
  readonly name: string
  message: string
  details: unknown

  constructor(message: string) {
    this.name = "AirtableRecordUpdateException"
    this.message = message
  }
}
