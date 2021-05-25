import useSWR, { responseInterface } from "swr"
import { stringifyUrl } from "query-string"

import { AirtableRecordListParams } from "../../types"

interface Response<TFields> {
  /** The retrieved records */
  records: Airtable.Records<TFields>

  /** A formatted error object, in case the records could not be retrieved */
  error: AirtableRecordException

  /** True if the request is still in progress */
  isLoading: boolean

  /** True if the request has errored */
  isError: boolean

  /**
   * TODO: deprecation
   * Mutate function, bound to SWR cache key
   */
  mutate: responseInterface<
    Airtable.Record<TFields>,
    AirtableRecordException
  >["mutate"]
}

/**
 * An SWR data fetching hook that will return a list of Airtable records in their entirety.
 *
 * Do not use if you wish to avoid sending some fields over the wire.
 */
export const useAirtableRecords = <TFields>({
  baseId,
  tableIdOrName,
  maxRecords,
  fields,
  filterByFormula,
  sort,
  view,
}: AirtableRecordListParams): Response<TFields> => {
  const url = stringifyUrl(
    {
      url: `/api/airtable-records`,
      query: {
        baseId,
        tableIdOrName,
        maxRecords,
        fields,
        filterByFormula,
        view,
        sort: JSON.stringify(sort),
      },
    },
    {
      skipNull: true,
    }
  )

  const { data, error, mutate } = useSWR(url, fetcher)

  return {
    records: data,
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
      "An error occurred while getting the records."
    )
    error.details = await res.json()
    throw error
  }
  // await sleep({ ms: 2000 });
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

// for simulating latency
// const sleep = ({ ms }) =>
//   new Promise<void>((resolve) => setTimeout(() => resolve(), ms))
