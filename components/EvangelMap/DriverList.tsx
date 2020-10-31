import { decodeGeodata } from "airtable-geojson";
import { RecipientsModel, RecipientRecord } from "./store/recipients";
import { DriversModel, DriverRecord } from "./store/drivers";
import { useStoreState } from "./store";
import Clipboard from "clipboard";
import { useEffect } from "react";

export const MARKER_SIZE = {
  TINY: 4,
  REGULAR: 8,
  LARGE: 12,
  HUGE: 16,
};

const EVANGEL_ADDRESS = "3920 27th St, Long Island City, Queens, NY";

interface DriverListProps {
  driverItems: DriversModel["items"];
  colorMap: RecipientsModel["colorMap"];
  itineraryMap: DriversModel["itineraryMap"];
  markerMap: RecipientsModel["markerMap"];
}

export const DriverList: React.FC<DriverListProps> = (props) => {
  const { driverItems, colorMap, itineraryMap, markerMap } = props;

  const isMinimized = useStoreState((state) => state.app.isDriverListMinimized);

  const drivers = Object.values(driverItems);

  useEffect(() => {
    const slack = new Clipboard("button.copy-slack", {
      target: function (trigger) {
        const driverDiv = trigger.parentElement.nextSibling as Element;
        return driverDiv;
      },
    });

    const mapquest = new Clipboard("button.copy-mapquest", {
      text: function (trigger) {
        const driverDiv = trigger.parentElement.nextSibling as HTMLDivElement;
        const recipientAddresses = Array.from(
          driverDiv.querySelectorAll(".recipient .address")
        ).map((el: HTMLDivElement) => el.dataset.normalizedAddress);
        const driverHomeAddress = driverDiv.dataset.normalizedAddress;

        const route = [
          EVANGEL_ADDRESS,
          ...recipientAddresses,
          driverHomeAddress,
        ];
        const text = route.join("\n");
        console.log(text);
        return text;
      },
    });

    return () => {
      slack.destroy();
      mapquest.destroy();
    };
  }, []);

  return (
    <div className="driver-list">
      {drivers.map((driver) => {
        const recipientItinerary = itineraryMap[driver.id];
        const color = colorMap[driver.id];

        return (
          <Driver
            key={driver.id}
            driver={driver}
            color={color}
            markerMap={markerMap}
            itineraryMap={itineraryMap}
          >
            {isMinimized && (
              <div style={{ padding: "0.5em 0" }}>
                {recipientItinerary?.map((_, i) => (
                  <div key={i} className="tick" style={{ background: color }}>
                    {" "}
                  </div>
                ))}
              </div>
            )}
            {!isMinimized &&
              recipientItinerary?.map((recipient) => (
                <Recipient
                  key={recipient.id}
                  recipient={recipient}
                  color={color}
                  markerMap={markerMap}
                />
              ))}
          </Driver>
        );
      })}
      <style jsx>{`
        .tick {
          display: inline-block;
          border: solid 1px white;
          height: 1em;
          width: 1em;
        }
      `}</style>
    </div>
  );
};

interface DriverProps {
  driver: DriverRecord;
  color: string;
  itineraryMap: DriversModel["itineraryMap"];
  markerMap: RecipientsModel["markerMap"];
}

const Driver: React.FC<DriverProps> = (props) => {
  const { driver, children, markerMap, itineraryMap, color } = props;

  const recipientIds = itineraryMap[driver.id]?.map((r) => r.id);
  const theseMarkers = Object.entries(markerMap).reduce(
    (acc, [recipientId, marker]) => {
      if (recipientIds?.includes(recipientId)) acc.push(marker);
      return acc;
    },
    []
  );
  const allOtherMarkers = Object.entries(markerMap).reduce(
    (acc, [recipientId, marker]) => {
      if (!recipientIds?.includes(recipientId)) acc.push(marker);
      return acc;
    },
    []
  );

  try {
    const geodata = decodeGeodata(driver.fields["Geocode cache"]);
    return (
      <div className="copy-buttons-and-driver">
        <div className="copy-buttons">
          <button className="copy-slack">Slack</button>
          <button className="copy-mapquest">Mapquest</button>
        </div>

        <div
          className="driver"
          key={driver.id}
          onMouseEnter={() => {
            theseMarkers.map((m) => m.setRadius(MARKER_SIZE.LARGE));
            allOtherMarkers.map((m) => m.setRadius(MARKER_SIZE.TINY));
          }}
          onMouseLeave={() => {
            theseMarkers.map((m) => m.setRadius(MARKER_SIZE.REGULAR));
            allOtherMarkers.map((m) => m.setRadius(MARKER_SIZE.REGULAR));
          }}
          data-normalized-address={geodata.o.formattedAddress}
        >
          <div className="driverName">
            <span>
              {driver.fields.Name} ({recipientIds?.length || 0})
            </span>
          </div>
          <div className="recipientList">{children}</div>
        </div>
        <style jsx>{`
          .copy-buttons-and-driver {
            position: relative;
          }

          .copy-buttons {
            position: absolute;
            right: 0.2em;
            top: 1.2em;
          }

          .copy-buttons button {
            border: solid 1px #ffffffff;
            background: #ffffff33;
            color: white;
            border-radius: 0.25em;
            padding: 0 0.25em;
            height: 1.6em;
            margin-left: 0.25em;
            opacity: 0.75;
            cursor: pointer;
          }

          .copy-buttons button:hover {
            opacity: 1;
          }

          .driver {
            padding-top: 1em;
          }

          .driverName {
            font-weight: 700;
            font-size: 1em;
            line-height: 1.8em;
            background: ${color}cc;
            color: white;
            padding: 0 0.5em;
            display: flex;
            justify-content: space-between;
          }

          .recipientList {
            border-left: solid 1px ${color};
            color: #333;
          }
        `}</style>
      </div>
    );
  } catch (error) {
    console.error({ error });
    return (
      <div>
        <p>⚠️ This driver couldn't be geocoded and shown on the map.</p>
      </div>
    );
  }
};

