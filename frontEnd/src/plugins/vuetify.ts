import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import { createVuetify } from "vuetify";

export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#1e88e5",
          info: "#03c9d7",
          success: "#05b187",
          accent: "#fc4b6c",
          warning: "#fe970f",
          error: "#fc4b6c",
          secondary: "#0cb9c5",
        },
      },
    },
  },
});
