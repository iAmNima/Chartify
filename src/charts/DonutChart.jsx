import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box, Text } from '@chakra-ui/react';

const DonutChart = ({ title, data }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove(); // Clear previous chart

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie().value((d) => d.value);
    const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius * 0.9);

    const chartGroup = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const arcs = chartGroup.selectAll('path')
      .data(pie(data))
      .join('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i))
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5);

    // Add labels
    chartGroup.selectAll('text')
      .data(pie(data))
      .join('text')
      .text((d) => d.data.label)
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px');
  }, [data]);

  return (
    <Box>
      <Text fontWeight="bold" mb={2}>{title}</Text>
      <svg ref={ref} width="100%" height="300px" />
    </Box>
  );
};

export default DonutChart;
