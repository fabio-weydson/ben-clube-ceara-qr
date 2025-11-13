import { useEffect } from "react";
import MemberValidation from "./components/MemberValidation";
import MembersList from "./components/MembersList";
import MemberDashboard from "./components/MemberDashboard";
import { Route, Routes, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/validacao") return;
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      console.log("Navegando para validação com token:", token);
      window.location.href = `/validacao?token=${token}`;
      return;
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MemberValidation />} />
        <Route path="/membros" element={<MembersList />} />
        <Route path="/painel" element={<MemberDashboard />} />
        <Route path="/validacao" element={<MemberValidation />} />
      </Routes>
    </div>
  );
}

export default App;
