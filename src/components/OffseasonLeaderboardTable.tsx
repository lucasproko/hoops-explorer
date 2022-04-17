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
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';

// Additional components:
// @ts-ignore
import LoadingOverlay from 'react-loading-overlay';
import Select, { components } from "react-select";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faPen, faEye } from '@fortawesome/free-solid-svg-icons'
import ClipboardJS from 'clipboard';

// Component imports
import GenericTable, { GenericTableOps } from "./GenericTable";

// Table building
// Util imports
import { TeamEditorParams, OffseasonLeaderboardParams } from '../utils/FilterModels';
import { GoodBadOkTriple, TeamEditorUtils } from '../utils/stats/TeamEditorUtils';

import { StatModels, IndivStatSet, PureStatSet, DivisionStatistics } from '../utils/StatModels';
import { AvailableTeams } from '../utils/internal-data/AvailableTeams';
import { GradeUtils } from '../utils/stats/GradeUtils';
import { UrlRouting } from '../utils/UrlRouting';
import { efficiencyAverages } from '../utils/public-data/efficiencyAverages';
import TeamEditorTable, { TeamEditorStatsModel } from './TeamEditorTable';
import { ConferenceToNickname, NicknameToConference, Power6ConferencesNicks } from '../utils/public-data/ConferenceInfo';
import { CommonTableDefs } from '../utils/tables/CommonTableDefs';
import { CbbColors } from '../utils/CbbColors';
import { efficiencyInfo } from '../utils/internal-data/efficiencyInfo';

const nonHighMajorConfsName = "Outside The P6";
const queryFiltersName = "From URL";
const powerSixConfsStr = Power6ConferencesNicks.join(",");

