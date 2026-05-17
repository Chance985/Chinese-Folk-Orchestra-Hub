import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import { apiRequest } from '../api/client.js';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/resources')
      .then((data) => setResources(data.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
      <SectionHeader
        title="External Resources"
        subtitle="This page declares AI assistance, local templates, frameworks, libraries, demo data, and generated placeholder assets used in the project."
      />
      <Alert severity="warning" sx={{ mb: 3 }}>
        Demo member data is placeholder content only and does not represent actual
        Chinese Folk Orchestra club members.
      </Alert>
      <Card>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          {loading ? (
            <LoadingState label="Loading resources" />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : resources.length ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Resource type</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>What was used</TableCell>
                    <TableCell>How modified</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resources.map((resource) => (
                    <TableRow key={resource.id} hover>
                      <TableCell>
                        <Typography sx={{ fontWeight: 800 }}>{resource.resource_type}</Typography>
                      </TableCell>
                      <TableCell>{resource.website_source}</TableCell>
                      <TableCell>{resource.what_was_used}</TableCell>
                      <TableCell>{resource.how_modified}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <EmptyState title="No resources recorded" message="Resource declarations will appear here." />
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
