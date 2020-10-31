import { useStoreState } from "./store";
import { AirtableHyperlink } from "./AirtableHyperlink";

export const Warnings = () => {
  const warnings = useStoreState((state) => state.recipients.warnings);
  const recipients = useStoreState((state) => state.recipients.items);
  const metadata = useStoreState((state) => state.recipients.metadata);

  const totalWarningCount = Object.values(warnings)
    .map((arr) => arr.length)
    .reduce((sum, val) => sum + val, 0);

  if (totalWarningCount === 0) return null;

  const primaryFieldName = metadata["Primary field name"];
  const tid = metadata["Table ID"];
  const vid = metadata["View ID"];
  return (
    <>
      <div className="warnings">
        {warnings.missingGeocodes?.length > 0 && (
          <ul>
            ⚠️ Missing geocodes
            {warnings.missingGeocodes.map((rid) => {
              return (
                <li key={rid}>
                  <AirtableHyperlink tid={tid} vid={vid} rid={rid}>
                    {recipients[rid].fields[primaryFieldName]}
                  </AirtableHyperlink>
                </li>
              );
            })}
          </ul>
        )}

        {warnings.missingLatLngs?.length > 0 && (
          <ul>
            ⚠️ Missing latitude/longitude
            {warnings.missingLatLngs.map((rid) => {
              return (
                <li key={rid}>
                  <AirtableHyperlink tid={tid} vid={vid} rid={rid}>
                    {recipients[rid].fields[primaryFieldName]}
                  </AirtableHyperlink>
                </li>
              );
            })}
          </ul>
        )}

        {warnings.genericLatLngs?.length > 0 && (
          <ul>
            ⚠️ Invalid addresses
            {warnings.genericLatLngs.map((rid) => {
              return (
                <li key={rid}>
                  <AirtableHyperlink tid={tid} vid={vid} rid={rid}>
                    {recipients[rid].fields[primaryFieldName]}
                  </AirtableHyperlink>
                </li>
              );
            })}
          </ul>
        )}

        {warnings.unavailableDrivers?.length > 0 && (
          <ul>
            ⚠️ Incorrect drivers
            {warnings.unavailableDrivers.map((rid) => {
              return (
                <li key={rid}>
                  <AirtableHyperlink tid={tid} vid={vid} rid={rid}>
                    {recipients[rid].fields[primaryFieldName]}
                  </AirtableHyperlink>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <style jsx>{`
        .warnings {
          margin-top: 1em;
          // font-style: italic;
        }
        ul {
        }
        li {
          margin-left: 1.5em;
          padding: 0.125em 0;
        }
      `}</style>
    </>
  );
};
