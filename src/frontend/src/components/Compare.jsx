import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  Grid,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import {
  FiArrowUp,
  FiArrowDown,
  FiMinus,
  FiActivity,
  FiCpu,
  FiClock,
} from 'react-icons/fi';
import { modelService } from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function Compare() {
  const { owner, name } = useParams();
  const [versions, setVersions] = useState([]);
  const [baseVersion, setBaseVersion] = useState('');
  const [compareVersion, setCompareVersion] = useState('');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchVersions = async () => {
      const data = await modelService.getModelVersions(owner, name);
      setVersions(data);
      if (data.length >= 2) {
        setBaseVersion(data[1].id); // Second latest
        setCompareVersion(data[0].id); // Latest
      }
    };
    fetchVersions();
  }, [owner, name]);

  const handleCompare = async () => {
    setLoading(true);
    try {
      const data = await modelService.compareVersions(
        owner,
        name,
        baseVersion,
        compareVersion
      );
      setComparison(data);
    } catch (error) {
      console.error('Error comparing versions:', error);
    }
    setLoading(false);
  };

  const getChangeIndicator = (change) => {
    if (change > 0) {
      return <Icon as={FiArrowUp} color="green.500" />;
    } else if (change < 0) {
      return <Icon as={FiArrowDown} color="red.500" />;
    }
    return <Icon as={FiMinus} color="gray.500" />;
  };

  const MetricCard = ({ title, value, change, icon }) => (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
    >
      <Flex justify="space-between" mb={2}>
        <Text color="gray.500">{title}</Text>
        <Icon as={icon} />
      </Flex>
      <Heading size="md">{value}</Heading>
      {change != null && (
        <Flex align="center" mt={2}>
          {getChangeIndicator(change)}
          <Text
            ml={1}
            color={change > 0 ? 'green.500' : change < 0 ? 'red.500' : 'gray.500'}
          >
            {Math.abs(change)}%
          </Text>
        </Flex>
      )}
    </Box>
  );

  return (
    <Box p={4}>
      <Heading size="lg" mb={6}>
        Compare Versions
      </Heading>

      <Flex gap={4} mb={6}>
        <Select
          value={baseVersion}
          onChange={(e) => setBaseVersion(e.target.value)}
          w="200px"
        >
          {versions.map((version) => (
            <option key={version.id} value={version.id}>
              {version.tag}
            </option>
          ))}
        </Select>
        <Select
          value={compareVersion}
          onChange={(e) => setCompareVersion(e.target.value)}
          w="200px"
        >
          {versions.map((version) => (
            <option key={version.id} value={version.id}>
              {version.tag}
            </option>
          ))}
        </Select>
        <Button
          colorScheme="blue"
          onClick={handleCompare}
          isLoading={loading}
        >
          Compare
        </Button>
      </Flex>

      {comparison && (
        <>
          <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={6}>
            <MetricCard
              title="Accuracy"
              value={`${comparison.accuracy.new}%`}
              change={comparison.accuracy.change}
              icon={FiActivity}
            />
            <MetricCard
              title="Inference Time"
              value={`${comparison.inference_time.new}ms`}
              change={-comparison.inference_time.change}
              icon={FiClock}
            />
            <MetricCard
              title="Model Size"
              value={`${comparison.size.new}MB`}
              change={comparison.size.change}
              icon={FiCpu}
            />
          </Grid>

          <Box
            bg={bgColor}
            p={6}
            borderRadius="lg"
            border="1px"
            borderColor={borderColor}
            mb={6}
          >
            <Heading size="md" mb={4}>
              Performance Comparison
            </Heading>
            <Box height="400px">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparison.performance_data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="base"
                    stroke="#8884d8"
                    name="Base Version"
                  />
                  <Line
                    type="monotone"
                    dataKey="compare"
                    stroke="#82ca9d"
                    name="Compare Version"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          <Box
            bg={bgColor}
            borderRadius="lg"
            border="1px"
            borderColor={borderColor}
          >
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Metric</Th>
                  <Th>Base Version</Th>
                  <Th>Compare Version</Th>
                  <Th>Change</Th>
                </Tr>
              </Thead>
              <Tbody>
                {comparison.metrics.map((metric) => (
                  <Tr key={metric.name}>
                    <Td>{metric.name}</Td>
                    <Td>{metric.base_value}</Td>
                    <Td>{metric.compare_value}</Td>
                    <Td>
                      <Flex align="center">
                        {getChangeIndicator(metric.change)}
                        <Text ml={2}>{Math.abs(metric.change)}%</Text>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </>
      )}
    </Box>
  );
}
