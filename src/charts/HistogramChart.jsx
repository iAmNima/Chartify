import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box, Text } from '@chakra-ui/react';

const HistogramChart = ({ title, data, width = 600, height = 300 }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const values = data.map((d) => d.value);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(values))
      .nice()
      .range([0, innerWidth]);

    const bins = d3
      .bin()
      .domain(x.domain())
      .thresholds(10)(values);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(bins, (d) => d.length)])
      .nice()
      .range([innerHeight, 0]);

    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    chart
      .append('g')
      .selectAll('rect')
      .data(bins)
      .join('rect')
      .attr('x', (d) => x(d.x0) + 1)
      .attr('y', (d) => y(d.length))
      .attr('width', (d) => x(d.x1) - x(d.x0) - 2)
      .attr('height', (d) => innerHeight - y(d.length))
      .attr('fill', '#3182ce');

    chart
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    chart.append('g').call(d3.axisLeft(y));
  }, [data]);

  return (
    <Box>
      <Text fontWeight="bold" mb={2}>{title}</Text>
      <svg ref={svgRef} width={width} height={height} />
    </Box>
  );
};

export default HistogramChart;
