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
  onHide: () => void,
  onSave: (onBallDefense: any[]) => void,
  onBallDefense: any[],
  showHelp: boolean,
  startOverride?: any //(just for testing)
};
const OnBallDefenseModal: React.FunctionComponent<Props> = (
  {onHide, onSave, onBallDefense, showHelp, startOverride, ...props}
) => {

  const onApply = () => {
    props.onHide();
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
                  <FormControl as="textarea" />
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
                <li>Awaiting input</li>
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
      <Button disabled={true} variant="warning" onClick={() => null}>Clear</Button>
      <Button disabled={true} variant="warning" onClick={() => null}>Reset</Button>
      <Button disabled={true} variant="info" onClick={() => onApply()}>Apply changes</Button>
      <Button variant="primary" onClick={() => onHide()}>Done</Button>
    </Modal.Footer>
  </Modal></div>;
};
export default OnBallDefenseModal;
