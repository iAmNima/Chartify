import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box, Text } from '@chakra-ui/react';

const TreemapChart = ({ title, data, width = 600, height = 400 }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Format for d3.hierarchy
    const root = d3
      .hierarchy({ children: data })
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);

    d3.treemap().size([width, height]).padding(2)(root);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    svg
      .selectAll('rect')
      .data(root.leaves())
      .join('rect')
      .attr('x', (d) => d.x0)
      .attr('y', (d) => d.y0)
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('fill', (d) => color(d.data.name));

    svg
      .selectAll('text')
      .data(root.leaves())
      .join('text')
      .attr('x', (d) => d.x0 + 4)
      .attr('y', (d) => d.y0 + 14)
      .text((d) => d.data.name)
      .attr('font-size', '10px')
      .attr('fill', 'white');
  }, [data]);

  return (
    <Box>
      <Text fontWeight="bold" mb={2}>{title}</Text>
      <svg ref={svgRef} width={width} height={height} />
    </Box>
  );
};

export default TreemapChart;
