export const Box: React.FC<{
  direction: "row" | "column"
  flex: string
}> = ({ children, direction = "row", flex = "1 0 auto" }) => {
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
  )
}
