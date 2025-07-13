import { Box, Avatar, Text, Badge, Button } from '@chakra-ui/react';
import { FaGithub, FaGit, FaUserFriends } from 'react-icons/fa';

const User = ({ user }) => {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <Box display="flex" alignItems="center" mb={4}>
        <Avatar size="xl" name={user.username} src={user.avatar_url} />
        <Box ml={4}>
          <Text fontSize="2xl" fontWeight="bold">
            {user.username}
          </Text>
          <Text color="gray.600">
            {user.email}
          </Text>
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box display="flex" alignItems="center">
          <Badge mr={2}>
            <FaGit /> Repositories: {user.repos_count}
          </Badge>
          <Badge>
            <FaUserFriends /> Followers: {user.followers_count}
          </Badge>
        </Box>
        <Button leftIcon={<FaGithub />}>
          View on GitHub
        </Button>
      </Box>

      <Text mb={4}>{user.bio}</Text>

      <Box display="flex" flexWrap="wrap" gap={2}>
        {user.skills?.map((skill, index) => (
          <Badge key={index} variant="solid" colorScheme="blue">
            {skill}
          </Badge>
        ))}
      </Box>
    </Box>
  );
};

export default User;
