import React, { useRef, useEffect } from "react";

const ResponsiveContainer: React.FunctionComponent<{}> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mock the getBoundingClientRect method to return default dimensions
    if (ref.current) {
      ref.current.getBoundingClientRect = () =>
        ({
          x: 0,
          y: 0,
          width: 800, // arbitrary width
          height: 400, // arbitrary height
          top: 0,
          left: 0,
          right: 800,
          bottom: 400,
        } as unknown as DOMRect);
    }
  }, []);

  return (
    <div ref={ref} data-testid="responsive-container">
      {children}
    </div>
  );
};
export default ResponsiveContainer;
