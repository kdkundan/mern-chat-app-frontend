import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/theme";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Chat from "./views/chat";
import { SocketProvider } from "./socket/SocketContext";
import { Provider } from "react-redux";
import store from "./redux/store";
import Login from "./views/auth/Login";
import { AuthContextProvider } from "./context/AuthContext";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <>
      <Provider store={store}>
        <AuthContextProvider>
          <SocketProvider>
            <ChakraProvider theme={theme}>
              <BrowserRouter>
                <Routes>
                  <Route
                    path="/chat"
                    element={
                      <ProtectedRoute>
                        <Chat />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
              </BrowserRouter>
            </ChakraProvider>
          </SocketProvider>
        </AuthContextProvider>
      </Provider>
    </>
  );
}

export default App;
