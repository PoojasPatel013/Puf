import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    github: {
      50: '#f6f8fa',
      100: '#ebeef1',
      200: '#d0d7de',
      300: '#8b949e',
      400: '#6e7781',
      500: '#57606a',
      600: '#424a53',
      700: '#32383f',
      800: '#24292f',
      900: '#1b1f24',
    },
  },
  components: {
    Button: {
      variants: {
        github: {
          bg: 'github.50',
          border: '1px solid',
          borderColor: 'github.200',
          color: 'github.800',
          _hover: {
            bg: 'github.100',
          },
        },
        'github-primary': {
          bg: '#2da44e',
          color: 'white',
          _hover: {
            bg: '#2c974b',
          },
        },
      },
    },
    Link: {
      variants: {
        github: {
          color: '#0969da',
          _hover: {
            color: '#0969da',
            textDecoration: 'underline',
          },
        },
      },
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'light' ? 'github.50' : 'github.900',
        color: props.colorMode === 'light' ? 'github.800' : 'github.100',
      },
    }),
  },
});

export default theme;
