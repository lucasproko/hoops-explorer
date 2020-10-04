
import React, { useState, useEffect } from 'react';

import Form from 'react-bootstrap/Form';

type Props = {
  startingVal?: string,
  validate?: (t: string) => boolean,
  onChange: (t: string) => void,
  timeout: number,
  placeholder?: string,
};

/** More responsive form control - must set if validate is set then startingVal is locked else just starting */
const AsyncFormControl: React.FunctionComponent<Props> = ({startingVal, validate, timeout, onChange, placeholder, ...props}) => {

  var timeoutId = -1;

  const [ internalVal, setInternalVal ] = useState(startingVal || "");
  useEffect(() => {
    setInternalVal(startingVal || "");
  }, [ startingVal ]);

  /** Handling filter change (/key presses to fix the select/delete on page load) */
  const internalOnChange = (ev: any) => {
    const toSet = ev.target.value;
    if (timeoutId != -1) {
      window.clearTimeout(timeoutId);
    }
    timeoutId = (window.setTimeout(() => {
      onChange(toSet);
    }, timeout));
  };

  return validate ?
    <Form.Control
      onChange={(ev: any) => {
        const newVal = ev.target.value;
        if (validate(newVal)) {
          internalOnChange(ev);
          setInternalVal(newVal);
        }
      }}
      value={internalVal}
      placeholder={placeholder}
      {...props}
    />
    :
    <Form.Control
      onKeyUp={internalOnChange}
      onChange={internalOnChange}
      placeholder={placeholder}
      defaultValue={internalVal}
      {...props}
    />;
}
export default AsyncFormControl;
