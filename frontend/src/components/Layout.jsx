// src/components/Layout.jsx
// Wraps all protected pages with the sidebar + main content area.

import Sidebar from './Sidebar';

function Layout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;
