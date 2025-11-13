import { useEffect, useState } from "react";
import MemberValidation from "./components/MemberValidation";
import MembersList from "./components/MembersList";

function App() {
  const [view, setView] = useState<"validation" | "members">("members");

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setView("members");
      } else {
        setView("validation");
      }
    } catch (error) {
      setView("members");
    }
  }, []);

  return (
    <div className="App">
      {view === "members" ? <MembersList /> : <MemberValidation />}
    </div>
  );
}

export default App;
