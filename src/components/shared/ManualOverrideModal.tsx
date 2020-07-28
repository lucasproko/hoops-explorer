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
import { ManualOverride, ParamPrefixes, ParamPrefixesType } from '../../utils/FilterModels';
import { CommonTableDefs } from "../../utils/CommonTableDefs";

// External Data Model

type Props = {
  tableType: ParamPrefixesType,
  inStats: any[],
  show: boolean,
  onHide: () => void,
  onSave: (overrides: ManualOverride[]) => void,
  overrides: ManualOverride[],
  showHelp: boolean
};
const ManualOverrideModal: React.FunctionComponent<Props> = ({tableType, inStats, onSave, overrides, showHelp, ...props}) => {

  //(TODO: lots of work to make this more generic and not just per player)

  const inStatsLabel = (() => {
    switch (tableType) {
      case ParamPrefixes.player: return "Player";
      default: return "Unknown";
    }
  })();

  // Starting values:
  const [ currInStat, setCurrInStat ] = useState("" as string);
  const [ currStatName, setCurrStatName ] = useState("" as string);
  const [ oldStatVal, setOldStatVal ] = useState(0 as number);
  const [ currReplacement, setCurrReplacement ] = useState(0 as number);

  // Player/lineup/row

  /** Formats a stat set into a label */
  const statToOption = (statSet: any) => {
    if (statSet) {
      const labelAndVal = `${statSet.key} / ${statSet.onOffKey}`;
      return [{
        label: labelAndVal,
        value: labelAndVal
      }];
    } else return [];
  };

  /** From stat set label to stat set */
  const valueToStatMap = _.fromPairs(
    _.flatMap(inStats, stat => statToOption(stat).map(s =>  [s.label, stat ]))
  );

  // Lits of metrics

  const metricsMap = _.fromPairs((() => {
    switch (tableType) {
      case ParamPrefixes.player: return _.sortBy([
        [ "off_3p", "Offensive 3P%" ],
        [ "off_2pmid", "Offensive mid-range 2P%" ],
        [ "off_2prim", "Offensive rim/dunk 2P%" ],
        [ "off_ft", "Offensive FT%" ],
//TODO: avoid rate stats for now ... longer term would like to be able to say
// more mid-range shots, more rim shots, etc and can also include FTR then
//        [ "off_ftr", "Offensive FT rate" ],
        [ "off_to", "Offensive TO%" ],
      ], [ (o: any[]) => o[1] ]);
      default: return [];
    }
  })());

  const metricToOption = (valLabel: [ string, string ]) => {
    if (valLabel[0]) {
      return [ { label: valLabel[1], value: valLabel[0] } ];
    } else {
      return [];
    }
  };

  // Control

  const getOldVal = (playerStat: any) => {
    return (_.isNil(playerStat?.old_value) ? playerStat?.value : playerStat?.old_value) || 0;
  }

  /** If the entry can be added to the list */
  const isDefined = (inStat: string, statName: string) => inStat != "" && statName != "";

  /** When the player/stat is changed, recalc the stats */
  const updateValues = (inStat: string, statName: string) => {
    if (isDefined(inStat, statName)) {
      const playerStat = valueToStatMap?.[inStat]?.[statName];
      const startingVal = 100*getOldVal(playerStat);
      const currValVal = 100*(playerStat?.value || 0);
      setOldStatVal(startingVal);
      setCurrReplacement(parseFloat(currValVal.toFixed(1)));
    }
  }

  /** Update the overrides list with the new value */
  const addToOverrides = () => {
    const newObj = {
      rowId: currInStat,
      statName: currStatName,
      newVal: currReplacement
    };
    const currObj = _.find(overrides, (o) => o.rowId == newObj.rowId && o.statName == newObj.statName);
    if (currObj) {
      currObj.newVal = newObj.newVal;
    }
    onSave(overrides.concat(currObj ? [] : [newObj]));
  };

  /** Remove an override */
  const removeOverride = (toRemove: ManualOverride) => {
    onSave(overrides.filter((over) => (toRemove.rowId != over.rowId) || (toRemove.statName != over.statName)));
  };

  /** Remove an override */
  const selectOverride = (select: ManualOverride) => {
    setCurrInStat(select.rowId);
    setCurrStatName(select.statName);
    updateValues(select.rowId, select.statName);
  };

  // Table building:

  const manualOverridesTable = {
    title: GenericTableOps.addTitle("Player", "The player / subset", CommonTableDefs.singleLineRowSpanCalculator, "", GenericTableOps.htmlFormatter),
    stat: GenericTableOps.addTitle("Statistic", "The overriden statistic", CommonTableDefs.singleLineRowSpanCalculator, "", GenericTableOps.htmlFormatter),
    sep0: GenericTableOps.addColSeparator(),
    to: GenericTableOps.addPctCol("New", "The new value of the statistic for the player", GenericTableOps.defaultColorPicker),
    from: GenericTableOps.addPctCol("Original", "The actual value of the statistic for the player", GenericTableOps.defaultColorPicker),
  };

  const tableData = _.chain(overrides).sortBy([ "rowId", "statName" ]).flatMap((over) => {
    const playerRow = valueToStatMap[over.rowId];
    if (playerRow) {
      return [GenericTableOps.buildDataRow({
        title: <span>
          {over.rowId}<br/>
          <a href="#" onClick={() => {
            removeOverride(over);
            return false;
          }}>(delete)</a>
          &nbsp;{
            over.rowId == currInStat && over.statName == currStatName ? <i>(select)</i> :
            <a href="#" onClick={() => {
              selectOverride(over);
              return false;
            }}>(select)</a>}
        </span>,
        stat: <span>{metricsMap[over.statName] || over.statName}</span>,
        to: { value: 0.01*over.newVal },
        from: { value: getOldVal(playerRow[over.statName] || 0) },
      }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)];
    } else {
      return [];
    }
  }).value();

  // View

  return <div><Modal size="lg" {...props}>
    <Modal.Header closeButton>
      <Modal.Title>Manual Overrides</Modal.Title>&nbsp;{showHelp ?
        <a target="_blank" href="https://hoop-explorer.blogspot.com/TODO.html">(?)</a> : null
      }
    </Modal.Header>
    <Modal.Body>
      <Card className="w-100">
        <Card.Header className="small">Add New Override</Card.Header>
        <Card.Body>
          <Form>
            <Form.Row>
              <Form.Group as={Col} sm="12">
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text id="inStat">{inStatsLabel}</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Select
                    className="w-75"
                    value={statToOption(valueToStatMap[currInStat])}
                    options={_.flatMap(inStats, stat => statToOption(stat))}
                    onChange={(option) => {
                      const val = (option as any)?.value;
                      if (val) {
                        setCurrInStat(val);
                        updateValues(val, currStatName);
                      }
                    }}
                  />
                </InputGroup>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} sm="10">
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text id="inStatKey">Metric</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Select
                    className="w-75"
                    value={metricToOption([currStatName, metricsMap[currStatName]])}
                    options={_.chain(metricsMap).toPairs().flatMap(stat => metricToOption(stat)).value()}
                    onChange={(option) => {
                      const val = (option as any)?.value;
                      if (val) {
                        setCurrStatName(val);
                        updateValues(currInStat, val);
                      }
                    }}
                  />
                </InputGroup>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <InputGroup as={Col} sm="4">
                <InputGroup.Prepend>
                  <InputGroup.Text id="from">From</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  disabled
                  value={oldStatVal.toFixed(1)}
                />
                <InputGroup.Append>
                  <InputGroup.Text id="pct">%</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              <InputGroup as={Col} sm="4">
                <InputGroup.Prepend>
                  <InputGroup.Text id="to">To</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="number"
                  disabled={!isDefined(currInStat, currStatName)}
                  onChange={(ev: any) => {
                    const num = parseFloat(ev.target.value);
                    if ((num != NaN) && (num >= 0)) {
                      setCurrReplacement(num)
                    }
                  }}
                  placeholder = "eg 33.3"
                  value={"" + currReplacement}
                />
                <InputGroup.Append>
                  <InputGroup.Text id="pct2">%</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              <InputGroup as={Col} sm="2">
                <Button variant="outline-secondary"
                  disabled={!isDefined(currInStat, currStatName)}
                  onClick={() => addToOverrides()}
                >+</Button>
              </InputGroup>
            </Form.Row>
          </Form>
        </Card.Body>
      </Card>

      <Card className="w-100">
        <Card.Header className="small">Existing Overrides</Card.Header>
        <Card.Body>
          <Container>
            <Col xs={11}>
              <GenericTable tableCopyId="overridesTable" tableFields={manualOverridesTable} tableData={tableData}/>
            </Col>
          </Container>
        </Card.Body>
      </Card>

    </Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={() => props.onHide()}>Exit</Button>
    </Modal.Footer>
  </Modal></div>;
};
export default ManualOverrideModal;
