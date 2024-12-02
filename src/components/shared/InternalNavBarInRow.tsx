// Lodash:
import _ from "lodash";
import { Col, Row } from "react-bootstrap";

type Props = {
  refs: Record<string, React.RefObject<HTMLDivElement> | undefined>;
};

const InternalNavBarInRow: React.FunctionComponent<Props> = ({ refs }) => {
  return (
    <Row
      className="mt-2 sticky-top small pb-1"
      style={{ backgroundColor: "white", opacity: "85%", zIndex: 1 }}
    >
      <Col xs={12} className="text-center">
        <div>
          Jump to:{" "}
          {_.map(
            _.keys(refs).filter((ref) => refs[ref]),
            (key, idx) => (
              <span key={`internal-nav-${idx}`}>
                <a
                  href={`#`}
                  onClick={(e) => {
                    e.preventDefault();
                    refs[key]?.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {key}
                </a>
                {idx < _.size(refs) - 1 ? " | " : ""}
              </span>
            )
          )}
        </div>
      </Col>
    </Row>
  );
};
export default InternalNavBarInRow;
