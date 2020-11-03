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
import { OverrideUtils } from "../../utils/stats/OverrideUtils";

// External Data Model

type Props = {
  tableType: ParamPrefixesType,
  inStats: any[],
  filteredPlayers?: Set<string>,
  statsAsTable: Record<string, any[]>,
  show: boolean,
  onHide: () => void,
  onSave: (overrides: ManualOverride[]) => void,
  overrides: ManualOverride[],
  showHelp: boolean,
  startOverride?: ManualOverride //(just for testing)
};
const ManualOverrideModal: React.FunctionComponent<Props> = (
  {tableType, filteredPlayers, inStats, statsAsTable, onSave, overrides, showHelp, startOverride, ...props}
) => {

  //(TODO: lots of work to make this more generic and not just per player)

  const inStatsLabel = (() => {
    switch (tableType) {
      case ParamPrefixes.player: return "Player";
      default: return "Unknown";
    }
  })();

  const getFirstPlayer = (statList: any[]) => {
    const first = statList?.[0];
    return first ? OverrideUtils.getPlayerRowId(first.key, first.onOffKey) : undefined;
  }
  useEffect(() => {
    if ("" == currInStat) {
      setCurrInStat(getFirstPlayer(inStats) || "");
    }
  }, [ inStats ]);

  // Starting values:
  const [ currInStat, setCurrInStat ] = useState(
    startOverride?.rowId || getFirstPlayer(inStats) || ""
  );
  const [ currStatName, setCurrStatName ] = useState(startOverride?.statName || "");
  const [ oldStatVal, setOldStatVal ] = useState(0 as number);
  const [ currReplacementAsStr, setCurrReplacementAsStr ] = useState(
    _.isNil(startOverride) ? "" : "" + startOverride.newVal
  );

  // Player/lineup/row

  /** Formats a stat set into a label */
  const statToOption = (statSet: any) => {
    if (statSet) {
      const labelAndVal = OverrideUtils.getPlayerRowId(statSet.key, statSet.onOffKey);
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

  const metricsMap = OverrideUtils.getOverridableStats(tableType);

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
      const currVal = 100*(playerStat?.value || 0);
      setOldStatVal(startingVal);
      setCurrReplacementAsStr(currVal.toFixed(1));
    }
  }

  const insertOrUpdate = (newObj: ManualOverride) => {
    const currObj = _.find(overrides, (o) => o.rowId == newObj.rowId && o.statName == newObj.statName);
    if (currObj) {
      currObj.newVal = newObj.newVal;
      currObj.use = newObj.use;
    }
    onSave(overrides.concat(currObj ? [] : [newObj]));
  }

  /** Update the overrides list with the new value */
  const addToOverrides = () => {
    const newObj = {
      rowId: currInStat,
      statName: currStatName,
      newVal: parseFloat(currReplacementAsStr)*0.01, //(at some point this might need to depend on stat name)
      use: true
    };
    insertOrUpdate(newObj);
  };

  /** Remove an override */
  const removeOverride = (toRemove: ManualOverride) => {
    const newOverrideSet =
      overrides.filter((over) => (toRemove.rowId != over.rowId) || (toRemove.statName != over.statName));
    onSave(newOverrideSet);
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
          {over.use ? over.rowId : <del>{over.rowId}</del>}<br/>
          <a href="#" onClick={() => {
            insertOrUpdate({ ...over, use: !over.use });
            return false;
          }}>{over.use ? "(disable)" : "(enable)"}</a>
          &nbsp;<a href="#" onClick={() => {
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
        to: { value: over.newVal },
        from: { value: getOldVal(playerRow[over.statName] || 0) },
      }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)];
    } else {
      return [];
    }
  }).value();

  // Grouping for the player selector list:

  /** The two sub-headers for the dropdown */
  const groupedOptions = filteredPlayers ? [
    {
      label: "Filtered",
      options: _.flatMap(inStats, stat => filteredPlayers.has(stat.key) ? statToOption(stat) : [])
    },
    {
      label: "All Players",
      options: _.flatMap(inStats, stat => !filteredPlayers.has(stat.key) ? statToOption(stat) : [])
    }
  ] : _.flatMap(inStats, stat => statToOption(stat));
  /** The sub-header builder */
  const formatGroupLabel = (data: any) => (
    <div>
      <span>{data.label}</span>
    </div>
  );

  // View

  const statsTableFields = CommonTableDefs.onOffIndividualTable(true, false, false, false); //(expanded view, abs poss count, rating not prod)

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
                    options={groupedOptions}
                    onChange={(option) => {
                      const val = (option as any)?.value;
                      if (val) {
                        setCurrInStat(val);
                        updateValues(val, currStatName);
                      }
                    }}
                    formatGroupLabel={filteredPlayers ? formatGroupLabel : undefined}
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
                  disabled={!isDefined(currInStat, currStatName)}
                  onChange={(ev: any) => {
                    if (/^[0-9.]*$/.exec(ev.target.value || "")) {
                      setCurrReplacementAsStr(ev.target.value);
                    }
                  }}
                  placeholder = "eg 33.3"
                  value={currReplacementAsStr}
                />
                <InputGroup.Append>
                  <InputGroup.Text id="pct2">%</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              <InputGroup as={Col} sm="2">
                <Button variant="outline-secondary"
                  disabled={
                    _.isNaN(parseFloat(currReplacementAsStr)) || !isDefined(currInStat, currStatName)
                  }
                  onClick={() => addToOverrides()}
                >+</Button>
              </InputGroup>
            </Form.Row>
          </Form>
        </Card.Body>
      </Card>

      <Card className="w-100">
        <Card.Header className="small">Selected Player Overriden Stats</Card.Header>
        <Card.Body>
          <Container>
            <Row>
              <Col xs={12}>
                <GenericTable tableCopyId="overrideEffectsTable" tableFields={statsTableFields} tableData={statsAsTable[currInStat] || []}/>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>

      <Card className="w-100">
        <Card.Header className="small">Existing Overrides
        &nbsp;<a href="#" onClick={() => {
          overrides.forEach((over) => {
            if (!over.use) insertOrUpdate({ ...over, use: true });
          })
          return false;
        }}>(enable all)</a>
        &nbsp;<a href="#" onClick={() => {
          overrides.forEach((over) => {
            if (over.use) insertOrUpdate({ ...over, use: false });
          })
          return false;
        }}>(disable all)</a>
        </Card.Header>
        <Card.Body>
          <Container>
            <Row>
              <small><i>(Note that player edits are not currently reflected in the team stats)</i></small><br/>
            </Row>
            <Row>
              <Col xs={11}>
                <GenericTable tableCopyId="overridesTable" tableFields={manualOverridesTable} tableData={tableData}/>
              </Col>
            </Row>
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
