// Google analytics:
import { initGA, logPageView } from '../utils/GoogleAnalytics';

// React imports:
import React, { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';

// Next imports:
import { NextPage } from 'next';

// Lodash:
import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Alert from 'react-bootstrap/Alert';

// App components:
import Footer from '../components/Footer';
import HeaderBar from '../components/HeaderBar';

// @ts-ignore
import Iframe from 'react-iframe'

// Utils:

const ChartsPage: NextPage<{}> = () => {

  useEffect(() => { // Set up GA
    if ((process.env.NODE_ENV === 'production') && (typeof window !== undefined)) {
      if (!gaInited) {
        initGA();
        setGaInited(true);
      }
      logPageView();
    }
  }); //(on any change to the DOM)

  // Team Stats interface

  const [ gaInited, setGaInited ] = useState(false);

  const server = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
    "server" : window.location.hostname

  // View

  // Changes made to Vega charts:
  // url="/high_major_positions.html"
  // url="/all_conf_positions.html"
  //    - {"continuousWidth": 680, "continuousHeight": 510}
  //    -   <div id="vis" style="margin-left: 50px"></div>

  const defaultChart = "high_major_positions";

  // Stateful management of the page for deep linking

  const [tabKey, setTabKey] = useState(defaultChart);
  useEffect(() => {
    const hashOnLoad = (typeof window === `undefined`)
      ? defaultChart : (window.location.hash || `#${defaultChart}`).substring(1);
    setTabKey(hashOnLoad)
  }, []);

  // Links that we'll only show in blog mode
  const maybeShowBlogArticle = (chart: string) => {
    const chartToUrl: Record<string, string> = {
      "high_major_positions": "https://hoop-explorer.blogspot.com/2020/05/classifying-college-basketball.html",
      "all_conf_positions": "https://hoop-explorer.blogspot.com/2020/05/classifying-college-basketball.html"
    };
    return <span>
      A description of the fields and methodology used is <a target="_blank" href={chartToUrl[chart]}>here</a>
    </span>;
  }

  return <Container>
    <Row>
      <Col xs={12} className="text-center">
        <h3>CBB Analysis Tool - Interesting Charts <span className="badge badge-pill badge-info">BETA!</span></h3>
      </Col>
    </Row>
    <Row>
      <HeaderBar
        common={{}}
        thisPage={"charts"}
        />
    </Row>
    <Row className="border-top">
     <Nav>
       <NavDropdown title="More Charts" id="chartSelection">
          <NavDropdown.Item href="#high_major_positions" onSelect={() => setTabKey("high_major_positions")} eventKey="high_major_positions">
            Position Analysis, High Majors, 2010+
          </NavDropdown.Item>
          <NavDropdown.Item href="#all_conf_positions"  onSelect={() => setTabKey("all_conf_positions")} eventKey="all_conf_positions">
            Position Analysis, D1, 2014+
          </NavDropdown.Item>
       </NavDropdown>
     </Nav>
    </Row>
    <Row>
       <Tab.Container activeKey={tabKey}>
          <Row>
            <Tab.Content>
              <Tab.Pane eventKey="high_major_positions">
                <div>
                  <Alert variant="info" className="small">
                    <em>
                      A 2-d visualization of the different positions in high major conferences, 2010-2020.
                      {maybeShowBlogArticle(tabKey)}.
                      The data came from <a href="http://adamcwisports.blogspot.com/p/data.html">barttorvik.com</a>, much appreciated!
                      The graph below is interactive - you can scroll in or out, move around, or highlight specific teams. Note - it can be a bit slow!
                    </em>
                  </Alert>
                  <iframe frameBorder="0" src="/high_major_positions.html" width="1024px" height="630px"/>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="all_conf_positions">
                <div>
                <Alert variant="info" className="small">
                  <em>
                    A 2-d visualization of the different positions in D1 college basketball, 2014-2020.
                    {maybeShowBlogArticle(tabKey)}.
                    The data came from <a href="http://adamcwisports.blogspot.com/p/data.html">barttorvik.com</a>, much appreciated!
                    The graph below is interactive - you can scroll in or out, move around, or highlight specific teams. Note - it can be very slow!
                  </em>
                </Alert>
                  <iframe frameBorder="0" src="/all_conf_positions.html" width="1024px" height="630px"/>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Row>
      </Tab.Container>
    </Row>
  </Container>;
}
export default ChartsPage;
