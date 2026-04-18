import Navbar      from './components/shared/Navbar.jsx';
import Sidebar      from './components/shared/Sidebar.jsx';
import ResourcesPage from './pages/ResourcesPage.jsx';

export default function App() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      <Navbar user={{ name: 'Super Admin', email: 'admin@quanti.dz', initials: 'SA' }} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePath="/resources" />
        
        <ResourcesPage />
      </div>
    </div>
  );
}