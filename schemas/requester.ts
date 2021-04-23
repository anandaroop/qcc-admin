export interface RequesterFields {
  /** Name (fld9n2gWu3k6pMQQH) -- formula */
  Name: string

  /** Notes (fldZWo2ujo8ZZyYx1) -- multilineText */
  Notes: string

  /** Address or cross streets (fldfl7NTFlF3RrXxt) -- singleLineText */
  "Address or cross streets": string

  /** Phone (fld31ZwrsIXcNdBlh) -- phoneNumber */
  Phone: string

  /** Email (fldWMoDActuSlPaEs) -- email */
  Email: string

  /** Last initial (fldSotMx3csXqFe6w) -- singleLineText */
  "Last initial": string

  /** First name (fldtxMxsKrA5OJiWW) -- singleLineText */
  "First name": string

  /** Neighborhood (fld3jHYnCu0jB99Th) -- multipleRecordLinks */
  Neighborhood: string[]

  /** Volunteer assigned (fldyaxK9ZXUr4dtud) -- multipleRecordLinks */
  "Volunteer assigned": string[]

  /** Needs help applying for these services (fldFcG9mDFmRTlrF2) -- multipleSelects */
  "Needs help applying for these services": string[]

  /** Point person (fldVGWsTXkRXrCUK3) -- multipleRecordLinks */
  "Point person": string[]

  /** Status (fld4AUQU48pbrjafM) -- singleSelect */
  Status: string

  /** How soon do you need support? (fldFxRRTP6FbdBhpE) -- singleSelect */
  "How soon do you need support?": unknown

  /** Which of these ways are best to get in touch with you? (fld8ntlF8qK4lIkWT) -- multipleSelects */
  "Which of these ways are best to get in touch with you?": string[]

  /** Zipcode (fld4GWBBPsfCPg6nC) -- number */
  Zipcode: number

  /** Household size (fldVBSNlvWUFYTvWU) -- number */
  "Household size": number

  /** Grocery needs (fldDwuV5hhvcJGt6X) -- multipleSelects */
  "Grocery needs": string[]

  /** Grocery needs (other) (fld5SpPyGoUgmIycf) -- singleLineText */
  "Grocery needs (other)": string

  /** Need medicine pickup (fldcukcfTv3owYlP3) -- checkbox */
  "Need medicine pickup": boolean

  /** Pharmacy address (fld1xQk3dTfAY8UIO) -- singleLineText */
  "Pharmacy address": string

  /** Preferred language (fldcjuzqtdAapnltG) -- multipleRecordLinks */
  "Preferred language": string[]

  /** Other languages (fldPUHD4Vh4QSaMt4) -- multipleRecordLinks */
  "Other languages": string[]

  /** Can pay for groceries (fldIUWnN50uSm705T) -- singleSelect */
  "Can pay for groceries": unknown

  /** Has grocery needs (fldCqEHVPZtWsXLY8) -- checkbox */
  "Has grocery needs": boolean

  /** Anything else you would like us to know? (fldS6iYmtSDwVtynA) -- multilineText */
  "Anything else you would like us to know?": string

  /** Needs help applying to services (other) (fld1RyppPNMKBwJQ8) -- singleLineText */
  "Needs help applying to services (other)": string

  /** Geocode query (formula) (fldRvCCxaEFPdkeSi) -- formula */
  "Geocode query (formula)": string

  /** Geocode cache (fldOP0hMulfu6FILM) -- singleLineText */
  "Geocode cache": string

  /** Legacy Unique ID (fldLc8pqPmXTBQ6Yz) -- number */
  "Legacy Unique ID": number

  /** Legacy vulnerable groups (fldw49uUOMeXNvJ8i) -- multipleSelects */
  "Legacy vulnerable groups": string[]

  /** Legacy needs (fldECwxMLghSjCS4v) -- multipleSelects */
  "Legacy needs": string[]

  /** Unique ID (fldgCmHILXpVOviOg) -- autoNumber */
  "Unique ID": number

  /** Group Claiming (fldmthDsGzpHBJq3v) -- multipleSelects */
  "Group Claiming": string[]

  /** Created (fldtz4E5aefmJdM5q) -- createdTime */
  Created: string

  /** Modified (fldqGoJSuPiWSNY4l) -- lastModifiedTime */
  Modified: string

  /** Prepared meal interest (fldA5tkWESLnoqs3I) -- singleSelect */
  "Prepared meal interest": unknown

  /** Dietary restrictions (fldg9F30WhXKNvD2c) -- multipleSelects */
  "Dietary restrictions": string[]

  /** Coordinated delivery shifts (fldJE43u672DcwZTw) -- multipleRecordLinks */
  "Coordinated delivery shifts": string[]

  /** Combined languages (fldvGJQoweemEHsEO) -- formula */
  "Combined languages": string

  /** Saturday Evangel Delivery (fldct8KMIgVuFGeoZ) -- checkbox */
  "Saturday Evangel Delivery": boolean

  /** Groups: Statuses (fldZymBDYFd3OOZPl) -- singleLineText */
  "Groups: Statuses": string

  /** Neighborhood Group (fldx7si8APGmAyRF3) -- multipleLookupValues */
  "Neighborhood Group": string[]

  /** Notification Statuses (fld5c5TPGjSnAJSsi) -- singleLineText */
  "Notification Statuses": string

  /** Whatsapp Only (fld4ovvfOE40JQU79) -- checkbox */
  "Whatsapp Only": boolean

  /** NeighborhoodLookup (fld7SP2mKVDQu0zeZ) -- multipleLookupValues */
  NeighborhoodLookup: string[]

  /** Evangel Recurring Notes (fld8Gid7P9sUNgMuv) -- multilineText */
  "Evangel Recurring Notes": string

  /** Rent assistance program (fldwTvV8IeDzFpWpR) -- singleSelect */
  "Rent assistance program": unknown

  /** Rent assistance point person (fldpD5ilZGot6gwAh) -- multipleRecordLinks */
  "Rent assistance point person": string[]

  /** Volunteers copy (fldAdiuiumgqGi9LY) -- singleLineText */
  fldAdiuiumgqGi9LY: string

  /** Volunteers copy (flddHTMywZjUjTIv8) -- singleLineText */
  flddHTMywZjUjTIv8: string

  /** Volunteers copy (fld4arkKwINWlWLBc) -- singleLineText */
  fld4arkKwINWlWLBc: string

  /** Language changed at (fldYmrpjhWf47KGJ4) -- formula */
  "Language changed at": string

  /** # Adults (fld6Gmsn5teQX3kyT) -- number */
  "# Adults": number

  /** # Children (fld2ACLhVdKHMR99F) -- number */
  "# Children": number

  /** # Elderly (fldbsKYr3fP6bssFr) -- number */
  "# Elderly": number

  /** 9MR Recipient (fldT3N8ZOHga6o9d5) -- singleLineText */
  "9MR Recipient": string

  /** Did not provide household numbers (fldhWe9utMl2X3UbI) -- checkbox */
  "Did not provide household numbers": boolean

  /** Monday Evangel Delivery (fld3zmDajB4wFGd5m) -- checkbox */
  "Monday Evangel Delivery": boolean

  /** Related To (fldEiBXcoB0WyxqpJ) -- multipleRecordLinks */
  "Related To": string[]

  /** Name (from Grocery Needs 2) (fldjXFRJ3gTXI6onv) -- multipleLookupValues */
  "Name (from Grocery Needs 2)": string[]

  /** Delivery Recipients (fld898rZbFB7OUUCS) -- singleLineText */
  "Delivery Recipients": string

  /** 9MR wait list (fldbItuN2djLtVNU3) -- checkbox */
  "9MR wait list": boolean

  /** Intake Notes (fld14tFgVI2YMaD4J) -- multilineText */
  "Intake Notes": string

  /** Intake form (fld9DTKuWX7NQEYm8) -- button */
  "Intake form": unknown
}

export enum RequesterStatus {
  New = "New - Needs intake",
  Intake = "Intake in progress",
  ResolvedAble = "Resolved - Able to Fill Need",
  ResolvedDuplicate = "Resolved - Duplicate",

  // Waiting for a response from them
  // Needs volunteer
  // In Progress - We Take Responsibility For This (DO NOT USE THIS
  // Scheduled with volunteer
  // Unable to contact
  // We Can’t Take Responsibility for This
  // EMERGENCY- Has Urgent Needs to be
  // Resolved - Follow up next week
  // Resolved - Cancelled
}
