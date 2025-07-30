import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box, Text } from '@chakra-ui/react';

const GaugeChart = ({ title, data, width = 300, height = 180 }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || typeof data.value !== 'number') return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const radius = Math.min(width, height * 2) / 2;
    const centerX = width / 2;
    const centerY = height;

    const arc = d3
      .arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle((Math.PI / 100) * data.value - Math.PI / 2);

    const backgroundArc = d3
      .arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    // Draw background arc
    svg
      .append('path')
      .attr('d', backgroundArc())
      .attr('fill', '#e2e8f0')
      .attr('transform', `translate(${centerX}, ${centerY})`);

    // Draw foreground arc (value)
    svg
      .append('path')
      .attr('d', arc())
      .attr('fill', '#38b2ac')
      .attr('transform', `translate(${centerX}, ${centerY})`);

    // Label
    svg
      .append('text')
      .attr('x', centerX)
      .attr('y', centerY + 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '24px')
      .attr('fill', '#2d3748')
      .text(`${data.value}%`);
  }, [data]);

  return (
    <Box>
      <Text fontWeight="bold" mb={2}>{title}</Text>
      <svg ref={svgRef} width={width} height={height} />
    </Box>
  );
};

export default GaugeChart;
