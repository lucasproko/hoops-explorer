// React imports:
import React, { useState } from 'react';


// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export type ToggleButtonItem = {
  label: string,
  tooltip: string,
  toggled: boolean,
  onClick: () => void
}

type Props = {
  items: ToggleButtonItem[]
}

const ToggleButtonGroup: React.FunctionComponent<Props> = ({items}) => {

  const tooltip = (tooltip: string, i: number) => <Tooltip id={`tooltip-${i}`}>{tooltip}</Tooltip>;

  return <div><small>Quick Select:</small>&nbsp;&nbsp;
  {
    items.map((item, index) => {
      return <span key={"divtog" + index}>
        <OverlayTrigger placement="top" overlay={tooltip(item.tooltip, index)}>
          <Button onClick={item.onClick} size="sm" key={"tog" + index} variant={item.toggled ? "dark" : "outline-secondary"}>{item.label}</Button>
        </OverlayTrigger>
        &nbsp;&nbsp;
        </span>;
    })
  }</div>;
};
export default ToggleButtonGroup;