interface RecipientProps {
  recipient: RecipientRecord;
  color: string;
  markerMap: RecipientsModel["markerMap"];
}

const Recipient: React.FC<RecipientProps> = (props) => {
  const { recipient, color, markerMap } = props;

  const tblId = useStoreState((state) => state.recipients.metadata["Table ID"]);
  const viwId = useStoreState((state) => state.recipients.metadata["View ID"]);

  const geodata = decodeGeodata(recipient.fields["Geocode cache"]);
  const marker = markerMap[recipient.id];
  const hasNotes = Boolean(
    recipient.fields["Recurring notes"] ||
      recipient.fields["Notes"] ||
      recipient.fields["Dietary restrictions"] ||
      recipient.fields["Language"]
  );

  return (
    <div
      className="recipient"
      key={recipient.id}
      onMouseEnter={(e) => {
        marker.setRadius(MARKER_SIZE.HUGE);
      }}
      onMouseLeave={(e) => {
        marker.setRadius(MARKER_SIZE.LARGE);
      }}
    >
      <br />
      <div className="recipientName">
        <a
          target="airtable"
          // href={`https://airtable.com/${tblId}/${viwId}/${recipient.id}`}
          style={{ color, cursor: "pointer" }}
          onClick={() => {
            window.open(`https://airtable.com/${tblId}/${viwId}/${recipient.id}`, "airtable")
          }}
        >
          {recipient.fields.NameLookup?.[0]}
        </a>
        {recipient.fields["Confirmed?"] ? " ✓" : ""}
      </div>
      <div>
        <div
          className="address"
          data-normalized-address={geodata.o.formattedAddress}
        >
          <a
            target="gmap"
            href={encodeURI(
              `https://www.google.com/maps/dir/${geodata.o.formattedAddress}`
            )}
          >
            {recipient.fields["Address (computed)"]}
          </a>
        </div>

        <div className="phone">
          {recipient.fields.Phone?.[0]}{" "}
          {recipient.fields["Whatsapp Only"]?.[0] && (
            <span className="whatsapp-warning">⚠️ WhatsApp only</span>
          )}
        </div>

        {hasNotes && (
          <>
            <ul className="notes">
              <div className="header">NOTES</div>
              {recipient.fields["Notes"] && (
                <li className="body">{recipient.fields.Notes}</li>
              )}
              {recipient.fields["Recurring notes"] && (
                <li className="body">{recipient.fields["Recurring notes"]}</li>
              )}
              {recipient.fields["Dietary restrictions"] && (
                <li className="body">
                  Dietary restrictions:{" "}
                  <strong>{recipient.fields["Dietary restrictions"]}</strong>
                </li>
              )}
              {recipient.fields["Language"] &&
                recipient.fields["Language"] != "English" && (
                  <li className="body">
                    Preferred language:{" "}
                    <strong>{recipient.fields["Language"]}</strong>
                  </li>
                )}
            </ul>
          </>
        )}
      </div>

      <style jsx>{`
        .recipient {
          padding: 0 1em;
        }

        .recipientName {
          font-weight: bold;
          font-size: 1em;
        }

        .address {
          padding: 0.25em 0;
        }

        .address a {
          font-weight: 500;
          color: blue;
        }

        .phone {
          padding: 0.25em 0;
        }

        .whatsapp-warning {
          opacity: 0.6;
          padding-left: 0.25em;
        }

        ul.notes {
          padding: 0 0 0 1em;
          border-left: solid 2px #ddd;
        }

        .notes .header {
          font-weight: bold;
          font-size: 80%;
          color: #999;
          margin: 0.5em 0;
        }

        ul.notes li.body {
          font-style: italic;
          color: #666;
          margin-left: 1em;
        }

        a:hover {
          background: ${color}33;
        }
      `}</style>
    </div>
  );
};
