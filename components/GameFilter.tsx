// React imports:
import React, { useState } from 'react';

// Next imports:
import { NextPage } from 'next';

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import InputGroup from 'react-bootstrap/InputGroup';

// Additional components:
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Typeahead } from 'react-bootstrap-typeahead';

const GameFilter: React.FunctionComponent<{}> = ({}) => {
  const [ showGameFilter, toggleShowGameFilter ] = useState(true)
  const [ autoOffQuery, toggleAutoOffQuery ] = useState(true)
  const [ onQuery, setOnQuery ] = useState("")
  const [ offQuery, setOffQuery ] = useState("")

  const [ minRankFilter, setMinRankFilter ] = useState("0")
  const [ maxRankFilter, setMaxRankFilter ] = useState("400")

  const setAutoOffQuery = (onQuery: string) => {
    setOffQuery(onQuery == "" ? "" : `NOT (${onQuery})`);
  }

  return <Card className="w-100">
    <Card.Body>
      <Card.Title
        onClick={() => { toggleShowGameFilter(!showGameFilter); return false } }
      ><a href="#">({showGameFilter ? "+" : "-"}) Team and Game Filter</a></Card.Title>
      <Collapse in={showGameFilter}>
        <Form>
          <Form.Group>
            <Row>
              <Col xs={2}>
                <Typeahead
                  multiple={false}
                  options={[
                    "Men"
                  ]}
                  defaultInputValue="Men"
                />
              </Col>
              <Col xs={2}>
                <Typeahead
                  multiple={false}
                  options={[
                    "2018/9"
                  ]}
                  defaultInputValue="2018/9"
                />
              </Col>
              <Col xs={6}>
                <Typeahead
                  multiple={false}
                  options={[
                    "Maryland"
                  ]}
                  defaultInputValue="Maryland"
                />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">On Query</Form.Label>
            <Col sm="8">
              <Form.Control
                placeholder="eg 'Player1 AND Player2'"
                value={onQuery}
                onChange={(ev: any) => {
                  setOnQuery(ev.target.value);
                  if (autoOffQuery) {
                    setAutoOffQuery(ev.target.value);
                  }
                }}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">Off Query</Form.Label>
            <Col sm="8">
              <Form.Control
                placeholder="eg 'NOT (Player1 AND Player2)'"
                onChange={(ev: any) => {
                  setOffQuery(ev.target.value);
                }}
                value={offQuery}
                readOnly={autoOffQuery}
              />
            </Col>
            <Col sm="2">
              <Form.Check type="switch"
                id="autoOffQuery"
                checked={autoOffQuery}
                onChange={() => {
                  if (!autoOffQuery) {
                    setAutoOffQuery(onQuery);
                  }
                  toggleAutoOffQuery(!autoOffQuery);
                }}
                label="Auto"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="oppositionFilter">
            <Form.Label column sm="2">Opponent Strength</Form.Label>
            <Form.Label column sm="1">Best</Form.Label>
            <Col sm="2">
              <Form.Control
                onChange={(ev: any) => {
                  if (ev.target.value.match("^[0-9]*$") != null) {
                    setMinRankFilter(ev.target.value);
                  }
                }}
                placeholder = "eg 0"
                value={minRankFilter}
              />
            </Col>
            <Form.Label column sm="1">Worst</Form.Label>
            <Col sm="2">
              <Form.Control
                onChange={(ev: any) => {
                  if (ev.target.value.match("^[0-9]*$") != null) {
                    setMaxRankFilter(ev.target.value);
                  }
                }}
                placeholder = "eg 400"
                value={maxRankFilter}
              />
            </Col>
            <Form.Label column sm="2">(out of 352 teams)</Form.Label>
          </Form.Group>
          <Button variant="primary">Submit</Button>
        </Form>
      </Collapse>
    </Card.Body>
  </Card>;
}

export default GameFilter;
