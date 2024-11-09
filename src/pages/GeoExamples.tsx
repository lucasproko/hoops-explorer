// Google analytics:
import { initGA, logPageView } from "../utils/GoogleAnalytics";

// React imports:
import React, { useState, useEffect, useRef } from "react";
import Router, { useRouter } from "next/router";
import Link from "next/link";

// Next imports:
import { NextPage } from "next";
import Head from "next/head";
import fetch from "isomorphic-unfetch";

// Lodash:
import _ from "lodash";

// Bootstrap imports:

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import chroma from "chroma-js";

import * as d3 from "d3";
import { hexbin } from "d3-hexbin";

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

const redXxxGreen = chroma.scale(["red", "white", "green"]);

const HexMap: React.FC<HexMapProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // 600 pixels is approx 60 ft
    // at precision 15, hexagon is 0.9ft2

    const width = 800;
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
    const cbbColorScale = redXxxGreen.domain([0.3, 0.5, 0.7]);

    // Define scales for x and y to map original coordinates to canvas
    const xScale = d3
      .scaleLinear()
      .domain([-20, 60]) // Original x range
      .range([0, width]); // Canvas width range

    const yScale = d3
      .scaleLinear()
      .domain([-30, 30]) // Original y range
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
        return hexData ? cbbColorScale(hexData.intensity).hex() : "#ccc";
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

const GeoExamples: NextPage<{}> = ({}) => {
  var total_freq = 0;
  const hexData: HexData[] = (
    testData?.aggregations?.shot_chart?.buckets || []
  ).map((shotInfo: any) => {
    const x = shotInfo.center.location.x;
    const y = shotInfo.center.location.y;
    const frequency = shotInfo.doc_count;
    total_freq += shotInfo.doc_count;
    const intensity = shotInfo.total_pts.value / shotInfo.doc_count;

    return {
      x,
      y,
      frequency,
      intensity,
    };
  });

  return (
    <div className="App">
      <h1>Hex chart</h1>
      <HexMap
        data={_.take(
          hexData.map((h) => ({
            ...h,
            frequency: 100 * (h.frequency / total_freq),
            tooltip: `[${h.frequency}] shots ([${(
              100 *
              (h.frequency / total_freq)
            ).toFixed(2)}]%), [${(h.intensity * h.frequency).toFixed(
              0
            )}] pts (eFG=${h.intensity.toFixed(2)})`,
          })),
          100000
        )}
      />
    </div>
  );
};
export default GeoExamples;

/** Query

POST shot_events_men_bigeast_2023_lping/_search?q=team.team:UConn
{
  "size": 0,
  "aggs": {
    "teams": {
      "terms": {
        "field": "team.team.keyword"
      }
    },
    "shot_chart": {
         "geohex_grid": {
            "field": "geo",
            "precision": 14
          },
          "aggs": {
            "center": {
              "cartesian_centroid": { "field": "loc" }
            },
            "edges": {
      "cartesian_bounds": {
        "field": "loc"    
      }              
            },
            "avg_dist": {
              "avg": { "field": "dist" }
            },
            "total_pts": {
              "sum": { "field": "pts" }
            }
          }
    }
  }
}

 */

const testData = {} as any;
