import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box, Text } from '@chakra-ui/react';

const LineChart = ({ title, xLabel, yLabel, data }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove(); // clear previous

    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    const x = d3
      .scalePoint()
      .domain(data.map(d => d.label))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line()
      .x(d => x(d.label))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#2B6CB0') // Chakra blue.700
      .attr('stroke-width', 2)
      .attr('d', line);

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Optional: add points
    svg
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', d => x(d.label))
      .attr('cy', d => y(d.value))
      .attr('r', 3)
      .attr('fill', '#2B6CB0');
  }, [data]);

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={2}>{title}</Text>
      <svg ref={ref} width={600} height={300}></svg>
      <Text mt={2} fontSize="sm" color="gray.500">
        {xLabel} vs {yLabel}
      </Text>
    </Box>
  );
};

export default LineChart;
