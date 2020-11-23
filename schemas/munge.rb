#! /usr/bin/env ruby

require 'json'

fields = JSON.parse(DATA.readlines.join)

type_map = {
  "autoNumber" => "number",
  "button" => "unknown",
  "checkbox" => "boolean",
  "createdTime" => "string",
  "email" => "string",
  "formula" => "string",
  "lastModifiedTime" => "string",
  "multilineText" => "string",
  "multipleLookupValues" => "string[]",
  "multipleRecordLinks" => "string[]",
  "multipleSelects" => "string[]",
  "number" => "number",
  "phoneNumber" => "string",
  "singleLineText" => "string",
  "singleSelect  " => "string",
}

field_defs = fields.map do |f|
  <<~EOF
    /** #{f['name']} (#{f['id']}) -- #{f['type']} */
    "#{f['name']}": #{type_map.fetch(f['type'], "unknown")}
  EOF
end

puts <<~EOF
export interface RequesterFields {
  #{field_defs.join("\n")}
}
EOF

__END__
[
  { "id": "fld9n2gWu3k6pMQQH", "name": "Name", "type": "formula" },
  { "id": "fldZWo2ujo8ZZyYx1", "name": "Notes", "type": "multilineText" },
  {
    "id": "fldfl7NTFlF3RrXxt",
    "name": "Address or cross streets",
    "type": "singleLineText"
  },
  { "id": "fld31ZwrsIXcNdBlh", "name": "Phone", "type": "phoneNumber" },
  { "id": "fldWMoDActuSlPaEs", "name": "Email", "type": "email" },
  {
    "id": "fldSotMx3csXqFe6w",
    "name": "Last initial",
    "type": "singleLineText"
  },
  { "id": "fldtxMxsKrA5OJiWW", "name": "First name", "type": "singleLineText" },
  {
    "id": "fld3jHYnCu0jB99Th",
    "name": "Neighborhood",
    "type": "multipleRecordLinks"
  },
  {
    "id": "fldyaxK9ZXUr4dtud",
    "name": "Volunteer assigned",
    "type": "multipleRecordLinks"
  },
  {
    "id": "fldFcG9mDFmRTlrF2",
    "name": "Needs help applying for these services",
    "type": "multipleSelects"
  },
  {
    "id": "fldVGWsTXkRXrCUK3",
    "name": "Point person",
    "type": "multipleRecordLinks"
  },
  { "id": "fld4AUQU48pbrjafM", "name": "Status", "type": "singleSelect" },
  {
    "id": "fldFxRRTP6FbdBhpE",
    "name": "How soon do you need support?",
    "type": "singleSelect"
  },
  {
    "id": "fld8ntlF8qK4lIkWT",
    "name": "Which of these ways are best to get in touch with you?",
    "type": "multipleSelects"
  },
  { "id": "fld4GWBBPsfCPg6nC", "name": "Zipcode", "type": "number" },
  { "id": "fldVBSNlvWUFYTvWU", "name": "Household size", "type": "number" },
  {
    "id": "fldDwuV5hhvcJGt6X",
    "name": "Grocery needs",
    "type": "multipleSelects"
  },
  {
    "id": "fld5SpPyGoUgmIycf",
    "name": "Grocery needs (other)",
    "type": "singleLineText"
  },
  {
    "id": "fldcukcfTv3owYlP3",
    "name": "Need medicine pickup",
    "type": "checkbox"
  },
  {
    "id": "fld1xQk3dTfAY8UIO",
    "name": "Pharmacy address",
    "type": "singleLineText"
  },
  {
    "id": "fldcjuzqtdAapnltG",
    "name": "Preferred language",
    "type": "multipleRecordLinks"
  },
  {
    "id": "fldPUHD4Vh4QSaMt4",
    "name": "Other languages",
    "type": "multipleRecordLinks"
  },
  {
    "id": "fldIUWnN50uSm705T",
    "name": "Can pay for groceries",
    "type": "singleSelect"
  },
  {
    "id": "fldCqEHVPZtWsXLY8",
    "name": "Has grocery needs",
    "type": "checkbox"
  },
  {
    "id": "fldS6iYmtSDwVtynA",
    "name": "Anything else you would like us to know?",
    "type": "multilineText"
  },
  {
    "id": "fld1RyppPNMKBwJQ8",
    "name": "Needs help applying to services (other)",
    "type": "singleLineText"
  },
  {
    "id": "fldRvCCxaEFPdkeSi",
    "name": "Geocode query (formula)",
    "type": "formula"
  },
  {
    "id": "fldOP0hMulfu6FILM",
    "name": "Geocode cache",
    "type": "singleLineText"
  },
  { "id": "fldLc8pqPmXTBQ6Yz", "name": "Legacy Unique ID", "type": "number" },
  {
    "id": "fldw49uUOMeXNvJ8i",
    "name": "Legacy vulnerable groups",
    "type": "multipleSelects"
  },
  {
    "id": "fldECwxMLghSjCS4v",
    "name": "Legacy needs",
    "type": "multipleSelects"
  },
  { "id": "fldgCmHILXpVOviOg", "name": "Unique ID", "type": "autoNumber" },
  {
    "id": "fldmthDsGzpHBJq3v",
    "name": "Group Claiming",
    "type": "multipleSelects"
  },
  { "id": "fldtz4E5aefmJdM5q", "name": "Created", "type": "createdTime" },
  { "id": "fldqGoJSuPiWSNY4l", "name": "Modified", "type": "lastModifiedTime" },
  {
    "id": "fldA5tkWESLnoqs3I",
    "name": "Prepared meal interest",
    "type": "singleSelect"
  },
  {
    "id": "fldg9F30WhXKNvD2c",
    "name": "Dietary restrictions",
    "type": "multipleSelects"
  },
  {
    "id": "fldJE43u672DcwZTw",
    "name": "Coordinated delivery shifts",
    "type": "multipleRecordLinks"
  },
  {
    "id": "fldvGJQoweemEHsEO",
    "name": "Combined languages",
    "type": "formula"
  },
  {
    "id": "fldct8KMIgVuFGeoZ",
    "name": "Saturday Evangel Delivery",
    "type": "checkbox"
  },
  {
    "id": "fldZymBDYFd3OOZPl",
    "name": "Groups: Statuses",
    "type": "singleLineText"
  },
  {
    "id": "fldx7si8APGmAyRF3",
    "name": "Neighborhood Group",
    "type": "multipleLookupValues"
  },
  {
    "id": "fld5c5TPGjSnAJSsi",
    "name": "Notification Statuses",
    "type": "singleLineText"
  },
  { "id": "fld4ovvfOE40JQU79", "name": "Whatsapp Only", "type": "checkbox" },
  {
    "id": "fld7SP2mKVDQu0zeZ",
    "name": "NeighborhoodLookup",
    "type": "multipleLookupValues"
  },
  {
    "id": "fld8Gid7P9sUNgMuv",
    "name": "Evangel Recurring Notes",
    "type": "multilineText"
  },
  {
    "id": "fldwTvV8IeDzFpWpR",
    "name": "Rent assistance program",
    "type": "singleSelect"
  },
  {
    "id": "fldpD5ilZGot6gwAh",
    "name": "Rent assistance point person",
    "type": "multipleRecordLinks"
  },
  {
    "id": "fldAdiuiumgqGi9LY",
    "name": "Volunteers copy",
    "type": "singleLineText"
  },
  {
    "id": "flddHTMywZjUjTIv8",
    "name": "Volunteers copy",
    "type": "singleLineText"
  },
  {
    "id": "fld4arkKwINWlWLBc",
    "name": "Volunteers copy",
    "type": "singleLineText"
  },
  {
    "id": "fldYmrpjhWf47KGJ4",
    "name": "Language changed at",
    "type": "formula"
  },
  { "id": "fld6Gmsn5teQX3kyT", "name": "# Adults", "type": "number" },
  { "id": "fld2ACLhVdKHMR99F", "name": "# Children", "type": "number" },
  { "id": "fldbsKYr3fP6bssFr", "name": "# Elderly", "type": "number" },
  {
    "id": "fldT3N8ZOHga6o9d5",
    "name": "9MR Recipient",
    "type": "singleLineText"
  },
  {
    "id": "fldhWe9utMl2X3UbI",
    "name": "Did not provide household numbers",
    "type": "checkbox"
  },
  {
    "id": "fld3zmDajB4wFGd5m",
    "name": "Monday Evangel Delivery",
    "type": "checkbox"
  },
  {
    "id": "fldEiBXcoB0WyxqpJ",
    "name": "Related To",
    "type": "multipleRecordLinks"
  },
  {
    "id": "fldjXFRJ3gTXI6onv",
    "name": "Name (from Grocery Needs 2)",
    "type": "multipleLookupValues"
  },
  {
    "id": "fld898rZbFB7OUUCS",
    "name": "Delivery Recipients",
    "type": "singleLineText"
  },
  { "id": "fldbItuN2djLtVNU3", "name": "9MR wait list", "type": "checkbox" },
  {
    "id": "fld14tFgVI2YMaD4J",
    "name": "Intake Notes",
    "type": "multilineText"
  },
  { "id": "fld9DTKuWX7NQEYm8", "name": "Intake form", "type": "button" }
]
