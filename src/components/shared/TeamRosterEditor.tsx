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

type Props = {
   triple: GoodBadOkTriple,
   overrides?: PlayerEditModel,
   onDelete: () => void,
   onUpdate: (edit: PlayerEditModel | undefined) => void
};

const TeamRosterEditor: React.FunctionComponent<Props> = ({triple, overrides, onDelete, onUpdate}) => {

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
                        //TODO
                        }
                     }}
                     placeholder = "eg 33.3"
                     value={""}
                  />
                  </InputGroup>
               </Col>
               <Col xs={2} className="pt-1">
                  <Button size="sm" variant="outline-secondary"
                  onClick={() => null}
                  >+</Button>
               </Col>
               <Col xs={5}/>
               <Col xs={1} className="pt-1">
                  <Button size="sm" variant="outline-danger" onClick={((ev:any) => onDelete())}
                     ><FontAwesomeIcon icon={faTrash} />
                  </Button>
               </Col>
            </Row>
            </Container>
         </Tab>
         <Tab eventKey="Optimistic" title="Optimistic">
            <span>Coming Soon!</span>
         </Tab>
         <Tab eventKey="Balanced" title="Balanced">
            <span>Coming Soon!</span>
         </Tab>
         <Tab eventKey="Pessimistic" title="Pessimistic">
            <span>Coming Soon!</span>
         </Tab>
      </Tabs>
      </Col>
      <Col xs={1}/>
   </Row></Container>;
}
export default TeamRosterEditor;



