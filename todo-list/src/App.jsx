import { Routes, Route } from "react-router-dom";
import TokenLoginPage from "./TokenLoginPage"; // Make sure the path is correct
import TaskManagerApp from "./TaskManagerApp"; // Your main app component

function App() {
  return (
    <Routes>
      <Route path="/" element={<TaskManagerApp />} />
      
      {/* Login page without token */}
      <Route path="/login" element={<div>Login Page Placeholder</div>} />
      
      {/* Login with token from URL param */}
      <Route path="/login/:token" element={<TokenLoginPage />} />
      
      {/* Optional: catch all route */}
      <Route path="*" element={<div>404 Page Not Found</div>} />
    </Routes>
  );
}

export default App;
