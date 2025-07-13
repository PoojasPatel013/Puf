import React from 'react';
import { Image, Box } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Logo = ({ size = "24" }) => {
  return (
    <Box
      as={RouterLink}
      to="/"
      style={{ textDecoration: 'none' }}
      _hover={{ transform: 'scale(1.1)' }}
      transition="transform 0.2s"
    >
      <Image
        src="https://www.shutterstock.com/image-vector/cute-corgi-cartoon-vector-icon-600nw-2150920279.jpg"
        alt="Puf Logo"
        boxSize={`${size}px`}
        objectFit="contain"
        borderRadius="full"
      />
    </Box>
  );
};

export default Logo;
