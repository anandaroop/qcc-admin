import { useStoreState, useStoreActions } from "../EvangelMap/store";

export const Help = () => {
  const isHelpVisible = useStoreState((state) => state.app.isHelpVisible);
  const showHelp = useStoreActions((actions) => actions.app.showHelp);
  const hideHelp = useStoreActions((actions) => actions.app.hideHelp);

  return (
    <>
      <div className="help">
        {isHelpVisible ? (
          <div className="content">
            <div className="toggle" onClick={() => hideHelp()}>
              Close ✕
            </div>
            <div className="scrollable">
              <h2>Airtable Map Viewer for Evangel Deliveries</h2>

              <p>Check out the notes below.</p>

              <p>
                If you still have questions drop em in the the{" "}
                <a href="https://queensdsa.slack.com/archives/C012THPS340">
                  #mutualaid-data
                </a>{" "}
                channel
              </p>

              <h3>What this is</h3>

              <p>
                This map app provides a friendlier view into the Airtable tables
                we use to manage deliveries.
              </p>

              <p>
                All <em>updates</em> to driving assignments are still made in
                the Airtable interface, but this map interface should make it
                much easier to <em>visualize</em> what drivers are available,
                where they are coming from, which stops are assigned to them,
                which stops still need to be assigned, and so on.
              </p>

              <h3>How to use this</h3>

              <p>There are basically two different ways to get this done:</p>

              <ol>
                <li>
                  Keep the Airtable{" "}
                  <a
                    target="grid"
                    href={`https://airtable.com/${process.env.NEXT_PUBLIC_AIRTABLE_RECIPIENTS_TABLE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_RECIPIENTS_MAP_VIEW_ID}`}
                  >
                    grid view for this delivery
                  </a>{" "}
                  open in another window and make assignments row-by-row in the{" "}
                  <strong>Driver</strong> column. Refresh this map view
                  frequently, to see the current state of the assignments.
                </li>
                <li>
                  Hover over the map markers to see a link to the associated
                  Airtable record. Click through to open that individual record
                  and assign a driver. (You'll have to scroll down to the{" "}
                  <strong>Driver</strong> field.) Refresh this map view
                  frequently, to see the current state of the assignments.
                </li>
              </ol>

              <p>
                <svg height="20" width="20" style={{ verticalAlign: "middle" }}>
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    stroke="red"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>{" "}
                Open rings represent drivers.
                <br />
                <br />
                <svg height="20" width="20" style={{ verticalAlign: "middle" }}>
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    stroke="red"
                    strokeWidth="0"
                    fill="red"
                  />
                </svg>{" "}
                Filled discs represent stops. Stops will be gray until they are
                assigned; then they will be color-coded to match their driver.
              </p>

              <p>
                Once all assignments are done, use the{" "}
                <span className="button">Mapquest</span> button to copy a driver
                itinerary into{" "}
                <a href="https://www.mapquest.com/routeplanner/copy-paste">
                  Mapquest's route optimization tool
                </a>
                . Be sure to turn on the "Allow us to re-order stops on your
                route" option before submitting the route, as that's what tells
                Mapquest to come up with the most time/fuel-efficient route. You
                can then populate the "Suggested order" column in the{" "}
                <strong>Delivery Recipients</strong> table to indicate the
                optimized itinerary.
              </p>

              <p>
                Once all itineraries are complete, use the{" "}
                <span className="button">Slack</span> button to copy a driver
                itinerary for pasting into Slack.
              </p>

              <h3>Pre-preparation</h3>

              <p>
                If you are about to do route planning, this has probably already
                been done for you, but just in case…
              </p>

              <p>
                These steps need to be performed beforehand, to get the tool set
                up for the next round of deliveries
              </p>

              <ul>
                <li>
                  Change filter on the view{" "}
                  <strong>
                    Volunteers: <em>Current Delivery Drivers Map</em>
                  </strong>{" "}
                  to match the name of the upcoming delivery, e.g. `Evangel -
                  2020-07-07`
                </li>

                <li>
                  Change filter on the view{" "}
                  <strong>
                    Delivery Recipients: <em>Map</em>
                  </strong>{" "}
                  to match the name of the upcoming delivery, e.g. `Evangel -
                  2020-07-07`
                </li>
                <li>
                  Double check that the Map App in{" "}
                  <strong>
                    Maps: Coordinated Deliveries &gt;{" "}
                    <em>Delivery Recipients: Map</em>
                  </strong>{" "}
                  is configured correctly (i.e. pulling from the Map view)
                </li>

                <li>
                  Double check that the Map App in{" "}
                  <strong>
                    Maps: Coordinated Deliveries &gt;{" "}
                    <em>Volunteers: Current Delivery Drivers Map</em>
                  </strong>{" "}
                  is configured correctly (i.e. pulling from the Current
                  Delivery Drivers Map view)
                </li>
              </ul>

              <p>
                <em>
                  NOTE: Sometimes it seems that simply opening the the Map App
                  configuration is necessary to kick off geocoding of all the
                  recipient records.
                </em>
              </p>
            </div>
          </div>
        ) : (
          <div className="toggle" onClick={() => showHelp()}>
            Need help?
          </div>
        )}
      </div>

      <style jsx>{`
        .help {
          position: absolute;
          left: 1em;
          bottom: 1em;
          z-index: 1000;
          background: #ffffffdd;
          box-shadow: 0 0 8px #00000033;
          border-radius: 0.5em;
          line-height: 1.4;
        }

        .content {
          padding: 1em;
          width: 22em;
        }

        .toggle {
          color: #e7212f;
          padding: 1em;
          cursor: pointer;
          text-align: right;
        }

        .scrollable {
          max-height: calc(100vh - 10rem - 80px);
          overflow: scroll;
        }

        .button {
          border: solid 1px gray;
          background: #ffffff33;
          border-radius: 0.25em;
          padding: 0 0.25em;
        }
      `}</style>
    </>
  );
};
