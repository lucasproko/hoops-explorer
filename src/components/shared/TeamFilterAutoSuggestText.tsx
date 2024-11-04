// React imports:
import React, {
  useState,
  useEffect,
  createRef,
  ChangeEventHandler,
} from "react";
import Router from "next/router";

// Lodash
import _ from "lodash";

// Bootstrap imports:

// Library imports:

// Additional components:
// @ts-ignore
import TextInput from "react-autocomplete-input";
import AutocompleteTextField from "react-autocomplete-input";

/** The keydown event does not come from AutoSuggestText element */
export const notFromFilterAutoSuggest = (event: any) => {
  return event?.srcElement?.className?.indexOf("auto-suggest") < 0;
};

type Props = {
  readOnly: boolean;
  placeholder: string;
  value: string;
  autocomplete: string[];
  onChange: (ev: any) => void;
  onKeyUp: (ev: any) => void;
  onKeyDown: (ev: any) => void;
};
const TeamFilterAutoSuggestText: React.FunctionComponent<Props> = ({
  readOnly,
  placeholder,
  value,
  autocomplete,
  onChange,
  onKeyUp,
  onKeyDown,
}) => {
  const [currText, setCurrText] = useState(value);

  useEffect(() => {
    if (value != currText) {
      setCurrText(value);
    }
  }, [value]);

  // Data model

  const isDebug = process.env.NODE_ENV !== "production";

  const textRef = createRef<AutocompleteTextField>();

  // View

  return (
    <TextInput
      ref={textRef}
      Component={"textarea"}
      style={{ minHeight: "2.4rem", height: "2.4rem" }}
      value={currText}
      readOnly={readOnly}
      className="form-control auto-suggest"
      placeholder={placeholder}
      requestOnlyIfNoOptions={true} //(only requests if empty)
      options={autocomplete}
      trigger=""
      regex='^[A-Za-z0-9\\-_"]+$'
      matchAny={true}
      maxOptions={18}
      spaceRemovers={[";", ")", ":", "]"]}
      onChange={
        ((eventText: string) => {
          setCurrText(eventText);
          onChange({ target: { value: eventText } });
        }) as ((value: string) => void) &
          ChangeEventHandler<HTMLTextAreaElement>
      }
      onBlur={(ev: any) => {
        const currentTextRef = textRef.current as any;
        setTimeout(() => {
          //(give out of order events a chance!)
          try {
            currentTextRef.resetHelper();
          } catch (err: unknown) {}
        }, 100);
      }}
      onKeyUp={onKeyUp}
      onKeyDown={(ev: any) => {
        // Understanding this requires understanding of internals:
        //https://github.com/yury-dymov/react-autocomplete-input/blob/master/src/AutoCompleteTextField.js
        if (ev.keyCode == 9) {
          const underlyingObj = textRef.current as any;
          if (underlyingObj.state.helperVisible) {
            ev.preventDefault();
            ev.keyCode = 13;
            (textRef.current as any).handleKeyDown(ev);
          }
          //(else will just get passed up)
        } else {
          //(doesn't work for enter/return because of the CommonFilter-specific handler)
          onKeyDown(ev);
        }
      }}
    />
  );
};
export default TeamFilterAutoSuggestText;
