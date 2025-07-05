import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

import { TopBar } from '@Components/TopBar/TopBar';
import { BottomPanel } from '@Components/BottomPanel/BottomPanel';
import { Login } from '@Pages/Login/Login';
import { Registration } from '@Pages/Registration/Registration';
import { Main } from '@Pages/Main/Main';
import { Theme } from '@Features/settings/enums';
import { useTypedSelector } from '@Hooks';

const App = () => {
  const theme = useTypedSelector((state) => state.settings.theme);
  const [themeStyle, setThemeStyle] = useState('darkTheme');
  const [height, setHeight] = useState(document.documentElement.clientHeight);

  useEffect(() => {
    switch (theme) {
      case Theme.Dark: {
        setThemeStyle('darkTheme');
        break;
      }
      case Theme.Light: {
        setThemeStyle('lightTheme');
        break;
      }
      case Theme.Blue: {
        setThemeStyle('blueTheme');
        break;
      }
      case Theme.Green: {
        setThemeStyle('greenTheme');
        break;
      }
      default: {
        setThemeStyle('darkTheme');
      }
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <AnimatePresence>
        <div className={themeStyle} style={{ height: height }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route
              path="/"
              element={
                <>
                  <TopBar />
                  <Main />
                  <BottomPanel />
                </>
              }
            />
          </Routes>
        </div>
      </AnimatePresence>
    </BrowserRouter>
  );
};

export default App;
