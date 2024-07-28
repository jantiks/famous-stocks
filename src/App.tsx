import React from 'react';
import './App.css';
import SenateListing from './comp/SenateListing';
import Hero  from './comp/Hero';
import { ThemeProvider } from "./@/components/ui/theme-provider"
import { Toaster } from './@/components/ui/toaster';

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
            <Toaster />
      </ThemeProvider>
    </div>
  );
}

export default App;