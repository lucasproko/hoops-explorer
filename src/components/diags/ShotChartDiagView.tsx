// React imports:
import React, { useState, useRef, useEffect } from "react";

import _ from "lodash";

// Utils
import { CbbColors } from "../../utils/CbbColors";
import GenericTable, { GenericTableOps } from "../../components/GenericTable";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ShotChartAvgs_Men_2024 } from "../../utils/internal-data/ShotChartAvgs_Men_2024";
import { ShotChartAvgs_Women_2024 } from "../../utils/internal-data/ShotChartAvgs_Women_2024";

/////////////////////// 2D Shot Chart

// D3

import * as d3 from "d3";
import { hexbin } from "d3-hexbin";
import { ShotStats } from "../../utils/StatModels";

interface HexData {
  key: string;
  frequency: number;
  intensity: number;
  x: number;
  y: number;
  tooltip: string;
}

interface HexZone {
  minDist: number;
  maxDist: number;
  distCenter?: number; //(if not specified then take average)
  minAngle: number;
  maxAngle: number;
  frequency: number;
  intensity: number;
}

/** 0 is horizontal axis pointing left, when averaging angle make >= 90 and <= 270 */
const buildStartingZones = (): HexZone[] => {
  return [
    // Under the basket (1x)
    {
      minDist: -10,
      maxDist: 5,
      distCenter: 0,
      minAngle: 0,
      maxAngle: 360,
      frequency: 0,
      intensity: 0,
    },
    // Close to the basket (2x)
    {
      minDist: 5,
      maxDist: 10,
      minAngle: 0,
      maxAngle: 180,
      frequency: 0,
      intensity: 0,
    },
    {
      minDist: 5,
      maxDist: 10,
      minAngle: 180,
      maxAngle: 360,
      frequency: 0,
      intensity: 0,
    },
    // Mid-range (3x)
    {
      minDist: 10,
      maxDist: 21,
      minAngle: 0,
      maxAngle: 150,
      frequency: 0,
      intensity: 0,
    },
    {
      minDist: 10,
      maxDist: 21,
      minAngle: 150,
      maxAngle: 210,
      frequency: 0,
      intensity: 0,
    },
    {
      minDist: 10,
      maxDist: 21,
      minAngle: 210,
      maxAngle: 360,
      frequency: 0,
      intensity: 0,
    },
    // 3P (5x)
    {
      minDist: 21,
      maxDist: 100,
      minAngle: 0,
      maxAngle: 126,
      frequency: 0,
      intensity: 0,
    },
    {
      minDist: 21,
      maxDist: 100,
      minAngle: 126,
      maxAngle: 162,
      frequency: 0,
      intensity: 0,
    },
    {
      minDist: 21,
      maxDist: 100,
      minAngle: 162,
      maxAngle: 198,
      frequency: 0,
      intensity: 0,
    },
    {
      minDist: 21,
      maxDist: 100,
      minAngle: 198,
      maxAngle: 234,
      frequency: 0,
      intensity: 0,
    },
    {
      minDist: 21,
      maxDist: 100,
      minAngle: 234,
      maxAngle: 0,
      frequency: 0,
      intensity: 0,
    },
  ];
};

const MIN_X = -5;
const MAX_X = 35;
const MIN_Y = -26;
const MAX_Y = 26;
const HEX_HEIGHT = 520;
const HEX_WIDTH = 400;

