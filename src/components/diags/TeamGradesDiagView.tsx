// React imports:
import React, { useState } from 'react';

import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Utils
import { CommonTableDefs } from "../../utils/tables/CommonTableDefs";
import { CbbColors } from "../../utils/CbbColors";

// Component imports
import GenericTable, { GenericTableOps, GenericTableColProps } from "../GenericTable";
import { DivisionStatistics, TeamStatSet } from '../../utils/StatModels';

type Props = {
   comboTier?: DivisionStatistics,
   highTier?: DivisionStatistics,
   mediumTier?: DivisionStatistics,
   lowTier?: DivisionStatistics

   team: TeamStatSet
};

const TeamGradesDiagView: React.FunctionComponent<Props> = ({
 }) => {
   return <div></div>;
};

export default TeamGradesDiagView;
