import './App.css';
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from './pages/Home/Home';
import Editor from './pages/Editor/Editor';
import { Toaster } from 'react-hot-toast';
function App() {
  return (
   <div className="app">
   <Toaster 
   position='top-right'
   toastOptions={{
    success:{
      theme:{
        primary:"#4ae088"
      }
    }
   }}></Toaster>
<BrowserRouter>
  <Routes>
    <Route path="/" exact element={<Home/>}/>
    <Route path="/editor/:roomId" element={<Editor/>}/>
    
  </Routes>
</BrowserRouter>
   </div>
  );
}

export default App;
