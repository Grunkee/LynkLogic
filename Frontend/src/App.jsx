import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LoadTable from "./loadtable";
import Login from "./pages/Login.jsx"
import "./App.css";

function App() {
	return (
		<BrowserRouter>



			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/login" element={<Login />} />
				<Route path="/table" element={<LoadTable />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App;
