import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const RadarChart = ({ data, width = 500, height = 500 }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = 60;
    const radius = Math.min(width, height) / 2 - margin;
    const allAxis = data.map((d) => d.axis);
    const total = allAxis.length;

    const angleSlice = (Math.PI * 2) / total;

    const rScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([0, radius]);

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Grid lines
    const levels = 5;
    for (let level = 0; level < levels; level++) {
      const levelFactor = radius * ((level + 1) / levels);
      g.selectAll('.levels')
        .data(allAxis)
        .join('line')
        .attr('x1', (_, i) => levelFactor * Math.cos(angleSlice * i - Math.PI / 2))
        .attr('y1', (_, i) => levelFactor * Math.sin(angleSlice * i - Math.PI / 2))
        .attr('x2', (_, i) =>
          levelFactor * Math.cos(angleSlice * (i + 1) - Math.PI / 2)
        )
        .attr('y2', (_, i) =>
          levelFactor * Math.sin(angleSlice * (i + 1) - Math.PI / 2)
        )
        .attr('stroke', '#ccc')
        .attr('stroke-width', '0.7px');
    }

    // Axes
    const axis = g.selectAll('.axis').data(allAxis).enter().append('g');

    axis
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (_, i) => rScale(d3.max(data, (d) => d.value)) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (_, i) => rScale(d3.max(data, (d) => d.value)) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('stroke', '#999');

    axis
      .append('text')
      .attr('x', (_, i) => (rScale(d3.max(data, (d) => d.value)) + 10) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (_, i) => (rScale(d3.max(data, (d) => d.value)) + 10) * Math.sin(angleSlice * i - Math.PI / 2))
      .text((d) => d)
      .style('font-size', '11px')
      .attr('text-anchor', 'middle');

    // Radar area
    const radarLine = d3
      .lineRadial()
      .radius((d) => rScale(d.value))
      .angle((_, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    g.append('path')
      .datum(data)
      .attr('d', radarLine)
      .attr('fill', '#3182ce')
      .attr('fill-opacity', 0.4)
      .attr('stroke', '#2b6cb0')
      .attr('stroke-width', 2);
  }, [data]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default RadarChart;
