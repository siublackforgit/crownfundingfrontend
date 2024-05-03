import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import './Style/Custom.css';
import { AppProvider } from './Reducer/AppContext.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
    <BrowserRouter>
    <Routes>
      <Route path="/*" element={<App />}/>
    </Routes>
    </BrowserRouter>
    </AppProvider>
  </React.StrictMode>,
)
