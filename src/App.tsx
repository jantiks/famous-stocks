import React from 'react';
import './App.css';
import { ThemeProvider } from "./@/components/ui/theme-provider"
import { Navbar } from './comp/Navbar';
import { Toaster } from './@/components/ui/toaster';
import { Home } from './comp/pages/Home';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
            <Toaster />
      </ThemeProvider>
    </div>
  );
}

export default App;