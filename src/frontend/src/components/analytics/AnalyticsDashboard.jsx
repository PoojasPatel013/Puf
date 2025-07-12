import React from 'react';
import { Card, CardContent, Typography, Grid, Box, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTheme } from '@mui/material/styles';

const AnalyticsDashboard = ({ modelData }) => {
    const theme = useTheme();

    const getModelPerformance = () => {
        return modelData.versions.map(version => ({
            version: version.version,
            accuracy: version.metrics?.accuracy || 0,
            loss: version.metrics?.loss || 0,
            date: new Date(version.timestamp).toLocaleDateString()
        }));
    };

    const performanceData = getModelPerformance();

    return (
        <Grid container spacing={3}>
            {/* Metrics Overview */}
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Model Overview
                        </Typography>
                        <Typography variant="h4" color="primary">
                            {modelData.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {modelData.description}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Latest Version */}
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Latest Version
                        </Typography>
                        <Typography variant="h5" color="primary">
                            v{modelData.versions[0]?.version}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {new Date(modelData.versions[0]?.timestamp).toLocaleDateString()}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Performance Chart */}
            <Grid item xs={12} md={4}>
                <Paper elevation={3}>
                    <Box p={2}>
                        <Typography variant="h6" gutterBottom>
                            Performance Trend
                        </Typography>
                        <LineChart
                            width={500}
                            height={200}
                            data={performanceData}
                            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="accuracy"
                                stroke={theme.palette.primary.main}
                                name="Accuracy"
                            />
                            <Line
                                type="monotone"
                                dataKey="loss"
                                stroke={theme.palette.error.main}
                                name="Loss"
                            />
                        </LineChart>
                    </Box>
                </Paper>
            </Grid>

            {/* Version Comparison */}
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Version Comparison
                        </Typography>
                        <Grid container spacing={2}>
                            {performanceData.map((version, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <Paper elevation={1}>
                                        <Box p={2}>
                                            <Typography variant="subtitle1">
                                                Version {version.version}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Date: {version.date}
                                            </Typography>
                                            <Typography variant="body2">
                                                Accuracy: {version.accuracy.toFixed(2)}%
                                            </Typography>
                                            <Typography variant="body2">
                                                Loss: {version.loss.toFixed(4)}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default AnalyticsDashboard;