type Props = {
   startingState: OffseasonLeaderboardParams,
   dataEvent: TeamEditorStatsModel,
   onChangeState: (newParams: OffseasonLeaderboardParams) => void
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
   const [ clipboard, setClipboard] = useState(null as null | ClipboardJS);
   const [confs, setConfs] = useState(startingState.confs || "");
   const [year, setYear] = useState("2021/22"); //TODO ignore input just take 2021/22 (display 2022/23 but it's off-season)
   const [yearRedirect, setYearRedirect] = useState("2022/23"); //TODO lets us jump between off-seasons and normal leaderboards
   const [gender, setGender] = useState("Men"); // TODO ignore input just take Men
   const [team,  setTeam] = useState(startingState.teamView || "");

   /** Converts a list of params to their team's key/value params  */
   const buildOverrides = (inOverrides: Record<string, string>) => {
      return _.transform(inOverrides, (acc, param, key) => {
         const splitKey = key.split("__");
         const inTeam = splitKey[0];
         const inParamKey = splitKey?.[1];
         if (inParamKey) {
            if (!acc[inTeam]) {
               acc[inTeam] = {};
            }
            // Supported overrides: superSeniorsBack, deletedPlayers, disabledPlayers, addedPlayers, overrides
            if (inParamKey == "deletedPlayers") {
               acc[inTeam]!.deletedPlayers = param;
            } else if (inParamKey == "disabledPlayers") {
               acc[inTeam]!.disabledPlayers = param;
            } else if (inParamKey == "addedPlayers") {
               acc[inTeam]!.addedPlayers = param;
            } else if (inParamKey == "overrides") {
               acc[inTeam]!.overrides = param;
            } else if (inParamKey == "superSeniorsBack") {
               acc[inTeam]!.superSeniorsBack = (param == "true");
            }
         }
      }, {} as Record<string, TeamEditorParams>);
   }
   const [ teamOverrides, setTeamOverrides ] = useState(
      buildOverrides(startingState) as Record<string, TeamEditorParams>
   );

   /** When the params change */
   useEffect(() => {
      onChangeState(_.merge({
         year: yearRedirect, teamView: team, confs
      }, _.chain(teamOverrides).flatMap((teamEdit, teamToOver) => {
         return _.map(teamEdit, 
            (teamEditVal, paramKey) => teamEditVal ? [ `${teamToOver}__${paramKey}`, teamEditVal.toString() ] : []
         );
      }).fromPairs().value()));
   }, [ team, confs, teamOverrides, yearRedirect ]);

   /** Set this to be true on expensive operations */
   const [loadingOverride, setLoadingOverride] = useState(false);

   useEffect(() => { // Add and remove clipboard listener
      initClipboard();
  
      if (typeof document !== `undefined`) {
        //(if we added a clipboard listener, then remove it on page close)
        //(if we added a submitListener, then remove it on page close)
        return () => {
          if (clipboard) {
            clipboard.destroy();
            setClipboard(null);
          }
        };
      }
   });
   /** This grovelling is needed to ensure that clipboard is only loaded client side */
   function initClipboard() {
      if (null == clipboard) {
      var newClipboard = new ClipboardJS(`#copyLink_playerLeaderboard`, {
         text: function(trigger) {
            return window.location.href;
         }
      });
      newClipboard.on('success', (event: ClipboardJS.Event) => {
         //(unlike other tables, don't add to history)
         // Clear the selection in some visually pleasing way
         setTimeout(function() {
            event.clearSelection();
         }, 150);
      });
      setClipboard(newClipboard);
      }
   }
 
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

   const editTooltip = <Tooltip id="editTooltip">Show/Hide the inline Team Viewer and Editor </Tooltip>;

   const table = React.useMemo(() => {
      setLoadingOverride(false);

      const avgEff = efficiencyAverages[`${gender}_${year}`] || efficiencyAverages.fallback;
         
      const playerPartition = _.transform(dataEvent.players || [], (acc, p) => {
         const teams = [ (p.team || "") ].concat(
            _.flatMap(dataEvent.transfers || [], txfers => {
               return ((txfers || {})[p.code || ""] || [])
                  .flatMap(txfer => txfer.t ? [ txfer.t, txfer.f ] : [ txfer.f ]);
            })      
         ).concat( // Add all players that might be added to this team
            _.flatMap(teamOverrides,
               (teamEdit, teamName) => ((teamEdit.addedPlayers || "").indexOf((p.code || "") + ":") >= 0) ? [ teamName ] : []
            )
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
      const numTeams = _.size(teamList);

      // For each team, do the big off-season calcs:

      const mutableDivisionStats: DivisionStatistics = { 
         tier_sample_size: 0,
         dedup_sample_size: 0,
         tier_samples: {},
         tier_lut: {},
         dedup_samples: {}
        };

      const teamRanks = _.chain(teamList).map(t => {

         const maybeOverride = teamOverrides[t] || {};

         const addedPlayers = maybeOverride.addedPlayers ? TeamEditorUtils.fillInAddedPlayers(
            team, year,
            maybeOverride.addedPlayers || "", playerPartition[t] || [], dataEvent.transfers?.[1] || {},
            false, maybeOverride.superSeniorsBack || false
         ) : {};
         const overrides = maybeOverride.overrides ? TeamEditorUtils.urlParamstoPlayerEditModels(maybeOverride.overrides) : {};
         const disabledPlayers = _.chain((maybeOverride.disabledPlayers || "").split(";")).map(p => [ p, true ]).fromPairs().value();
         const deletedPlayers = _.chain((maybeOverride.deletedPlayers || "").split(";")).map(p => [ p, "unknown" ]).fromPairs().value();
 
         const pxResults = TeamEditorUtils.teamBuildingPipeline(
            gender, t, year,
            playerPartition[t] || [], dataEvent.transfers || [],
            true, false,
            addedPlayers, overrides, deletedPlayers, disabledPlayers,
            maybeOverride.superSeniorsBack || false, false,
            avgEff
         );
         const filteredPlayerSet = TeamEditorUtils.getFilteredPlayersWithBench(pxResults, disabledPlayers);
         
         const buildTotals = (triples: GoodBadOkTriple[], range: "good" | "bad" | "ok" | "orig", adj: number = 0) => {
            const { off, def, net } = TeamEditorUtils.buildTotals(triples, range);

            const netInfo = _.transform(triples, (acc, triple) => { 
               const netEff = TeamEditorUtils.getNet(triple.ok || {});
               if (netEff >= 6.5) {
                  acc.numSuperstars = acc.numSuperstars + 1;
               } else if (netEff >= 5) {
                  acc.numStars = acc.numStars + 1;
               } else if (netEff >= 3.5) {
                  acc.numStarters = acc.numStarters + 1;
               } else if (netEff >= 2) {
                  acc.numRotation = acc.numRotation + 1;
               }

            }, { numSuperstars: 0, numStars: 0, numStarters: 0, numRotation: 0});
            return { off, def, net, ...netInfo };
         };
         const okTotals = buildTotals(filteredPlayerSet, "ok");
         const goodNet = _.sumBy(pxResults.basePlayersPlusHypos, triple => {
            return (triple.good.off_team_poss_pct.value || 0)*TeamEditorUtils.getNet(triple.good);
         });
         const badNet = _.sumBy(pxResults.basePlayersPlusHypos, triple => {
            return (triple.bad.off_team_poss_pct.value || 0)*TeamEditorUtils.getNet(triple.bad);
         });

         const confStr = efficiencyInfo[`${gender}_Latest`]?.[0]?.[t]?.conf || "???";

         GradeUtils.buildAndInjectDivisionStats(
            { off_rapm: { value: okTotals.off }, def_rapm: { value: okTotals.def }, off_net: { value: okTotals.net } },
            {}, mutableDivisionStats, true, [ "off_rapm", "def_rapm", "off_net" ]
         );

         return { ...okTotals, 
            goodNet, badNet,
            team: t, 
            conf: ConferenceToNickname[confStr] || "???", 
            rosterInfo: `${okTotals.numSuperstars} / ${okTotals.numStars} / ${okTotals.numStarters} / ${okTotals.numRotation}` 
         };
      }).sortBy(t => -t.net).value();

      // Lookups
      const offEffToRankMap = _.chain(teamRanks).sortBy(t => -t.off).map((t, rank) => [t.off, rank]).fromPairs().value();
      const defEffToRankMap = _.chain(teamRanks).sortBy(t =>t.def).map((t, rank) => [t.def, rank]).fromPairs().value();
      const netEffToRankMap = confs ? _.chain(teamRanks).sortBy(t => -t.net).map((t, rank) => [t.net, rank]).fromPairs().value() : {};
      GradeUtils.buildAndInjectDivisionStatsLUT(mutableDivisionStats);

      const tableDefs = {
         title: GenericTableOps.addTitle("", "", CommonTableDefs.rowSpanCalculator, "small", GenericTableOps.htmlFormatter, 10),
         "conf": GenericTableOps.addDataCol("Conf", "The team's conference", GenericTableOps.defaultColorPicker, GenericTableOps.htmlFormatter),
         "sep0": GenericTableOps.addColSeparator(),

         net: GenericTableOps.addPtsCol("Net", "Net Adjusted Pts/100 above an average D1 player, for 'Balanced' projections", CbbColors.varPicker(CbbColors.off_diff35_p100_redGreen)),
         net_grade: GenericTableOps.addDataCol("Rank", 
            "Net Adjusted Pts/100 ranking, for 'Balanced' projections",
            CbbColors.varPicker(CbbColors.high_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),

         "sep1": GenericTableOps.addColSeparator(),

         off: GenericTableOps.addPtsCol("Off", "Offensive Adjusted Pts/100 above an average D1 player, for 'Balanced' projections", CbbColors.varPicker(CbbColors.off_pp100)),
         off_grade: GenericTableOps.addDataCol(
            "Rank", "Offensive Adjusted Pts/100 ranking, for 'Balanced' projections", 
            CbbColors.varPicker(CbbColors.high_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),

         "sep2": GenericTableOps.addColSeparator(),

         def: GenericTableOps.addPtsCol("Def", "Defensive Adjusted Pts/100 above an average D1 player, for 'Balanced' projections", CbbColors.varPicker(CbbColors.def_pp100)),
         def_grade: GenericTableOps.addDataCol(
            "Rank", "Defensive Adjusted Pts/100 ranking, for 'Balanced' projections", 
            CbbColors.varPicker(CbbColors.high_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),

         "sep3": GenericTableOps.addColSeparator(),

         high_grade: GenericTableOps.addDataCol(
            "Good", "Optimistic net ranking", 
            CbbColors.varPicker(CbbColors.high_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
         low_grade: GenericTableOps.addDataCol(
            "Bad", "Pessimistic net ranking", 
            CbbColors.varPicker(CbbColors.high_pctile_qual), GenericTableOps.gradeOrHtmlFormatter),
   
         "sep4": GenericTableOps.addColSeparator(),

         roster: GenericTableOps.addDataCol("Roster", "Projected of (high major) Superstars / Stars / Starters / Rotation players on the team", CbbColors.alwaysWhite, GenericTableOps.htmlFormatter),

         "sep5": GenericTableOps.addColSeparator(),

         edit: GenericTableOps.addDataCol("", "Edit the team projections", CbbColors.alwaysWhite, GenericTableOps.htmlFormatter),
      };

      const confFilter = (t: {team: string, conf: string}) => {
         return (confs == "") || (confs.indexOf(t.conf) >= 0) 
           || ((confs.indexOf(nonHighMajorConfsName) >= 0) && (powerSixConfsStr.indexOf(t.conf) < 0))
           || ((confs.indexOf(queryFiltersName) >= 0) && ((startingState.queryFilters || "").indexOf(`${t.team};`) >= 0))
           ;
      }
      const tableRows = _.chain(teamRanks).filter(confFilter).take(75).flatMap((t, netRankIn) => {

         const goodNet = GradeUtils.buildTeamPercentiles(mutableDivisionStats, { off_net: { value: t.goodNet } }, [ "net" ], true);
         const badNet = GradeUtils.buildTeamPercentiles(mutableDivisionStats, { off_net: { value: t.badNet } }, [ "net" ], true);

         const teamParams = {
            year, gender, team: t.team,
            ...(teamOverrides[t.team] || {})
         };
         const teamTooltip = (
            <Tooltip id={`teamTooltip`}>Open new tab with the detailed off-season predictions for this team</Tooltip>
          );
         const teamLink = <OverlayTrigger placement="auto" overlay={teamTooltip}>
            <a target="_blank" href={UrlRouting.getTeamEditorUrl(teamParams)}><b>{t.team}</b></a>
         </OverlayTrigger>;
    
         ;
         const netRank = confs ? netEffToRankMap[t.net]! : netRankIn;

         const pickSubHeaderMessage = (rank: number) => {
            if (rank == 0) {
               return "Top 25 + 1";
            } else if (rank == 26) {
               return "Solid NCAAT teams";
            } else if (rank == 35) {
               return "The Bubble";
            } else if (rank == 55) {
               return "Autobids / AD on Selection Committee / Maybe Next Year";
            } else {
               return "";
            }
         };
         const subHeaderMessage = pickSubHeaderMessage(netRank);
         const subHeaderRows = (confs || !subHeaderMessage) ? [] : ([
            GenericTableOps.buildSubHeaderRow([
               [ <div/>, 4 ], [ <i>{subHeaderMessage}</i>, 9 ]
            ], "small text-center") 
         ].concat(
            (netRank == 0) ? [] : [
               GenericTableOps.buildHeaderRepeatRow({}, "small")
            ]
         ));

         return subHeaderRows.concat([ GenericTableOps.buildDataRow({
               title: <span>{(confs != "") ? <sup><small>{1 + netRankIn}</small>&nbsp;</sup> : null}{teamLink}</span>,
               conf: <small>{t.conf}</small>,

               net: { value: t.net },
               net_grade: { samples: numTeams, value: (1.0*(numTeams - netRank))/numTeams },
               off: { value: avgEff + t.off },
               off_grade: { samples: numTeams, value: (1.0*(numTeams - offEffToRankMap[t.off]!))/numTeams },
               def: { value: avgEff + t.def },
               def_grade: { samples: numTeams, value: (1.0*(numTeams - defEffToRankMap[t.def]!))/numTeams },

               high_grade: goodNet.off_net,
               low_grade: badNet.off_net,

               roster: <span style={{whiteSpace: "nowrap"}}><small>{t.rosterInfo}</small></span>,
               edit: <OverlayTrigger overlay={editTooltip} placement="auto">
                  <Button variant={(t.team == team) ? "secondary" : "outline-secondary"} size="sm" onClick={(ev: any) => {
                     friendlyChange(() => {
                        if (team == t.team) {
                           setTeam("");
                        } else {
                           setTeam(t.team);
                        }
                     }, true);
               }}><FontAwesomeIcon icon={faEye} /></Button></OverlayTrigger>,
            }, GenericTableOps.defaultFormatter, GenericTableOps.defaultCellMeta)
         ]).concat((team == t.team) ? [
            GenericTableOps.buildTextRow(
               <TeamEditorTable
                  startingState={{
                     team, year, gender,
                     ...(teamOverrides[team] || {})
                  }}
                  dataEvent={dataEvent}
                  onChangeState={(newState) => {
                     const newOverrides = _.cloneDeep(teamOverrides);
                     if (_.isEmpty(newState)) {
                        delete newOverrides[team];
                     } else {
                        newOverrides[team] = newState;
                     }
                     friendlyChange(() => {
                        setTeamOverrides(newOverrides);
                     }, true);
                  }}
                  overrideGrades={mutableDivisionStats}
               />
            )
         ] : []);
      }).value();

      return <GenericTable       
         tableCopyId="teamTable"
         tableFields={tableDefs}
         tableData={tableRows}
         cellTooltipMode={undefined}
      />;
   }, [
      gender, year, confs, team, dataEvent, teamOverrides
   ]);

   // 3] View

   /** Sticks an overlay on top of the table if no query has ever been loaded */
   function needToLoadQuery() {
      return !dataEvent.error && (loadingOverride || ((dataEvent?.players || []).length == 0));
   }

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
               value={stringToOption("Men")}
               options={["Men"].map(
                  (gender) => stringToOption(gender)
               )}
               isSearchable={false}
               onChange={(option) => { if ((option as any)?.value) {
                  /* currently only support Men */
               }}}
            />
         </Col>
         <Col xs={6} sm={6} md={3} lg={2} style={{zIndex: 11}}>
            <Select
               value={stringToOption("2022/23")}
               options={
               (
                  ["2019/20", "2020/21", "2021/22", "2022/23"]
               ).concat(tier == "High" ? ["Extra"] : []).map(
                  (r) => stringToOption(r)
               )}
               isSearchable={false}
               onChange={(option) => { if ((option as any)?.value) {
                  /* currently only support 2022/23 - but lets other years be specified to jump between off-season predictions and previous results */
                  setYearRedirect((option as any)?.value);
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
            <LoadingOverlay
               active={needToLoadQuery()}
               spinner
               text={"Loading Offseason Leaderboard..."}
            >
               {table}
            </LoadingOverlay>
         </Col>
      </Row>
   </Container>;
 }
 export default OffSeasonLeaderboardTable;
