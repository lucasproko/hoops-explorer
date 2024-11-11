// React imports:
import React, { useState, useRef, useEffect } from "react";

import _ from "lodash";

// Utils
import { CbbColors } from "../../utils/CbbColors";
import GenericTable, { GenericTableOps } from "../../components/GenericTable";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

/////////////////////// 2D Shot Chart

// D3

import * as d3 from "d3";
import { hexbin } from "d3-hexbin";
import { ShotStats } from "../../utils/StatModels";

interface HexData {
  frequency: number;
  intensity: number;
  x: number;
  y: number;
  tooltip: string;
}

interface HexMapProps {
  data: HexData[];
}
const HexMap: React.FC<HexMapProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // 600 pixels is approx 60 ft
    // at precision 15, hexagon is 0.9ft2

    const width = 550;
    const height = 600;
    //const hexRadius = 9; // precision 15 Radius of a full-size hexagon
    //const hexRadius = Math.sqrt(63 / Math.PI); // precision 14 - area==6.267m2 Radius of a full-size hexagon
    const hexRadius = 15; //precision 15 empirically seems like radius is about 1.5

    //const maxFreq = 3.0; //(precision 15)
    //const maxFreq = 8.0; //(precision 14)
    const maxFreq = 5.0; //(precision 14)

    //https://h3geo.org/docs/core-library/restable/

    // Define a scale for frequency -> hex size
    const sizeScale = d3
      .scaleSqrt()
      .domain([0, maxFreq]) // Frequency from 0% to 8%
      .range([0.1, 1]); // Scale hex size from 20% to 100%

    const opacityScale = d3
      .scaleLinear()
      .domain([0, maxFreq]) // Frequency from 0% to 8% TODO for lower precisions needs to be higher
      .range([0.5, 1]); // Scale hex size from 20% to 100%

    // Define a color scale for intensity
    const colorScale = d3
      .scaleSequential(d3.interpolateBlues) // Adjust color scheme as needed
      .domain([0, 1]);
    const cbbColorScale = CbbColors.off_eFgShotChart;

    // Define scales for x and y to map original coordinates to canvas
    const xScale = d3
      .scaleLinear()
      .domain([-5, 40]) // Original x range
      .range([0, width]); // Canvas width range

    const yScale = d3
      .scaleLinear()
      .domain([-26, 26]) // Original y range
      .range([height, 0]); // Invert y scale to make top of canvas 0

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

    const debugMode = true;
    // Add hexagons to the SVG
    if (debugMode)
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
        //const hexSize = hexRadius;
        return hexbinGenerator.hexagon(hexSize);
      })
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
      .attr("fill", (d) => {
        const hexData = dataMap.get(d[0]);

        //return hexData ? colorScale(hexData.intensity) : "#ccc";
        return hexData ? cbbColorScale(hexData.intensity) : "#ccc";
      })
      .attr("opacity", (d) => {
        const hexData = dataMap.get(d[0]);
        return hexData ? opacityScale(hexData.frequency) : 1;
        //return 1;
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
    // .attr("stroke", "#333")
    // .attr("stroke-width", 0.5);

    return () => {
      tooltip.remove(); // Clean up tooltip on unmount
    };
  }, [data]);

  return <svg ref={svgRef} width="800" height="600"></svg>;
};

///////////////////// Top Level Logic

type Props = {
  off: ShotStats;
  def: ShotStats;
};

const shotStatsToHexData = (stats: ShotStats): HexData[] => {
  const total_freq = stats?.doc_count || 1;
  return (stats?.shot_chart?.buckets || [])
    .map((shotInfo) => {
      const x = shotInfo.center.location.x;
      const y = shotInfo.center.location.y;
      const frequency = shotInfo.doc_count;
      const intensity = shotInfo.total_pts.value / shotInfo.doc_count;

      return {
        x,
        y,
        intensity,
        frequency: 100 * (frequency / total_freq),
        tooltip: `[${frequency}] shots ([${(
          100 *
          (frequency / total_freq)
        ).toFixed(2)}]%), [${shotInfo.total_pts.value}] pts (eff=[${(
          100 * intensity
        ).toFixed(2)}]%)`,
      };
    })
    .filter((h) => h.x <= 35);
};

const ShotChartDiagView: React.FunctionComponent<Props> = ({ off, def }) => {
  return (
    <Container>
      <Row>
        <Col xs={6}>
          <HexMap data={shotStatsToHexData(off)} />
        </Col>
        <Col xs={6}>
          <HexMap data={shotStatsToHexData(def)} />
        </Col>
      </Row>
    </Container>
  );
};
export default ShotChartDiagView;
