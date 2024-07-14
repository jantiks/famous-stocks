import React from 'react';
import './App.css';
import Home from './comp/Home';
import { ThemeProvider } from "./@/components/ui/theme-provider"

function App() {
  return (
    <div className="App">
      <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Home />
          </ThemeProvider>
    </div>
  );
}

export default App;