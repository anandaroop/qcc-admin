export interface AirtableTableParams {
  /** Internal id of the base, of the form `app...` */
  baseId?: string

  /**
   * Can be either:
   * - Internal id of the table, of the form `tbl...`
   * - Human-readable name of the table, e.g. "Requests"
   *
   * The internal id will be more resilient to change, of course.
   */
  tableIdOrName: string
}

export interface AirtableRecordParams extends AirtableTableParams {
  /** Internal id of the record, of the form `rec...` */
  recordId: string
}

export interface AirtableRecordListParams extends AirtableTableParams {
  /**
   * Only data for fields whose names are in this list will be included in the result.
   *
   * If you don't need every field, you can use this parameter to reduce the amount of data transferred.
   *
   * For example, to only return data from Name and URL, pass in:
   *
   * `fields: ["Name", "URL"]`
   */
  fields?: string[]

  /**
   * A formula used to filter records. The formula will be evaluated for each record, and if the result is not 0, false, "", NaN, [], or #Error! the record will be included in the response.
   *
   * If combined with the view parameter, only records in that view which satisfy the formula will be returned.
   *
   * For example, to only include records where Name isn't empty, pass in NOT({Name} = '') as a parameter like this:
   *
   * `filterByFormula: "NOT({Name} = '')"`
   */
  filterByFormula?: string

  /**
   * The name or ID of a view in the table. If set, only the records in that view will be returned.
   *
   * The records will be sorted according to the order of the view unless the sort parameter is included,
   * which overrides that order.
   *
   * Fields hidden in this view will be returned in the results.
   * To only return a subset of fields, use the fields parameter.
   */
  view?: string

  /**
   * A list of sort objects that specifies how the records will be ordered.
   *
   * Each sort object must have a field key specifying the name of the field to sort on,
   * and an optional direction key that is either "asc" or "desc".
   * The default direction is "asc".
   *
   * The sort parameter overrides the sorting of the view specified in the view parameter.
   * If neither the sort nor the view parameter is included, the order of records is arbitrary.
   *
   * For example, to sort records by Name in descending order, send these two query parameters:
   *
   * sort%5B0%5D%5Bfield%5D=Name
   * sort%5B0%5D%5Bdirection%5D=desc
   *
   * (That is: sort[0][field]=Name&sort[0][direction]=desc )
   *
   * For example, to sort records by Name in descending order, pass in:
   *
   * [{field: "Name", direction: "desc"}]
   */
  sort?: Record<string, unknown>[] | string

  /**
   * The maximum total number of records that will be returned in your requests.
   */
  maxRecords?: number
}
