import React from 'react';
import './App.css';
import SenateListing from './comp/Home';
import Hero  from './comp/Hero';
import { ThemeProvider } from "./@/components/ui/theme-provider"

function App() {
  return (
    <div className="App">
      <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange>
            <Hero />
            <SenateListing />
      </ThemeProvider>
    </div>
  );
}

export default App;