interface HexMapProps {
  data: HexData[];
  width: number;
  height: number;
  showZones?: boolean;
  zones?: HexZone[];
  diffDataSet?: Record<string, { avg_freq: number; avg_ppp: number }>;
}
const HexMap: React.FC<HexMapProps> = ({
  data,
  width,
  height,
  diffDataSet,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Define scales for x and y to map original coordinates to canvas
  const xScale = d3
    .scaleLinear()
    .domain([MIN_X, MAX_X]) // Original x range
    .range([0, width]); // Canvas width range

  const yScale = d3
    .scaleLinear()
    .domain([MIN_Y, MAX_Y]) // Original y range
    .range([height, 0]); // Invert y scale to make top of canvas 0

  const injectCourtLines = (
    svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
    phase: number
  ) => {
    const D = {
      court_length_x_px: 940.0,
      court_width_y_px: 500.0,
      court_length_ft: 94.0,
      court_width_ft: 50.0,
      half_court_x_px: 470.0,
      ft_per_px_x: 94.0 / 940.0,
      ft_per_px_y: 50.0 / 500.0,
      goal_left_x_px: 50.0,
      goal_y_px: 250.0,
    };
    // Transform function
    const transformCoords = (x: number, y: number) => ({
      x: (x - D.goal_left_x_px) * D.ft_per_px_x,
      y: (D.goal_y_px - y) * D.ft_per_px_y,
    });
    if (phase == 0) {
      // Add rect
      const rectCoords = transformCoords(0, 190.145752);
      svg
        .append("rect")
        .attr("x", xScale(rectCoords.x))
        .attr("y", yScale(rectCoords.y))
        .attr("width", xScale(190 * D.ft_per_px_x) - xScale(0))
        .attr("height", yScale(0) - yScale(120 * D.ft_per_px_y))
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("fill", "none")
        .attr("id", "left_freethow_lane");

      // Add left free throw arc
      const ftArcCoords = transformCoords(190, 250);
      const arcPath = d3.arc()({
        innerRadius: yScale(200 * D.ft_per_px_y), //(I don't understand where this comes from?!)
        outerRadius: yScale(200 * D.ft_per_px_y),
        startAngle: 0,
        endAngle: Math.PI,
      });
      svg
        .append("path")
        .attr("d", arcPath)
        .attr(
          "transform",
          `translate(${xScale(ftArcCoords.x)}, ${yScale(ftArcCoords.y)})`
        )
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("fill", "none")
        .attr("id", "left_free_throw_arc");

      // Add bottom 3pt line
      const bottom3ptCoords = transformCoords(0, 450);
      svg
        .append("path")
        .attr(
          "d",
          `M${xScale(bottom3ptCoords.x)},${yScale(bottom3ptCoords.y)}h${
            xScale(94.5 * D.ft_per_px_x) - xScale(0)
          }`
        )
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("fill", "none")
        .attr("id", "3pt_line_bottom_left");

      // Add top 3pt line
      const top3ptCoords = transformCoords(0, 47);
      svg
        .append("path")
        .attr(
          "d",
          `M${xScale(top3ptCoords.x)},${yScale(top3ptCoords.y)}h${
            xScale(94.5 * D.ft_per_px_x) - xScale(0)
          }`
        )
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("fill", "none")
        .attr("id", "3pt_line_top_left");

      // Add 3pt arc
      const threePtArcCoords = transformCoords(93, 33.5 + 215);

      const arcPath3pt = d3.arc()({
        innerRadius: xScale(201.5 * D.ft_per_px_x) - xScale(0),
        outerRadius: xScale(201.5 * D.ft_per_px_x) - xScale(0),
        startAngle: 0,
        endAngle: Math.PI,
      });
      svg
        .append("path")
        .attr("d", arcPath3pt)
        .attr(
          "transform",
          `translate(${xScale(threePtArcCoords.x)}, ${yScale(
            threePtArcCoords.y
          )})`
        )
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("fill", "none")
        .attr("id", "3pt_arc_left");
    }
    if (phase == 1) {
      // Add goal left circle
      const goalCoords = transformCoords(50, 250);
      svg
        .append("circle")
        .attr("cx", xScale(goalCoords.x))
        .attr("cy", yScale(goalCoords.y))
        .attr("r", xScale(9 * D.ft_per_px_x) - xScale(0))
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("fill", "none")
        .attr("id", "goal_left");
    }
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // 500 pixels is approx 50 ft
    // at precision 15, hexagon is 0.9ft2

    const hexRadius = 15 * (height / 520); //(precision 14 empirically seems like radius is about 1.5)

    const maxFreq = 5.0; //(precision 14)

    //https://h3geo.org/docs/core-library/restable/

    // Define a scale for frequency -> hex size
    const sizeScale = d3.scaleSqrt().domain([0, maxFreq]).range([0.1, 1]); // Scale hex size from 10% to 100%

    const opacityScale = d3.scaleLinear().domain([0, maxFreq]).range([0.5, 1]); // Scale opactiy from 50% to 100%

    // Define a color scale for intensity
    const colorScale = d3
      .scaleSequential(d3.interpolateBlues) // Adjust color scheme as needed
      .domain([0, 1]);
    const cbbColorScale = diffDataSet
      ? CbbColors.diff_eFgShotChart
      : CbbColors.off_eFgShotChart;

    // Set up the hexbin generator
    const hexbinGenerator = hexbin<number[]>()
      .radius(hexRadius)
      .extent([
        [0, 0],
        [width, height],
      ]);
    const points = data.map((d) => [xScale(d.x), yScale(d.y)]);
    const dataMap = new Map(points.map((point, index) => [point, data[index]]));

    // Convert (x, y) positions to hexbin layout
    const hexes = hexbinGenerator(points);

    // Clear any previous hexes
    svg.selectAll("*").remove();

    // Create a tooltip div (invisible by default)
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("padding", "5px")
      .style("background", "#333")
      .style("color", "#fff")
      .style("border-radius", "5px")
      .style("pointer-events", "none")
      .style("opacity", 0); // initially hidden

    svg
      .append("g")
      .selectAll("path")
      .data(hexes)
      .enter()
      .append("path")
      .attr("d", (d) => {
        return hexbinGenerator.hexagon(hexRadius);
      })
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
      .attr("fill", (d) => {
        return "#ffFFff";
      })
      .attr("stroke", "#ccc")
      .attr("stroke-width", 0.5);

    injectCourtLines(svg, 0);

    svg
      .append("g")
      .selectAll("path")
      .data(hexes)
      .enter()
      .append("path")
      .attr("d", (d) => {
        const hexData = dataMap.get(d[0]); // Get the original HexData for this point
        const hexFrequency = hexData ? hexData.frequency : 0;
        const hexPct = Math.min(sizeScale(hexFrequency), 1.0);
        const hexSize = hexRadius * hexPct;
        return hexbinGenerator.hexagon(hexSize);
      })
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
      .attr("fill", (d) => {
        const hexData = dataMap.get(d[0]);
        return hexData ? cbbColorScale(hexData.intensity * 0.5) : "#ccc";
      })
      .attr("opacity", (d) => {
        const hexData = dataMap.get(d[0]);
        return hexData ? opacityScale(hexData.frequency) : 1;
      })
      .on("mouseover", (event, d) => {
        const hexData = dataMap.get(d[0]);
        if (hexData) {
          tooltip.style("opacity", 1).html(hexData.tooltip);
        }
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0); // Hide tooltip on mouseout
      });

    injectCourtLines(svg, 1);

    return () => {
      tooltip.remove(); // Clean up tooltip on unmount
    };
  }, [data]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

///////////////////// Top Level Logic

const shotStatsToHexData = (
  stats: ShotStats,
  diffSet?: Record<string, { avg_freq: number; avg_ppp: number }>
): HexData[] => {
  const total_freq = stats?.doc_count || 1;
  return (stats?.shot_chart?.buckets || [])
    .map((shotInfo) => {
      const hexKey = shotInfo.key || "";
      const x = shotInfo.center.location.x;
      const y = shotInfo.center.location.y;
      const frequency = shotInfo.doc_count;
      const intensity = shotInfo.total_pts.value / shotInfo.doc_count;

      const { diffFreq, diffPpp } = _.thru(diffSet?.[hexKey], (diff) => {
        return {
          diffFreq: diff?.avg_freq || 0,
          diffPpp: diff?.avg_ppp || (_.isNil(diffSet) ? 0.0 : 1.0), //(whether the key is missing or we're not diffing at all)
        };
      });

      return {
        key: hexKey,
        x,
        y,
        intensity: intensity - diffPpp,
        frequency: 100 * (frequency / total_freq), //TODO we could try making it half the size if it's average freq?
        tooltip: `[${frequency}] shots ([${(
          100 *
          (frequency / total_freq)
        ).toFixed(2)}]%), [${shotInfo.total_pts.value}] pts (eff=[${(
          100 * intensity
        ).toFixed(2)}] pts/100)`,
      };
    })
    .filter((h) => h.x <= 35);
};

type Props = {
  gender: "Men" | "Women";
  off: ShotStats;
  def: ShotStats;
  absEff?: boolean; //(by default the efficiency is show vs D1 average)
};

const ShotChartDiagView: React.FunctionComponent<Props> = ({
  gender,
  off,
  def,
  absEff,
}) => {
  const diffDataSet = absEff
    ? undefined
    : gender == "Men"
    ? ShotChartAvgs_Men_2024
    : ShotChartAvgs_Women_2024;

  return (
    <Container>
      <Row>
        <Col xs={6}>
          <b>Team Shots</b>
        </Col>
        <Col xs={6}>
          <b>Opponent Shots</b>
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <HexMap
            data={shotStatsToHexData(off, diffDataSet)}
            diffDataSet={diffDataSet}
            width={HEX_WIDTH}
            height={HEX_HEIGHT}
          />
        </Col>
        <Col xs={6}>
          <HexMap
            data={shotStatsToHexData(def, diffDataSet)}
            diffDataSet={diffDataSet}
            width={HEX_WIDTH}
            height={HEX_HEIGHT}
          />
        </Col>
      </Row>
    </Container>
  );
};
export default ShotChartDiagView;
