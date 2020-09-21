// React imports:
import React, { useRef } from 'react';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';
import Overlay from 'react-bootstrap/Overlay';


type Props = {
  placement: "auto" | "left" | "right" | "top" | "bottom",
  show: Boolean,
  onShowOrHide: (show: boolean) => void,
  overlay: React.ReactNode
}

//TODO: onMouseEnter/onMouseLeave arern't super reliable, maybe either look into
// https://github.com/mjsarfatti/use-mouse-leave/ or https://github.com/react-bootstrap/react-bootstrap/blob/v1.3.0/src/OverlayTrigger.tsx

const GroupedOverlayTrigger: React.FunctionComponent<Props> = ({placement, show, onShowOrHide, overlay, ...props}) => {
  const ref = useRef(null);
  return <div>
    <div ref={ref}
      onFocus={() => onShowOrHide(true)}
      onBlur={() => onShowOrHide(false)}
      onMouseEnter={() => onShowOrHide(true)}
      onMouseLeave={() => onShowOrHide(false)}
    >
      {props.children}
    </div>
    <Overlay target={ref.current} placement={placement} show={show}>
      {overlay}
    </Overlay>
  </div>;
};
export default GroupedOverlayTrigger;
