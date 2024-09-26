import './index.css';
import { Route, Routes } from 'react-router-dom';
import Feed from './pages/Feed';
import NewPost from './pages/NewPost';

function App() {

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/new-post" element={<NewPost />} />
      </Routes>
    </div>
  )
}

export default App