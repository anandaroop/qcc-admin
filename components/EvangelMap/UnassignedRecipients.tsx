import { RecipientsModel, RecipientRecord } from "./store/recipients";
import { MARKER_SIZE } from "./DriverList";
import { useStoreState } from "./store";
import { AirtableHyperlink } from "./AirtableHyperlink";

interface UnassignedRecipientsProps {
  recipients: RecipientRecord[];
  markerMap: RecipientsModel["markerMap"];
}

export const UnassignedRecipients: React.FC<UnassignedRecipientsProps> = (
  props
) => {
  const { recipients, markerMap } = props;

  const recipientsMetadata = useStoreState(
    (state) => state.recipients.metadata
  );
  const tid = recipientsMetadata?.["Table ID"];
  const vid = recipientsMetadata?.["View ID"];

  const alphabetizedRecipients = recipients.sort((a, b) => {
    if (a.fields.NameLookup < b.fields.NameLookup) return -1;
    if (a.fields.NameLookup > b.fields.NameLookup) return 1;
    return 0;
  });
  return (
    <>
      <div className="unassigned-recipients">
        <h2>Unassigned ({recipients.length})</h2>
        {alphabetizedRecipients.map((recipient) => {
          const marker = markerMap[recipient.id];

          return (
            <div
              key={recipient.id}
              className="recipient"
              onMouseEnter={() => {
                if (!marker) return;
                marker.setRadius(MARKER_SIZE.LARGE);
                marker.setStyle({ color: "red", fillColor: "none", weight: 4 });
                marker.bringToFront();
              }}
              onMouseLeave={() => {
                if (!marker) return;
                marker.setRadius(MARKER_SIZE.REGULAR);
                marker.setStyle({ color: "none", fillColor: "gray" });
                marker.bringToBack();
              }}
            >
              <div className="name">
                <AirtableHyperlink tid={tid} vid={vid} rid={recipient.id}>
                  {recipient.fields.NameLookup}
                </AirtableHyperlink>
              </div>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .unassigned-recipients {
          padding: 1em 0 2em 0;
        }
        .recipient {
          padding: 0.25em 0;
        }
      `}</style>
    </>
  );
};
