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
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { GoodBadOkTriple, PlayerEditModel } from '../../utils/stats/TeamEditorUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

type Props = {
   overrides?: PlayerEditModel,
   onDelete: () => void,
   onUpdate: (edit: PlayerEditModel | undefined) => void,
   isBench: boolean
};

const TeamRosterEditor: React.FunctionComponent<Props> = ({overrides, onDelete, onUpdate, isBench}) => {

   // State

   // Starting values:
   const [ currMins, setCurrMins ] = useState(overrides?.mins?.toFixed(1) || "");
   const [ currOffAdj, setCurrOffAdj ] = useState(overrides?.global_off_adj || 0);
   const [ currDefAdj, setCurrDefAdj ] = useState(overrides?.global_def_adj || 0);

   // Presentation

   const deleteTooltip = <Tooltip id="deleteTooltip">
      WARNING! Deletes the player from the table. You can add them back from the "Add New Player" section.&nbsp;
      Use the filter option to remove the player temporarily.
   </Tooltip>;

   const minsApplyTooltip = <Tooltip id="minsApplyTooltip">
      Override the minutes played per game for this player and recalculate the statistics.&nbsp;
      Clear the field and apply to return to the automatically calculated version.
   </Tooltip>;

   const globalAdjTooltip = <Tooltip id="globalAdjTooltip">
      If you disagree with the automatic projections, drag the slider left (more pessimistic) / right (more optimistic).&nbsp;
      Pressing this button applies the change.&nbsp;
      Note that the adjustments won't be exactly as specified due to the details of the algorithm.
   </Tooltip>;

   const comingSoon = <Container>
         <Row className="mt-3 mb-3">
            <Col className="text-center"><b>Coming Soon!</b> For now, only "General" is used.</Col>
         </Row>
      </Container>;

   return <Container><Row>
      <Col xs={1}/>
      <Col xs={10}>
      <Tabs>
         <Tab eventKey="General" title="General">
            <Container>
            <Row className="mt-2">
               <Col xs={1}/>               
               <Col xs={3}>
                  <InputGroup>
                  <InputGroup.Prepend>
                     <InputGroup.Text id="minPct">Fix MPG</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                     onChange={(ev: any) => {
                        if (/^[0-9.]*$/.exec(ev.target.value || "")) {
                           setCurrMins(ev.target.value || "")
                        }
                     }}
                     placeholder = "eg 33.3"
                     value={currMins}
                  />
                  </InputGroup>
               </Col>
               <Col xs={2} className="pt-1">
                  <OverlayTrigger overlay={minsApplyTooltip} placement="auto">
                     <Button size="sm" variant="outline-secondary"
                        onClick={() => {
                           if (!((parseInt(currMins || "-1") == overrides?.mins) || (!currMins && _.isNil(overrides?.mins)))) {
                              const currOverrides = overrides ? _.clone(overrides) : {};
                              if (currMins == "") {
                                 delete currOverrides.mins
                              } else {
                                 currOverrides.mins = parseInt(currMins);
                              }
                              onUpdate(_.isEmpty(currOverrides) ? undefined : currOverrides);
                           }
                        }}
                     >+</Button>
                  </OverlayTrigger>
               </Col>
               <Col xs={5}/>
               <Col xs={1} className="pt-1">
                  {isBench ? null :
                  <OverlayTrigger overlay={deleteTooltip} placement="auto">
                     <Button size="sm" variant="outline-danger" onClick={((ev:any) => onDelete())}
                        ><FontAwesomeIcon icon={faTrash} />
                     </Button>
                  </OverlayTrigger>}
               </Col>
            </Row>
            <Row className="mt-3">
               <Col xs={1}/>
               <Col xs={8}>
                  <Form.Label><b>Offensive projections</b>: <span>adjustment=[{overrides?.global_off_adj || 0}] new=[{currOffAdj}]</span></Form.Label>
                  <Form inline>
                     <Form.Label className="pull-left">Bearish&nbsp;&nbsp;&nbsp;</Form.Label>
                     <Form className="flex-fill">
                     <Form.Control type="range" custom 
                        value={currOffAdj}
                        onChange={(ev: any) => {
                           const newVal = parseFloat(ev.target.value);
                           setCurrOffAdj(newVal);
                        }}
                        min={-3} max={3} step={0.25}                        
                     />
                     </Form>
                     <Form.Label className="pull-right">&nbsp;&nbsp;&nbsp;Bullish</Form.Label>
                  </Form>
               </Col>
               <Col xs={2} className="pt-4">
                  <OverlayTrigger overlay={minsApplyTooltip} placement="auto">
                     <Button size="sm" variant="outline-secondary"
                        onClick={() => {
                           const currOverrides = overrides ? _.clone(overrides) : {};
                           if (currOffAdj == 0) {
                              delete currOverrides.global_off_adj;
                           } else {
                              currOverrides.global_off_adj = currOffAdj;
                           }
                           onUpdate(_.isEmpty(currOverrides) ? undefined : currOverrides);
                        }}
                     >+</Button>
                  </OverlayTrigger>
               </Col>
               <Col xs={1}/>
            </Row>
            <Row className="mt-3">
               <Col xs={1}/>
               <Col xs={8}>
                  <Form.Label><b>Defensive projections</b>: <span>adjustment=[{overrides?.global_def_adj || 0}] new=[{currDefAdj}]</span></Form.Label>
                  <Form inline>
                     <Form.Label className="pull-left">Bearish&nbsp;&nbsp;&nbsp;</Form.Label>
                     <Form className="flex-fill">
                     <Form.Control type="range" custom 
                        value={currDefAdj}
                        onChange={(ev: any) => {
                           const newVal = parseFloat(ev.target.value);
                           setCurrDefAdj(newVal);
                        }}
                        min={-3} max={3} step={0.25}                        
                     />
                     </Form>
                     <Form.Label className="pull-right">&nbsp;&nbsp;&nbsp;Bullish</Form.Label>
                  </Form>
               </Col>
               <Col xs={2} className="pt-4">
                  <OverlayTrigger overlay={minsApplyTooltip} placement="auto">
                     <Button size="sm" variant="outline-secondary"
                        onClick={() => {
                           const currOverrides = overrides ? _.clone(overrides) : {};
                           if (currDefAdj == 0) {
                              delete currOverrides.global_def_adj;
                           } else {
                              currOverrides.global_def_adj = -currDefAdj;
                           }
                           onUpdate(_.isEmpty(currOverrides) ? undefined : currOverrides);
                        }}
                     >+</Button>
                  </OverlayTrigger>
               </Col>
               <Col xs={1}/>
            </Row>
            </Container>
         </Tab>
         <Tab eventKey="Optimistic" title="Optimistic">
            {comingSoon}
         </Tab>
         <Tab eventKey="Balanced" title="Balanced">
            {comingSoon}
         </Tab>
         <Tab eventKey="Pessimistic" title="Pessimistic">
            {comingSoon}
         </Tab>
      </Tabs>
      </Col>
      <Col xs={1}/>
   </Row></Container>;
}
export default TeamRosterEditor;



