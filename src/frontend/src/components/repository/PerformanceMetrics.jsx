import React from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

export default function PerformanceMetrics({ metrics }) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (!metrics) {
    return <Box>No metrics available</Box>;
  }

  const MetricCard = ({ title, value, change, helpText }) => (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
    >
      <Stat>
        <StatLabel>{title}</StatLabel>
        <StatNumber>{value}</StatNumber>
        {change && (
          <StatHelpText>
            <StatArrow
              type={change >= 0 ? 'increase' : 'decrease'}
            />
            {Math.abs(change)}%
          </StatHelpText>
        )}
        {helpText && <StatHelpText>{helpText}</StatHelpText>}
      </Stat>
    </Box>
  );

  return (
    <Box>
      <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={6}>
        <MetricCard
          title="Accuracy"
          value={`${metrics.accuracy.current}%`}
          change={metrics.accuracy.change}
          helpText="Last 7 days"
        />
        <MetricCard
          title="Inference Time"
          value={`${metrics.inference_time.current}ms`}
          change={-metrics.inference_time.change}
          helpText="Average per request"
        />
        <MetricCard
          title="Model Size"
          value={`${metrics.size.current}MB`}
          change={metrics.size.change}
          helpText="Compressed size"
        />
      </Grid>

      <Box
        p={6}
        bg={bgColor}
        borderRadius="lg"
        border="1px"
        borderColor={borderColor}
        mb={6}
      >
        <Heading size="md" mb={4}>
          Accuracy Over Time
        </Heading>
        <Box height="300px">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.accuracy_history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3182CE"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Box
        p={6}
        bg={bgColor}
        borderRadius="lg"
        border="1px"
        borderColor={borderColor}
      >
        <Heading size="md" mb={4}>
          Resource Usage
        </Heading>
        <Box height="300px">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.resource_usage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="cpu"
                stackId="1"
                stroke="#3182CE"
                fill="#3182CE"
              />
              <Area
                type="monotone"
                dataKey="memory"
                stackId="1"
                stroke="#48BB78"
                fill="#48BB78"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
}
