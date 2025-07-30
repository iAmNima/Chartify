import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box, Text } from '@chakra-ui/react';

const ScatterPlot = ({ title, data }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove(); // Clear previous chart

    const width = 500;
    const height = 300;
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.x)])
      .nice()
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Axes
    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));

    // Points
    svg
      .append('g')
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', (d) => x(d.x))
      .attr('cy', (d) => y(d.y))
      .attr('r', 5)
      .attr('fill', '#38A169');

    // Optional labels
    svg
      .append('g')
      .selectAll('text')
      .data(data)
      .join('text')
      .text((d) => d.label || '')
      .attr('x', (d) => x(d.x) + 6)
      .attr('y', (d) => y(d.y) - 6)
      .attr('font-size', '10px');
  }, [data]);

  return (
    <Box>
      <Text fontWeight="bold" mb={2}>{title}</Text>
      <svg ref={ref} width="100%" height="300px" />
    </Box>
  );
};

export default ScatterPlot;
