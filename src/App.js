import { ToastContainer } from "react-toastify"
import './App.css'
import 'react-toastify/dist/ReactToastify.min.css'


import Home from './components/home';
function App() {
  return (
    <>
      <Home />
      <ToastContainer />
    </>
  );
}

export default App;
