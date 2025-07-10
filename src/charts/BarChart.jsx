import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box, Text } from '@chakra-ui/react';

const BarChart = ({ title, xLabel, yLabel, data }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove(); // clear previous

    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const x = d3
      .scaleBand()
      .domain(data.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const xAxis = g =>
      g
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    const yAxis = g =>
      g
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    svg
      .append('g')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', d => x(d.label))
      .attr('y', d => y(d.value))
      .attr('height', d => y(0) - y(d.value))
      .attr('width', x.bandwidth())
      .attr('fill', '#3182CE'); // chakra blue.500

    svg.append('g').call(xAxis);
    svg.append('g').call(yAxis);
  }, [data]);

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={2}>{title}</Text>
      <svg ref={ref} width={600} height={300} />
      <Text mt={2} fontSize="sm" color="gray.500">
        {xLabel} vs {yLabel}
      </Text>
    </Box>
  );
};

export default BarChart;
