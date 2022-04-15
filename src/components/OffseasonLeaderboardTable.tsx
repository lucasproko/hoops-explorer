// React imports:
import React, { useState, useEffect } from 'react';

// Lodash:
import _ from "lodash";

// Bootstrap imports:
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';

// Additional components:
// @ts-ignore
import LoadingOverlay from 'react-loading-overlay';
import Select, { components } from "react-select";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faCheck, faPen, faFilter, faTrash } from '@fortawesome/free-solid-svg-icons'
import ClipboardJS from 'clipboard';

// Component imports
import GenericTable, { GenericTableOps } from "./GenericTable";
import GenericTogglingMenu from './shared/GenericTogglingMenu';
import GenericTogglingMenuItem from './shared/GenericTogglingMenuItem';
import ToggleButtonGroup from "./shared/ToggleButtonGroup";
import PlayerLeaderboardTable, { PlayerLeaderboardStatsModel } from "./PlayerLeaderboardTable";

// Table building
import { DivisionStatsCache, GradeTableUtils } from "../utils/tables/GradeTableUtils";

// Util imports
import { PlayerLeaderboardParams, ParamDefaults, TeamEditorParams } from '../utils/FilterModels';
import { GoodBadOkTriple, PlayerEditModel, TeamEditorUtils } from '../utils/stats/TeamEditorUtils';

import { StatModels, IndivStatSet, PureStatSet, DivisionStatistics } from '../utils/StatModels';
import { AvailableTeams } from '../utils/internal-data/AvailableTeams';
import GenericCollapsibleCard from './shared/GenericCollapsibleCard';
import { GradeUtils } from '../utils/stats/GradeUtils';
import { LeaderboardUtils, TransferModel } from '../utils/LeaderboardUtils';
import TeamRosterEditor from './shared/TeamRosterEditor';
import { TeamEditorTableUtils } from '../utils/tables/TeamEditorTableUtils';
import { UrlRouting } from '../utils/UrlRouting';
import { efficiencyAverages } from '../utils/public-data/efficiencyAverages';
import { TeamEditorStatsModel } from './TeamEditorTable';
import { ConferenceToNickname, NicknameToConference, Power6ConferencesNicks } from '../utils/public-data/ConferenceInfo';

const nonHighMajorConfsName = "Outside The P6";
const queryFiltersName = "From URL";
const powerSixConfsStr = Power6ConferencesNicks.join(",");

type Props = {
   startingState: TeamEditorParams,
   dataEvent: TeamEditorStatsModel,
   onChangeState: (newParams: TeamEditorParams) => void
}

