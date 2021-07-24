// React imports:
import React, { useState, useEffect } from 'react';

//lodash
import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';

// Additional components
import Select, { components} from "react-select";
import GenericTable, { GenericTableOps } from "../GenericTable";

// Utils:
import { CommonTableDefs } from "../../utils/tables/CommonTableDefs";

// External Data Model

type Props = {
  show: boolean,
  players: Record<string, any>[],
  onHide: () => void,
  onSave: (onBallDefense: any[]) => void,
  onBallDefense: any[],
  showHelp: boolean
};
const OnBallDefenseModal: React.FunctionComponent<Props> = (
  {players, onSave, onBallDefense, showHelp, ...props}
) => {

  // State:

  const [ inputContents, setInputContents ] = useState(_.isEmpty(onBallDefense) ? "" : "TODO");
  const [ inputChanged, setInputChanged ] = useState(false);

  const [ parseStatus, setParseStatus ] = useState(<span>
    <li>Awaiting input</li>
    </span>);

  const onApply = (clipboard: string | undefined) => {
    const contents = clipboard || inputContents;
    // Analyze incoming data:

    const rowsCols: string[][] =
      contents
        .split("\n").filter(line => _.endsWith(line, "%"))
        .map(line => line.split("\t")).filter(cols => cols.length > 5);

    const playerNumberToCol = _.transform(rowsCols, (acc, cols) => {
      const playerId = cols[0]!;
      const playerIdComps = playerId.split(" ");
      if (_.startsWith(playerId, "#")) {
        acc[playerIdComps[0]] = cols;
      }
    }, {});

    const matchedPlayers = _.transform(players, (acc, player, ii) => {
      const rosterId = "#" + (player.roster?.number || "??");
      const backupRosterId = "#" + (player.roster?.alt_number || "??");
      const matchingRosterId = playerNumberToCol.hasOwnProperty(rosterId) ? rosterId :
        (playerNumberToCol.hasOwnProperty(backupRosterId) ? backupRosterId : undefined);
      if (matchingRosterId) {
        acc.found.push(ii);
        acc.matchedCols.push(matchingRosterId)
      } else {
        acc.notFound.push(ii);
      }
    }, { found: [], notFound: [], matchedCols: [] });

    const colsNotMatched = _.chain(playerNumberToCol).omit(matchedPlayers.matchedCols).keys().value();

    if (_.isEmpty(matchedPlayers.notFound) && _.isEmpty(colsNotMatched)) {
      setParseStatus(
        <span>
          <li>Import succeeded</li>
        </span>
      );
    } else if (!_.isEmpty(matchedPlayers.found)){
      setParseStatus(
        <span>
          <li>Import succeeded, with possible issues: </li>
          <ul>
            {_.isEmpty(matchedPlayers.notFound) ?
              <li>Matched all players with recorded stats</li>
              :
              <li>Didn't match these players: {matchedPlayers.notFound.map(index => {
                const player = players[index];
                return `[#${player.roster?.number || "??"} / ${player.code}]`;
              }).join(", ")}</li>
            }
            {_.isEmpty(matchedPlayers.notFound) ?
              null :
              <ul>
                <li><i>Try changing the number to match - if that works, contact me and I'll update my database.</i></li>
              </ul>
            }
            <li>Didn't match these entries from the input: {colsNotMatched.map(key => {
              const col = playerNumberToCol[key];
              return `[${col[0]}]`;
            }).join(", ")}</li>
            {_.isEmpty(matchedPlayers.notFound) ?
              <ul>
                <li><i>(Likely just walk-ons, you can ignore them)</i></li>
              </ul>
              :
              null
            }
          </ul>
        </span>
      );
    } else {
      setParseStatus(
        <span>
          <li>Import failure, no players matched.</li>
        </span>
      );
    }

    //(handy debug)
    //console.log(JSON.stringify(matchedPlayers) + " / " + colsNotMatched);
  };

  return <div><Modal size="lg" {...props}
    onEntered={() => {
      document.body.style.overflow = "scroll";
    }}
  >
    <Modal.Header closeButton>
      <Modal.Title>On Ball Defense</Modal.Title>&nbsp;{showHelp ?
        <a target="_blank" href="https://hoop-explorer.blogspot.com/TODO.html">(?)</a> : null
      }
    </Modal.Header>
    <Modal.Body>
      <Card className="w-100">
        <Card.Header className="small">Input</Card.Header>
        <Card.Body>
          <Form>
            <Form.Row>
              <Form.Group as={Col} sm="12">
                <InputGroup>
                  <FormControl as="textarea"
                    value={inputContents}
                    onPaste={(ev: any) => { onApply(ev.clipboardData.getData('Text')); }}
                    onChange={(ev: any) => { setInputChanged(true); setInputContents(ev.target.value); }}
                    onKeyUp={(ev: any) => { setInputChanged(true); setInputContents(ev.target.value); }}
                    placeholder="Paste on-ball defense table from web page or Google Sheets"
                  />
                </InputGroup>
              </Form.Group>
            </Form.Row>
          </Form>
        </Card.Body>
      </Card>

      <Card className="w-100">
        <Card.Header className="small">Status</Card.Header>
        <Card.Body>
          <Container>
            <Row>
              <ul>
                {parseStatus}
                <br/>
                <li><i>(no previous dataset)</i></li>
              </ul>
            </Row>
          </Container>
        </Card.Body>
      </Card>

    {
      //TODO: would be nice to have a table showing before/after for all players
    }

    </Modal.Body>
    <Modal.Footer>
      <Button disabled={inputContents.length == 0} variant="warning" onClick={() => {
        //TODO change processing
        setInputContents("");
      }}>Clear</Button>
      <Button disabled={true} variant="warning" onClick={() => null}>Reset</Button>
      <Button disabled={!inputChanged} variant="info" onClick={() => onApply()}>Apply changes</Button>
      <Button variant="primary" onClick={() => onHide()}>Done</Button>
    </Modal.Footer>
  </Modal></div>;
};
export default OnBallDefenseModal;
