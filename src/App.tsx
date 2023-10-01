// Libraries
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

// Types
import { Theme } from '@Features/theme/types/theme';
import { RootState } from '@Types/rootState.type';

// Components
import { TopBar } from '@Components/TopBar/TopBar';
import { BottomPanel } from '@Components/BottomPanel/BottomPanel';

// Pages
import { Login } from '@Pages/Login/Login';
import { Registration } from '@Pages/Registration/Registration';
import { Main } from '@Pages/Main/Main';

const App = () => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const [themeStyle, setThemeStyle] = useState('darkTheme');

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
        <div className={themeStyle}>
          <Routes>
            <Route
              path='/login'
              element={<Login />}
            />
            <Route
              path='/registration'
              element={<Registration />}
            />
            <Route
              path='/'
              element={
                <>
                  <TopBar/>
                  <Main/>
                  <BottomPanel/>
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