const OffSeasonLeaderboardTable: React.FunctionComponent<Props> = ({startingState, dataEvent, onChangeState}) => {
   const server = (typeof window === `undefined`) ? //(ensures SSR code still compiles)
     "server" : window.location.hostname
 
   /** Only show help for diagnstic on/off on main page */
   const showHelp = !_.startsWith(server, "cbb-on-off-analyzer");
 
   // 1] Data model

   // (don't support tier changes)
   const tier: string = "All";

   // Data source
   const [confs, setConfs] = useState(startingState.conf || "");
   const [year, setYear] = useState(startingState.year || ParamDefaults.defaultLeaderboardYear);
   const [gender, setGender] = useState(startingState.gender || ParamDefaults.defaultGender);

   /** Set this to be true on expensive operations */
   const [loadingOverride, setLoadingOverride] = useState(false);

   /** At the expense of some time makes it easier to see when changes are happening */
   const friendlyChange = (change: () => void, guard: boolean, timeout: number = 250) => {
      if (guard) {
      setLoadingOverride(true);
      setTimeout(() => {
         change()
      }, timeout)
      }
   };

   // Conference filter

   function getCurrentConfsOrPlaceholder() {
      return (confs == "") ?
      { label: year < "2020/21" ? `All High Tier Teams` : `All Teams` } :
      confs.split(",").map((conf: string) => stringToOption(NicknameToConference[conf] || conf));
   }

   /** Slightly hacky code to render the conference nick names */
   const ConferenceValueContainer = (props: any) => {
      const oldText = props.children[0];
      const fullConfname = oldText.props.children;
      const newText = {
      ...oldText,
      props: {
         ...oldText.props,
         children: [ConferenceToNickname[fullConfname] || fullConfname]
      }
      }
      const newProps = {
      ...props,
      children: [newText, props.children[1]]
      }
      return <components.MultiValueContainer {...newProps} />
   };

   const confsWithTeams = dataEvent?.confMap ?
      _.toPairs(dataEvent?.confMap || {}).map(kv => {
      const teams = kv[1] || [];
      return _.isEmpty(teams) ? kv[0] : `${kv[0]} [${teams.join(", ")}]`;
      }) : (dataEvent?.confs || []);

   // 2] Processing

   const playerPartition = _.transform(dataEvent.players || [], (acc, p) => {
      const teams = [ (p.team || "") ].concat(
         _.flatMap(dataEvent.transfers || [], txfers => {
            return ((txfers || {})[p.code || ""] || [])
               .flatMap(txfer => txfer.t ? [ txfer.t, txfer.f ] : [ txfer.f ]);
         })      
      );
      teams.forEach(team => {
         if (!acc[team]) {
            acc[team] = [];
         }
         acc[team]!.push(p);
      })
   }, {} as Record<string, IndivStatSet[]>);

   // Get a list of teams
   const teamList = _.flatMap(AvailableTeams.byName, (teams, teamName) => {
      const maybeTeam = teams.find(t => (t.year == year) && (t.gender == gender));
      return maybeTeam ? [ maybeTeam.team ] : []
   });

   // For each team, do the big off-season calcs:

   const teamRanks = _.chain(teamList).map(t => {

      const pxResults = TeamEditorUtils.teamBuildingPipeline(
         gender, t, year,
         playerPartition[t] || [], dataEvent.transfers || [],
         true, false,
         {}, {}, {}, {},
         false, false,
         efficiencyAverages.fallback
       );
   
       const buildTotals = (triples: GoodBadOkTriple[], range: "good" | "bad" | "ok" | "orig", adj: number = 0) => {
         const off = _.sumBy(triples, triple => {
           return (triple[range]?.off_team_poss_pct.value || 0)*TeamEditorUtils.getOff(triple[range] || {});
         }) + adj;
         const def = _.sumBy(triples, triple => {
           return (triple[range]?.off_team_poss_pct.value || 0)*TeamEditorUtils.getDef(triple[range] || {});
         }) - adj;
         const net = _.sumBy(triples, triple => {
           return (triple[range]?.off_team_poss_pct.value || 0)*TeamEditorUtils.getNet(triple[range] || {});
         }) + 2*adj;
         return { off, def, net };
       };
       const okTotals = buildTotals(pxResults.basePlayersPlusHypos, "ok");

       return { ...okTotals, team: t };
   }).sortBy(t => -t.net).value();

   // 3] View

   /** Copy to clipboard button */
   const getCopyLinkButton = () => {
      const tooltip = (
      <Tooltip id="copyLinkTooltip">Copies URL to clipboard</Tooltip>
      );
      return <OverlayTrigger placement="auto" overlay={tooltip}>
      <Button className="float-left" id={`copyLink_teamLeaderboard`} variant="outline-secondary" size="sm">
         <FontAwesomeIcon icon={faLink} />
      </Button>
      </OverlayTrigger>;
   };

   function stringToOption(s: string) {
      return { label: s, value: s };
   }
  
   return <Container>
      <Form.Group as={Row}>
         <Col xs={6} sm={6} md={3} lg={2} style={{zIndex: 12}}>
            <Select
               value={stringToOption(gender)}
               options={["Men", "Women"].map(
               (gender) => stringToOption(gender)
               )}
               isSearchable={false}
               onChange={(option) => { if ((option as any)?.value) {
                  setGender((option as any).value);
               }}}
            />
         </Col>
         <Col xs={6} sm={6} md={3} lg={2} style={{zIndex: 11}}>
            <Select
               value={stringToOption(year)}
               options={
               (
                  ["2021/22"]
               ).concat(tier == "High" ? ["Extra"] : []).map(
                  (r) => stringToOption(r)
               )}
               isSearchable={false}
               onChange={(option) => { if ((option as any)?.value) {
                  setYear((option as any).value);
               }}}
            />
         </Col>
         <Col className="w-100" bsPrefix="d-lg-none d-md-none" />
         <Col xs={12} sm={12} md={6} lg={6} style={{zIndex: 10}}>
            <Select
               isClearable={true}
               styles={{ menu: base => ({ ...base, zIndex: 1000 }) }}
               isMulti
               components={{ MultiValueContainer: ConferenceValueContainer }}
               value={getCurrentConfsOrPlaceholder()}
               options={(tier == "High" ? ["Power 6 Conferences"] : []).concat(_.sortBy(confsWithTeams))
               .concat([ nonHighMajorConfsName, queryFiltersName ]).map(
               (r) => stringToOption(r)
               )}
               onChange={(optionsIn) => {
               const options = optionsIn as Array<any>;
               const selection = (options || [])
                  .map(option => ((option as any)?.value || "").replace(/ *\[.*\]/, ""));
               const confStr = selection.filter((t: string) => t != "").map((c: string) => ConferenceToNickname[c] || c).join(",")
               friendlyChange(() => setConfs(confStr), confs != confStr);
               }}
            />
         </Col>
         <Col lg={1} className="mt-1">
            {getCopyLinkButton()}
         </Col>
      </Form.Group>
      <Row>
         <Col>
            {_.take(teamRanks, 75).map((t, ii) => <span>{`${ii}: ` + JSON.stringify(t)}<br/></span>)}
         </Col>
      </Row>
   </Container>;
 }
 export default OffSeasonLeaderboardTable;
