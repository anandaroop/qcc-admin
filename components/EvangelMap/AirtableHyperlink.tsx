interface AirtableHyperlinkProps {
  /** Table ID */
  tid: string;

  /** View ID */
  vid: string;

  /** Record ID */
  rid: string;
}

export const AirtableHyperlink: React.FC<AirtableHyperlinkProps> = ({
  tid,
  vid,
  rid,
  children,
}) => (
  <a href={`https://airtable.com/${tid}/${vid}/${rid}`} target="airtable">
    {children}
  </a>
);
