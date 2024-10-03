"use client";
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ApolloProvider } from "@apollo/client";
import client from "../../apolloClient";
import { SnackbarProvider } from "notistack";
import { ConfirmProvider } from "material-ui-confirm";


const materialTheme = materialExtendTheme({
  typography: {
    fontFamily: '"Jost", "Roboto", "Arial", sans-serif',
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider client={client}>
          <MaterialCssVarsProvider
            theme={{ [MATERIAL_THEME_ID]: materialTheme }}
          >
            <JoyCssVarsProvider>
              <CssBaseline enableColorScheme />
              <SnackbarProvider maxSnack={3}>
                <ConfirmProvider>{children}</ConfirmProvider>
              </SnackbarProvider>
            </JoyCssVarsProvider>
          </MaterialCssVarsProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
