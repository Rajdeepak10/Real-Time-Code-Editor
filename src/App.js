import {BrowserRouter,Routes,Route} from 'react-router-dom'
import "./App.css";
import EditorPage from './pages/EditorPage';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';
function App() {
  return (
    <>
    <div>
      <Toaster position='top-right'
      toastOptions={{
        success:{
          theme:{
            primary:" rgb(101, 101, 236);"
          }
        }
      }}>
      </Toaster> 
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home/>}>
            </Route>
            <Route path='/editor/:roomId' element={<EditorPage/>}></Route>
          </Routes>
    </BrowserRouter>

     
    </div>
    

    </>
  );
}

export default App;
