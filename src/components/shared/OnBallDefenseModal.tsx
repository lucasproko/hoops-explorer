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
import { OnBallDefenseModel, RatingUtils } from "../../utils/stats/RatingUtils";

//TODO: #1: need to clear when changing team/year/etc
//TODO: #2: need to allow "0" + in front of rosterId

// External Data Model

type Props = {
  show: boolean,
  players: Record<string, any>[],
  onHide: () => void,
  onSave: (onBallDefense: OnBallDefenseModel[]) => void,
  onBallDefense: OnBallDefenseModel[],
  showHelp: boolean
};
const OnBallDefenseModal: React.FunctionComponent<Props> = (
  {players, onSave, onBallDefense, showHelp, ...props}
) => {

  // State:

  /** Idempotent conversion of on ball stats to the TSV */
  const parseInput = (stats: OnBallDefenseModel[]) => {
    const st = stats[0]!;
    const headerRow = "Team,-,Plays,Pts,-,-,-,FGm,-,-,-,-,TOV%,-,-,score%".replace(",", "\t");
    const teamRow = `Team,-,${st.totalPlays},${st.totalPts},-,-,-,-,-,-,-,-,-,-,-,${st.totalScorePct}`.replace(",", "\t");

    const rows = stats.map(s => {
      return `Team,-,${s.plays},${s.pts},-,-,-,${s.fgMiss},-,-,-,-,${s.tovPct},-,-,${s.scorePct}`.replace(",", "\t");
    });

    return `${headerRow}\n${teamRow}\n${rows.join("\n")}`
  };

  const [ inputContents, setInputContents ] = useState(_.isEmpty(onBallDefense) ? "" : parseInput(onBallDefense));
  const [ inputChanged, setInputChanged ] = useState(false);

  const [ parseStatus, setParseStatus ] = useState(<span>
    <li>Awaiting input</li>
    </span>);

  const onApply = (clipboard: string | undefined) => {
    const contents = !_.isNil(clipboard) ? clipboard : inputContents;
    // Analyze incoming data:

    const rowsCols: string[][] =
      contents
        .split("\n").filter(line => _.endsWith(line, "%"))
        .map(line => line.split("\t")).filter(cols => cols.length > 5);

    const maybeTotals = _.startsWith(rowsCols[0], "#") ? undefined : rowsCols[0];

    const playerNumberToColAndDups = _.transform(rowsCols, (acc, cols) => {
      const playerId = cols[0]!;
      const playerIdComps = playerId.split(" ");
      if (_.startsWith(playerId, "#")) {
        if (acc.unique.hasOwnProperty(playerIdComps[0])) {
          acc.dups.push(playerId);
          acc.dups.push(acc.unique[playerIdComps[0]][0]);
        } else {
          acc.unique[playerIdComps[0]] = cols;
        }
      }
    }, { unique: {}, dups: [] });

    const playerNumberToCol = playerNumberToColAndDups.unique;
    const dupColMatches = playerNumberToColAndDups.dups;

    const getMatchingRosterId = (roster: Record<string, string>) => {
      const rosterId = "#" + (roster?.number || "??");
      const backupRosterId = "#" + (roster?.alt_number || "??");
      return playerNumberToCol.hasOwnProperty(rosterId) ? rosterId :
              (playerNumberToCol.hasOwnProperty(backupRosterId) ? backupRosterId : undefined);
    };
    const matchedPlayers = _.transform(players, (acc, player, ii) => {
      const matchingRosterId = getMatchingRosterId(player.roster || {});
      if (matchingRosterId) {
        acc.found.push(ii);
        acc.matchedCols.push(matchingRosterId)
      } else {
        acc.notFound.push(ii);
      }
    }, { found: [], notFound: [], matchedCols: [] });

    const colsNotMatched = _.chain(playerNumberToCol).omit(matchedPlayers.matchedCols).keys().value();

    // Convert TSV to data structures

    const parseFloatOrMissing = (s: string | undefined) => {
      const tmp = parseFloat(s || "-");
      return _.isNaN(tmp) ? 0 : tmp;
    };
    const parseRow = (code: string, row: string[]) => {
      return {
        code: code,
        title: row[0],

        pts: parseFloatOrMissing(row[3]),
        plays: parseFloatOrMissing(row[2]),
        scorePct: parseFloatOrMissing(row[15]),
        tovPct: parseFloatOrMissing(row[12]),
        fgMiss: parseFloatOrMissing(row[7]),

        // Fill these in later:
        totalPlays: -1,
        uncatPts: -1,
        uncatPlays: -1,
        uncatScorePct: -1
      };
    };
    const matchedPlayerStats = matchedPlayers.found.map(ii => {
      const player = players[ii]!;
      const matchingRosterId = getMatchingRosterId(player.roster || {});
      const row = playerNumberToCol[matchingRosterId] || [];
      const onBallDefense = parseRow(player.code || matchingRosterId, row);
      return onBallDefense;
    });
    const unmatchedPlayerStats = colsNotMatched.map(rosterId => {
      const row = playerNumberToCol[rosterId] || [];
      const onBallDefense = parseRow(rosterId, row);
      return onBallDefense;
    });

    // If there's a totals row we can now add team stats (can still do something otherwise)
    if (maybeTotals) {
      const totalStats = parseRow("totals", maybeTotals);
      RatingUtils.buildUncatOnBallDefenseStats(totalStats, _.concat(matchedPlayerStats, unmatchedPlayerStats));
        //(mutates the objects in these array)
    }

    // Finally, update status
    //TODO: might be nice to collect and report stats errors?

    if (_.isEmpty(matchedPlayers.notFound) && _.isEmpty(colsNotMatched) && maybeTotals && _.isEmpty(dupColMatches)) {
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
            {_.isEmpty(dupColMatches) ? null
              :
              <li>Duplicate player numbers in roster. This will likely mess up the stats, so remove one of each pair: [{dupColMatches.join(", ")}].</li>
            }
            {maybeTotals ? null
              :
              <li>Couldn't find team stats, first row was [{rowsCols[0]?.join("|")}] - this will make stats adjustments unreliable</li>
            }
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
    } else if (contents) {
      setParseStatus(
        <span>
          <li>Import failure, no players matched.</li>
        </span>
      );
    } else {
      setParseStatus(
        <span>
          <li>Awaiting input</li>
        </span>
      );
    }

    onSave(matchedPlayerStats);
    setInputContents(contents);

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
        onApply("");
      }}>Clear</Button>
      <Button disabled={!inputChanged} variant="info" onClick={() => onApply()}>Apply changes</Button>
      <Button variant="primary" onClick={() => props.onHide()}>Done</Button>
    </Modal.Footer>
  </Modal></div>;
};
export default OnBallDefenseModal;
