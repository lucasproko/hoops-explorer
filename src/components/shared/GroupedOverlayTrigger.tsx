// React imports:
import React, { useRef, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';
import Overlay from 'react-bootstrap/Overlay';

//@ts-ignorr
import useMouseLeave from 'use-mouse-leave';

type Props = {
  placement: "auto" | "left" | "right" | "top" | "bottom",
  show: boolean,
  onShowOrHide: (show: boolean) => void,
  overlay: React.ReactElement<any>
}

//(onMouseEnter / onMouseLeave don't work well, used a 3rd party lib which is OKish. The OverlayTrigger
// source code works great, it was too complex to port across in the time that I had available though)

/** Like an overlay trigger but many tooltips can be controlled by a single show field */
const GroupedOverlayTrigger: React.FunctionComponent<Props> = ({placement, show, onShowOrHide, overlay, ...props}) => {
  const ref = useRef(null);
  const [mouseLeft, mouseLeaveRef] = useMouseLeave();

  useEffect(() => {
      onShowOrHide(!mouseLeft)
  }, [mouseLeft]);

  return <div ref={mouseLeaveRef}>
    <div ref={ref}
      onFocus={() => onShowOrHide(true)}
      onBlur={() => onShowOrHide(false)}
    >
      {props.children}
    </div>
    <Overlay target={ref.current as unknown as HTMLDivElement} placement={placement} show={show}>
      {overlay}
    </Overlay>
  </div>;
};
export default GroupedOverlayTrigger;
