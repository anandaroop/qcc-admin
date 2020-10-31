import Airtable from "airtable";

/*
 * Import this library only on the server side, since it relies on ENV variables
 * which are not and should not be passed to the client side by NextJS
 */


const { AIRTABLE_API_KEY: apiKey, AIRTABLE_BASE_ID: baseId } = process.env;

export const airtable: Airtable = new Airtable({ apiKey });

export const base: Airtable.Base = airtable.base(baseId);

/**
 * Represents the the structure of the "Meta" table within the Airtable base.
 * That table is automatically generate via a Scripting Block automation.
 */
export interface MetaFields {
  "Full name": string;
  Type: string;
  "View ID": string;
  "View name": string;
  "Table ID": string;
  "Table name": string;
  "Primary field name": string;
  Mappable: boolean;
}
