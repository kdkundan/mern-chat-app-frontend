import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/theme";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Chat from "./views/chat";
import { SocketContext, socket } from "./socket/SocketContext";
import { Provider } from "react-redux";
import store from "./redux/store";

function App() {
  return (
    <>
      <Provider store={store} >
        <SocketContext.Provider value={socket}>
          <ChakraProvider theme={theme}>
            <BrowserRouter>
              <Routes>
                <Route path="/chat" element={<Chat />} />
                <Route path="/" element={<Navigate to="/chat" />} />
              </Routes>
            </BrowserRouter>
          </ChakraProvider>
        </SocketContext.Provider>
      </Provider>
    </>
  );
}

export default App;
