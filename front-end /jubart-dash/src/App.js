import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './layout/navbar/Navbar';
import Layout from './layout/Layout';
import Pages from './pages/Pages';

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible((prevState) => !prevState);
  };

  return (
    <Router>
      <div className="App">
        <Navbar toggleSidebar={toggleSidebar} isSidebarVisible={isSidebarVisible} />
        <Layout isSidebarVisible={isSidebarVisible}>
          <Pages />
        </Layout>
      </div>
    </Router>
  );
}

export default App;
