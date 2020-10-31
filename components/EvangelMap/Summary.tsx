import { useStoreActions, useStoreState } from "./store";

export const Summary = () => {
  const driverItems = useStoreState((state) => state.drivers.items);
  const recipientCounts = useStoreState((state) => state.recipients.counts);

  const isMinimized = useStoreState((state) => state.app.isDriverListMinimized);
  const maximize = useStoreActions((actions) => actions.app.maximizeDriverList);
  const minimize = useStoreActions((actions) => actions.app.minimizeDriverList);

  return (
    <div className="summary">
      <span className="assigned">{recipientCounts.assigned} assigned</span>
      <span className="unassigned">
        {recipientCounts.unassigned} unassigned
      </span>
      <span className="drivers">{Object.keys(driverItems).length} drivers</span>
      <a
        className="toggle"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          isMinimized ? maximize() : minimize();
        }}
      >
        {isMinimized ? "Maximize" : "Minimize"}
      </a>
      <style jsx>
        {`
          .summary {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .summary > * {
            padding-right: 0.5em;
            text-align: center;
          }
          .summary > .toggle {
            padding-right: 0;
          }
        `}
      </style>
    </div>
  );
};
