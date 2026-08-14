import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListingsPage from './components/ListingsPage';
import PropertyDetailPage from './components/PropertyDetailPage';
import NaturalSearchPage from './components/NaturalSearchPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<ListingsPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          <Route path="/search/natural" element={<NaturalSearchPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
