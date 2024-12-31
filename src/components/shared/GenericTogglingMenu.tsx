// React imports:
import React, { useState } from "react";

// Icons:
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

// Bootstrap imports:
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "react-bootstrap/Dropdown";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

type Props = {
  size?: "sm" | "lg";
};

const GenericTogglingMenu: React.FunctionComponent<Props> = ({
  size,
  children,
}) => {
  // Some extra logic for the config dropdown:
  const [configDropdownOpen, setConfigDropdownOpen] = useState(false);

  const handleToggle = (open: boolean, ev: any, eventType: any) => {
    if (!open && eventType.source == "select") {
      setConfigDropdownOpen(true); //(keep open on select)
    } else {
      setConfigDropdownOpen(open);
    }
  };

  const advancedSettingsTooltip = (
    <Tooltip id="gearTooltip">Advanced options</Tooltip>
  );

  return (
    <Dropdown
      alignRight
      drop="up"
      onToggle={handleToggle}
      show={configDropdownOpen}
    >
      <OverlayTrigger placement="bottom" overlay={advancedSettingsTooltip}>
        <Dropdown.Toggle
          size={size}
          variant="outline-secondary"
          id="dropdown-basic"
        >
          <FontAwesomeIcon icon={faCog} />
        </Dropdown.Toggle>
      </OverlayTrigger>
      <Dropdown.Menu>{children}</Dropdown.Menu>
    </Dropdown>
  );
};
export default GenericTogglingMenu;
