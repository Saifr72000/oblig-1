import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Users from "./pages/Users/Users";
import Tweets from "./pages/Tweets/Tweets";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Tweets />} />
        <Route path="/users" element={<Users />} />
        {/*   <Route path="/hotels/:id" element={<Hotel />} />
        <Route path="/login" element={<Login />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
