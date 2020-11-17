import useSWR, { responseInterface } from "swr"
import { stringifyUrl } from "query-string"

import { AirtableRecordParams } from "../../types"

interface Response<TFields> {
  /** The retrieved record */
  record: Airtable.Record<TFields>

  /** A formatted error object, in case the record could not be retrieved */
  error: AirtableRecordException

  /** True if the request is still in progress */
  isLoading: boolean

  /** True if the request has errored */
  isError: boolean

  /** Mutate function, bound to SWR cache key */
  mutate: responseInterface<
    Airtable.Record<TFields>,
    AirtableRecordException
  >["mutate"]
}

/**
 * An SWR data fetching hook that will return an Airtable record in its entirety.
 *
 * Do not use if you wish to avoid sending some fields over the wire.
 */
export const useAirtableRecord = <TFields>({
  baseId,
  tableIdOrName,
  recordId,
}: AirtableRecordParams): Response<TFields> => {
  const url = stringifyUrl(
    {
      url: "/api/airtable-record",
      query: { baseId, tableIdOrName, recordId },
    },
    {
      skipNull: true,
    }
  )

  const { data, error, mutate } = useSWR(url, fetcher)

  return {
    record: data,
    error,
    isLoading: !error && !data,
    isError: !!error,
    mutate,
  }
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new AirtableRecordException(
      "An error occurred while getting the record."
    )
    error.details = await res.json()
    throw error
  }
  return res.json()
}

class AirtableRecordException {
  readonly name: string
  message: string
  details: unknown

  constructor(message: string) {
    this.name = "AirtableRecordException"
    this.message = message
  }
}
