import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box, Text } from '@chakra-ui/react';

const HeatmapChart = ({ title, data, width = 500, height = 400 }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const allX = Array.from(new Set(data.map((d) => d.x)));
    const allY = Array.from(new Set(data.map((d) => d.y)));

    const x = d3.scaleBand().domain(allX).range([0, innerWidth]).padding(0.05);
    const y = d3.scaleBand().domain(allY).range([0, innerHeight]).padding(0.05);

    const color = d3
      .scaleSequential()
      .interpolator(d3.interpolateYlGnBu)
      .domain([0, d3.max(data, (d) => d.value)]);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g').call(d3.axisLeft(y));
    g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));

    g.selectAll()
      .data(data, (d) => d.x + ':' + d.y)
      .join('rect')
      .attr('x', (d) => x(d.x))
      .attr('y', (d) => y(d.y))
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill', (d) => color(d.value));

    // Optional labels
    g.selectAll('.label')
      .data(data)
      .join('text')
      .attr('x', (d) => x(d.x) + x.bandwidth() / 2)
      .attr('y', (d) => y(d.y) + y.bandwidth() / 2)
      .text((d) => d.value)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('fill', '#333')
      .style('font-size', '10px');
  }, [data]);

  return (
    <Box>
      <Text fontWeight="bold" mb={2}>{title}</Text>
      <svg ref={svgRef} width={width} height={height} />
    </Box>
  );
};

export default HeatmapChart;
