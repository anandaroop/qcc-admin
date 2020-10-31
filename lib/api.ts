import { MetaFields } from "./airtable";

export const API = {
  fetchMetaRecords: async (): Promise<Airtable.Record<MetaFields>[]> => {
    const response = await fetch("/api/meta");
    const json = await response.json();
    return json;
  },

  fetchRecordsFromView: async ({
    tableName,
    viewName,
    primaryFieldName,
    additionalFieldNames = [],
  }: {
    tableName: string;
    viewName: string;
    primaryFieldName: string;
    additionalFieldNames?: string[];
  }): Promise<Airtable.Record<any>[]> => {
    const params = new URLSearchParams([
      ["tableName", tableName],
      ["viewName", viewName],
      ["primaryFieldName", primaryFieldName],
      ["additionalFieldNames", additionalFieldNames.join("|")],
    ]);
    const response = await fetch(`/api/records?${params.toString()}`);

    if (response.ok) {
      const json = await response.json();
      return json;
    } else if (response.status == 401) {
      throw new Error("Sorry, doesn't look like you are logged in.");
    }
  },
};
