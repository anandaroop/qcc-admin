export interface AirtableRecordParams {
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

  /** Internal id of the record, of the form `rec...` */
  recordId: string
}
