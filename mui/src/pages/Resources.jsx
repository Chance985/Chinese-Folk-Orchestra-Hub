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
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Resources() {
  const { pick } = useLanguage();
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
        title={pick('External Resources', '外部资源')}
        subtitle={pick(
          'This page declares AI assistance, local templates, frameworks, libraries, demo data, and generated placeholder assets used in the project.',
          '本页声明项目使用的 AI 辅助、本地模板、框架、库、演示数据和生成的占位素材。',
        )}
      />
      <Alert severity="warning" sx={{ mb: 3 }}>
        {pick(
          'Demo member data is placeholder content only and does not represent actual Chinese Folk Orchestra club members.',
          '演示成员数据仅为占位内容，不代表实际民乐团成员。',
        )}
      </Alert>
      <Card>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          {loading ? (
            <LoadingState label={pick('Loading resources', '正在加载资源')} />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : resources.length ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{pick('Resource type', '资源类型')}</TableCell>
                    <TableCell>{pick('Source', '来源')}</TableCell>
                    <TableCell>{pick('What was used', '使用内容')}</TableCell>
                    <TableCell>{pick('How modified', '修改方式')}</TableCell>
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
            <EmptyState
              title={pick('No resources recorded', '暂无资源记录')}
              message={pick('Resource declarations will appear here.', '资源声明会显示在这里。')}
            />
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
