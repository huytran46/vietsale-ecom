import {
  extendTheme,
  ThemeConfig,
  theme as base,
  withDefaultColorScheme,
  withDefaultVariant,
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
      "gray.light": "#FBFBFB",
      "gray.dark": "#000206",
      brand: {
        100: "#70BCFF",
        300: "#47A9FF",
        500: "#1F96FF",
        700: "#0083F5",
        900: "#006DCC",
      },
    },
    fonts: {
      heading: `Inter, ${base.fonts?.heading}`,
      body: `Inter, ${base.fonts?.body}`,
    },
    fontSizes: {},
  },
  withDefaultColorScheme({
    colorScheme: "brand",
    components: ["Checkbox", "Button"],
  })
);
