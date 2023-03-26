// React imports:
import React, { useState } from 'react';

// Next imports:
import { NextPage } from 'next';

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import Container from 'react-bootstrap/Container';
import { InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import AdvancedFilterAutoSuggestText, { notFromFilterAutoSuggest } from './AdvancedFilterAutoSuggestText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faExclamation } from '@fortawesome/free-solid-svg-icons';

type Props = {
  readonly label?: string,
  readonly prompt: string,
  readonly startingVal: string,
  readonly error?: string,
  readonly autocomplete: string[],
  readonly callback: (newExpr: string) => void
}

const LinqExpressionBuilder: React.FunctionComponent<Props> = ({label, prompt, startingVal, error, autocomplete, callback}) => {

  const [ tmpAdvancedFilterStr, setTmpAdvancedFilterStr ] = useState(startingVal);


   /** Keyboard listener - handles global page overrides while supporting individual components */
   const submitListenerFactory = (inAutoSuggest: boolean) => (event: any) => {
    const allowKeypress = () => {
       //(if this logic is run inside AutoSuggestText, we've already processed the special cases so carry on)
       return inAutoSuggest || notFromFilterAutoSuggest(event);
    };
    if (event.code === "Enter" || event.code === "NumpadEnter" || event.keyCode == 13 || event.keyCode == 14) {
       if (allowKeypress() && (tmpAdvancedFilterStr != startingVal)) {
          callback(tmpAdvancedFilterStr);
       } else if (event && event.preventDefault) {
          event.preventDefault();
       }
    } else if (event.code == "Escape" || event.keyCode == 27) {
       if (allowKeypress()) {
          document.body.click(); //closes any overlays (like history) that have rootClick
       }
    }
 };

  const editingAdvFilterTooltip = (
    <Tooltip id="editingAdvFilterTooltip">Press enter to apply this Linq filter</Tooltip>
  );
  const doneAdvFilterTooltip = (
    <Tooltip id="doneAdvFilterTooltip">Filter successfully applied</Tooltip>
  );
  const errorAdvFilterTooltip = (
    <Tooltip id="errorAdvFilterTooltip">Malformed Linq query: [{error || ""}]</Tooltip>
  );
  const editingAdvFilterText = <OverlayTrigger placement="auto" overlay={editingAdvFilterTooltip}><div>...</div></OverlayTrigger>;
  const doneAdvFilterText = error ?
    <OverlayTrigger placement="auto" overlay={errorAdvFilterTooltip}><FontAwesomeIcon icon={faExclamation} /></OverlayTrigger> :
    <OverlayTrigger placement="auto" overlay={doneAdvFilterTooltip}><FontAwesomeIcon icon={faCheck} /></OverlayTrigger>;

 return <InputGroup>
    {prompt ? <InputGroup.Text style={{ maxHeight: "2.4rem" }}>{label}</InputGroup.Text> : null}
    <InputGroup.Text style={{ maxHeight: "2.4rem" }}>{
      startingVal != tmpAdvancedFilterStr ? editingAdvFilterText : doneAdvFilterText
    }</InputGroup.Text>
    <div className="flex-fill">
      <AdvancedFilterAutoSuggestText
        readOnly={false}
        placeholder={prompt}
        autocomplete={autocomplete}
        initValue={tmpAdvancedFilterStr}
        onChange={(ev: any) => setTmpAdvancedFilterStr(ev.target.value)}
        onKeyUp={(ev: any) => setTmpAdvancedFilterStr(ev.target.value)}
        onKeyDown={submitListenerFactory(true)}
      />
    </div>
  </InputGroup>;

}

export default LinqExpressionBuilder;
