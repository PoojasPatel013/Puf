import React, { useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Icon,
  Link,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiFolder, FiFile, FiChevronRight } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

export default function FileExplorer({ files, owner, repo, currentPath = '' }) {
  const [path, setPath] = useState(currentPath);
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const getCurrentFiles = () => {
    return files.filter(file => {
      const filePath = file.path.substring(0, file.path.lastIndexOf('/') || 0);
      return filePath === path;
    });
  };

  const navigateToPath = (newPath) => {
    setPath(newPath);
  };

  const getBreadcrumbs = () => {
    const parts = path.split('/').filter(Boolean);
    return [
      { name: repo, path: '' },
      ...parts.map((part, index) => ({
        name: part,
        path: parts.slice(0, index + 1).join('/'),
      })),
    ];
  };

  return (
    <Box>
      <Breadcrumb
        spacing="8px"
        separator={<Icon as={FiChevronRight} color="gray.500" />}
        mb={4}
      >
        {getBreadcrumbs().map((item, index) => (
          <BreadcrumbItem key={item.path}>
            <BreadcrumbLink
              as={RouterLink}
              to="#"
              onClick={() => navigateToPath(item.path)}
            >
              {item.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>

      <Table variant="simple" border="1px" borderColor={borderColor}>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Last commit</Th>
            <Th>Last updated</Th>
          </Tr>
        </Thead>
        <Tbody>
          {path && (
            <Tr>
              <Td>
                <Link
                  onClick={() => {
                    const newPath = path.substring(0, path.lastIndexOf('/'));
                    navigateToPath(newPath);
                  }}
                >
                  <Icon as={FiFolder} mr={2} color="yellow.400" />
                  ..
                </Link>
              </Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          )}
          {getCurrentFiles().map((file) => (
            <Tr key={file.path}>
              <Td>
                <Link
                  onClick={() => {
                    if (file.type === 'dir') {
                      navigateToPath(file.path);
                    }
                  }}
                >
                  <Icon
                    as={file.type === 'dir' ? FiFolder : FiFile}
                    mr={2}
                    color={file.type === 'dir' ? 'yellow.400' : 'gray.400'}
                  />
                  {file.name}
                </Link>
              </Td>
              <Td>{file.lastCommit?.message || '-'}</Td>
              <Td>{new Date(file.lastUpdated).toLocaleDateString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
