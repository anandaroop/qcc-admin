export const Container = ({ children, direction = "row" }) => {
  return (
    <>
      <div>{children}</div>

      <style jsx>
        {`
          div {
            display: flex;
            flex-direction: ${direction};
            width: 100%;
            height: calc(100vh - 2rem);
            overflow: hidden;
          }
        `}
      </style>
    </>
  );
};
