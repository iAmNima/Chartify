import React from 'react';
import { Box, Button, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { CHART_TYPES } from '../constants/chartTypes';

const ChartTypeSelector = ({ selected, setSelected }) => {
  const toggleType = (type) => {
    setSelected((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type) // remove
        : [...prev, type]               // add
    );
  };

  return (
    <Box>
      <Text mb={2} fontSize="sm" fontWeight="medium" color="gray.600">
        Select chart types to generate
      </Text>
      <Wrap spacing={3}>
        {CHART_TYPES.map((type) => (
          <WrapItem key={type}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toggleType(type)}
              backgroundColor={selected.includes(type) ? 'teal.100' : 'white'}
              borderColor={selected.includes(type) ? 'teal.500' : 'gray.300'}
              _hover={{
                backgroundColor: selected.includes(type) ? 'teal.200' : 'gray.100',
              }}
            >
              {type}
            </Button>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
};

export default ChartTypeSelector;
