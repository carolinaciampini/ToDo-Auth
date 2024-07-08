import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/registerPage"
import { AuthProvider } from "./context/AuthContext"
import TasksPage from "./pages/TasksPage"
import TaskFormPage from "./pages/TaskFormPage"
import HomePage from "./pages/HomePage"
import ProfilePage from "./pages/ProfilePage"
import ProtectedRoute from "./ProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>

          <Route element={<ProtectedRoute />}> 
            <Route path="/tasks" element={<TasksPage />}></Route>
            <Route path="/add-task" element={<TaskFormPage />}></Route>
            <Route path="/tasks/:id" element={<TaskFormPage />}></Route>
            <Route path="/profile" element={<ProfilePage />}></Route>
          </Route>
          

        </Routes>
      </BrowserRouter>
    </AuthProvider>
    
 )
}

export default App
