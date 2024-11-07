// React imports:
import React, {
  useState,
  useEffect,
  createRef,
  ChangeEventHandler,
} from "react";

// Lodash
import _ from "lodash";

// Library imports:

// Additional components:
import TextAreaAutocomplete from "./TextAreaAutocomplete";

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
const AdvancedFilterAutoSuggestText: React.FunctionComponent<Props> = ({
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

  const textRef = createRef<HTMLTextAreaElement>();

  // View

  return (
    <TextAreaAutocomplete
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
      spaceRemovers={[";", ")", ":", "]", " "]}
      passThroughEnter={true}
      passThroughTab={false}
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
      onKeyDown={onKeyDown}
    />
  );
};
export default AdvancedFilterAutoSuggestText;
