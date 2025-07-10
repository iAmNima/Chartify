import React, { useState, useEffect } from 'react';
import {
  Box,
  Input,
  Button,
  Heading,
  VStack,
  useToast,
  Text,
  Spinner,
  Flex,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';

import ChartTypeSelector from './components/ChartTypeSelector';
import ChartContainer from './components/ChartContainer';
import generateChartData from './api/generateChartData';
import suggestChartTypes from './api/suggestChartTypes';

const App = () => {
  const [topic, setTopic] = useState('');
  const [chartTypes, setChartTypes] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [suggestedTypes, setSuggestedTypes] = useState([]);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Debounced suggestion call
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (topic.trim().length > 3) {
        setSuggestionLoading(true);
        suggestChartTypes(topic)
          .then(setSuggestedTypes)
          .catch(() => setSuggestedTypes([]))
          .finally(() => setSuggestionLoading(false));
      } else {
        setSuggestedTypes([]);
      }
    }, 600);
    return () => clearTimeout(timeout);
  }, [topic]);

  const handleGenerate = async () => {
    if (!topic.trim() || chartTypes.length === 0) {
      toast({
        title: 'Please enter a topic and select at least one chart type.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const result = await generateChartData(topic, chartTypes);
      setChartData(result);
    } catch (err) {
      toast({
        title: 'Failed to generate charts.',
        description: err.message || 'Something went wrong.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  return (
    <Box maxW="800px" mx="auto" py={10} px={4}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" textAlign="center">📊 Chartify</Heading>

        <Flex gap={3}>
          <Input
            placeholder="Enter a topic (e.g. population growth, climate change)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            flex="1"
          />
          <Button
            colorScheme="teal"
            onClick={handleGenerate}
            isLoading={loading}
            loadingText="Generating"
            whiteSpace="nowrap"
          >
            Generate Chart
          </Button>
        </Flex>

        {/* Suggested Charts Section */}
        {(suggestionLoading || suggestedTypes.length > 0) && (
          <Box>
            <Flex align="center" mb={2} gap={2}>
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                {suggestionLoading ? 'Searching for best charts…' : 'Suggested charts:'}
              </Text>
              {suggestionLoading && <Spinner size="xs" />}
            </Flex>

            {!suggestionLoading && (
              <Wrap spacing={3}>
                {suggestedTypes.map((type) => (
                  <WrapItem key={type}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setChartTypes((prev) =>
                          prev.includes(type)
                            ? prev.filter((t) => t !== type)
                            : [...prev, type]
                        )
                      }
                      backgroundColor={chartTypes.includes(type) ? 'teal.100' : 'white'}
                      borderColor={chartTypes.includes(type) ? 'teal.500' : 'gray.300'}
                      _hover={{
                        backgroundColor: chartTypes.includes(type)
                          ? 'teal.200'
                          : 'gray.100',
                      }}
                    >
                      {type}
                    </Button>
                  </WrapItem>
                ))}
              </Wrap>
            )}
          </Box>
        )}

        <ChartTypeSelector selected={chartTypes} setSelected={setChartTypes} />

        {loading && (
          <Box textAlign="center">
            <Spinner size="lg" />
          </Box>
        )}

        {chartData.length > 0 && (
          <ChartContainer chartData={chartData} />
        )}
      </VStack>
    </Box>
  );
};

export default App;
