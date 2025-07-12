import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  Badge,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';

export default function ModelList() {
  const [models, setModels] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await axios.get('http://localhost:8000/models/versions');
      setModels(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching models',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleStar = (model) => {
    // Implement star logic here
  };

  const handleUnstar = (model) => {
    // Implement unstar logic here
  };

  const handleUpload = (model) => {
    // Implement upload logic here
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" width="100%">
      <Heading size="md" mb={4}>Model Versions</Heading>
      <Grid container spacing={3}>
        {models.map((model) => (
          <Grid item xs={12} md={6} key={model.id}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  {/* Model Header */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      {model.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {model.description}
                    </Typography>
                  </Grid>

                  {/* Model Stats */}
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Badge badgeContent={model.stars} color="primary">
                          <StarBorderIcon />
                        </Badge>
                        <Typography variant="body2">
                          {model.stars} stars
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CodeIcon />
                        <Typography variant="body2">
                          {model.versions.length} versions
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Action Buttons */}
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" gap={1}>
                        <Tooltip title="View Analytics">
                          <IconButton onClick={() => window.location.href=`/model/${model.id}/analytics`}>
                            <AnalyticsIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={model.starred ? "Unstar" : "Star"}>
                          <IconButton onClick={() => model.starred ? handleUnstar(model) : handleStar(model)}>
                            {model.starred ? <StarIcon /> : <StarBorderIcon />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View on GitHub">
                          <IconButton href={model.githubUrl} target="_blank">
                            <GitHubIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpload(model)}
                      >
                        Upload New Version
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
