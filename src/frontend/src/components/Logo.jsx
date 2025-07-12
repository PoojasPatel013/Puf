import React from 'react';
import { Image, Box, Link as ChakraLink } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Logo = ({ size = "16" }) => {
  return (
    <RouterLink to="/" style={{ textDecoration: 'none' }}>
      <Box>
        <Image
          src="https://www.shutterstock.com/image-vector/cute-corgi-cartoon-vector-icon-600nw-2150920279.jpg"
          alt="Puf Logo"
          boxSize={`${size}px`}
          objectFit="contain"
          borderRadius="full"
          cursor="pointer"
          transition="transform 0.2s"
          _hover={{ transform: 'scale(1.1)' }}
        />
      </Box>
    </RouterLink>
  );
};

export default Logo;
