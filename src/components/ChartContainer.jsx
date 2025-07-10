import React from 'react';
import { Box, VStack } from '@chakra-ui/react';

// Import all chart components
import BarChart from '../charts/BarChart';
import LineChart from '../charts/LineChart';
import PieChart from '../charts/PieChart';
import AreaChart from '../charts/AreaChart';
import ScatterPlot from '../charts/ScatterPlot';
import DonutChart from '../charts/DonutChart';
import HistogramChart from '../charts/HistogramChart';
import BubbleChart from '../charts/BubbleChart';
import RadarChart from '../charts/RadarChart';
import HeatmapChart from '../charts/HeatmapChart';
import BoxPlotChart from '../charts/BoxPlotChart';
import StackedBarChart from '../charts/StackedBarChart';
import TreemapChart from '../charts/TreemapChart';
import SunburstChart from '../charts/sunburstChart';
import GaugeChart from '../charts/GaugeChart';
import TimelineChart from '../charts/TimelineChart';

const ChartContainer = ({ chartData }) => {
  const renderChart = (chart, index) => {
    const { type, title, ...rest } = chart;
    const t = type.toLowerCase();

    switch (t) {
      case 'bar':
        return <BarChart key={index} title={title} {...rest} />;
      case 'line':
        return <LineChart key={index} title={title} {...rest} />;
      case 'pie':
        return <PieChart key={index} title={title} {...rest} />;
      case 'area':
        return <AreaChart key={index} title={title} {...rest} />;
      case 'scatter':
        return <ScatterPlot key={index} title={title} {...rest} />;
      case 'donut':
        return <DonutChart key={index} title={title} {...rest} />;
      case 'histogram':
        return <HistogramChart key={index} title={title} {...rest} />;
      case 'bubble':
        return <BubbleChart key={index} title={title} {...rest} />;
      case 'radar':
        return <RadarChart key={index} title={title} {...rest} />;
      case 'heatmap':
        return <HeatmapChart key={index} title={title} {...rest} />;
      case 'box':
        return <BoxPlotChart key={index} title={title} {...rest} />;
      case 'stacked bar':
      case 'stackedbar':
        return <StackedBarChart key={index} title={title} {...rest} />;
      case 'treemap':
        return <TreemapChart key={index} title={title} {...rest} />;
      case 'sunburst':
        return <SunburstChart key={index} title={title} {...rest} />;
      case 'gauge':
        return <GaugeChart key={index} title={title} {...rest} />;
      case 'timeline':
        return <TimelineChart key={index} title={title} {...rest} />;
      default:
        return null;
    }
  };

  return (
    <VStack spacing={10} mt={10}>
      {chartData.map((chart, idx) => (
        <Box key={idx} w="100%">
          {renderChart(chart, idx)}
        </Box>
      ))}
    </VStack>
  );
};

export default ChartContainer;
