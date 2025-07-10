import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BubbleChart = ({ data, width = 600, height = 300 }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.x))
      .nice()
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.y))
      .nice()
      .range([innerHeight, 0]);

    const size = d3
      .scaleSqrt()
      .domain([0, d3.max(data, (d) => d.size || 1)])
      .range([4, 30]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    g.append('g').call(d3.axisLeft(y));

    // Bubbles
    g.selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', (d) => x(d.x))
      .attr('cy', (d) => y(d.y))
      .attr('r', (d) => size(d.size || 1))
      .attr('fill', (d) => color(d.label))
      .attr('opacity', 0.7);

    // Optional Labels
    g.selectAll('text.label')
      .data(data)
      .join('text')
      .attr('x', (d) => x(d.x))
      .attr('y', (d) => y(d.y))
      .text((d) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .style('font-size', '10px');
  }, [data]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default BubbleChart;
