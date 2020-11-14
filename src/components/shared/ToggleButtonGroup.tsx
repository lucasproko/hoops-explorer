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
  label: string | React.ReactNode,
  tooltip: string,
  toggled: boolean,
  onClick: () => void
}

type Props = {
  items: ToggleButtonItem[],
  override?: boolean //(for testing, set to true to force it to render)
}

const ToggleButtonGroup: React.FunctionComponent<Props> = ({items, override}) => {

  const tooltip = (tooltip: string, i: number) => <Tooltip id={`tooltip-${i}`}>{tooltip}</Tooltip>;

  return (override || (typeof window !== `undefined`)) ?
    <div><small>Quick Select:</small>&nbsp;&nbsp;
    {
      items.map((item, index) => {
          return <span key={"divtog" + index}>
            <OverlayTrigger placement="auto" overlay={tooltip(item.tooltip, index)}>
              <Button onClick={item.onClick} size="sm" key={"tog" + index} variant={item.toggled ? "dark" : "outline-secondary"}>{item.label}</Button>
            </OverlayTrigger>
            &nbsp;&nbsp;
          </span>
      })
    }</div> : <div/>; //(this construct needed to address SSR caching issue)
};
export default ToggleButtonGroup;
