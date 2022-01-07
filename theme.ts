import {
  extendTheme,
  ThemeConfig,
  theme as base,
  withDefaultColorScheme,
  withDefaultSize,
  withDefaultProps,
} from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

// .color-primary-0 { color: #003BC4 }
// .color-primary-1 { color: #04153B }
// .color-primary-2 { color: #6793F7 }
// .color-primary-3 { color: #000206 }
// .color-primary-4 { color: #FBFBFB }

const Button = {
  baseStyle: {
    ringColor: "brand.100",
    // borderWidth: "1px",
    // boxShadow:
    //   "inset 0 0 0 1px rgb(255 255 255 / 5%), inset 0 1px 0 0 rgb(255 255 255 / 45%), inset 0 -1px 0 0 rgb(255 255 255 / 15%), 0 1px 0 0 rgb(255 255 255 / 15%)",
  },
};

export const theme = extendTheme(
  {
    config,
    styles: {
      global: {
        html: {
          width: "100%",
        },
        body: {
          height: "100vh",
          width: "100%",
          margin: 0,
          padding: 0,
        },
      },
    },
    colors: {
      "gray.light": "#f7f7f7",
      "gray.dark": "#000206",
      brand: {
        // 25: "aliceblue",
        // 50: "rgb(194, 225, 255)",
        // 100: "#70BCFF",
        // 300: "#47A9FF",
        // 500: "#1F96FF",
        // 700: "#0083F5",
        // 900: "#006DCC",
        25: "#82d5a5",
        50: "#ccff33",
        100: "#9ef01a",
        300: "#70e000",
        500: "#38b000",
        700: "#008000",
        800: "#007200",
        900: "#006400",
      },
    },
    fonts: {
      heading: `Inter, ${base.fonts?.heading}`,
      body: `Inter, ${base.fonts?.body}`,
    },
    fontSizes: {},
    components: {
      Button,
    },
  },
  withDefaultColorScheme({
    colorScheme: "brand",
    components: ["Checkbox", "Button", "Tabs", "Input", "Select"],
  }),
  withDefaultProps({
    defaultProps: {
      fontSize: "sm",
    },
  }),
  withDefaultSize({
    size: "sm",
    components: [
      "Checkbox",
      "Input",
      "InputGroup",
      "Tabs",
      "Text",
      "FormLabel",
      "FormHelperText",
      "FormErrorMessage",
    ],
  })
);
