//========== FUNCIONES ==========
import React, { useContext, useEffect, useState } from "react";
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material/styles";
import RutasDinamicas from "./components/estructura/RutasDinamicas";
import { estilosDark, estilosLight } from "./utils/estilosMui";
import { UserProvider } from "./components/Providers/UserContext";
import { DispositivoProvider } from "./components/Providers/Dispositivo";
import { CalendarProvider } from "./components/Providers/CalendarContext";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { HomeContext } from "./components/Providers/HomeContext";
import { ExamProvider } from "./components/Providers/ExamContext";
import 'dayjs/locale/es';


function App() {
  const { mode } = useContext(HomeContext);
  const lightTheme = createTheme(estilosLight);
  const darkTheme = createTheme(estilosDark);
  const [theme, setTheme] = useState(lightTheme)

  useEffect(() => {
    if (mode === "dark") {
      setTheme(darkTheme);
      localStorage.setItem("mode", "dark");
    } else {
      setTheme(lightTheme);
      localStorage.setItem("mode", "light");
    }
  }, [mode]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CalendarProvider>
          <ExamProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <UserProvider>
                <DispositivoProvider>
                  <RutasDinamicas />
                </DispositivoProvider>
              </UserProvider>
            </LocalizationProvider>
          </ExamProvider>
        </CalendarProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
