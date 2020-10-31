export const Box = ({ children, direction = "row", flex="1 0 auto" }) => {
  return (
    <>
      <div>{children}</div>

      <style jsx>
        {`
          div {
            display: flex;
            flex-direction: ${direction};
            flex: ${flex};
          }
        `}
      </style>
    </>
  );
};
