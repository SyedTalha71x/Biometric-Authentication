import './App.css';
import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ProtectedPage from './Components/ProtectedPage/ProtectedPage';
import PublicPage from './Components/PublicPage/PublicPage';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import * as onz from 'onz-auth';


const auth = new onz.Auth({
  clientID: 'tutorial-6324fdcbcb', //Replace with your client id
  containerID: 'myLoginDiv',
  isIframe: false,
});

function App() {

  const [user, setUser] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(auth.isAuthenticated());
  const navigate = useNavigate();
  const handleLogin = () => {
    setIsLoggingIn(true);
    auth.showLogin();
  };
  const handleLogout = () => auth.logout();
  const handleCancelLogin = () => auth.close();

  function updateUserTokens() {
    const accessToken = auth.getAccessToken();
    const accessTokenJwt = auth.getDecodedAccessToken();
    const idTokenJwt = auth.getDecodedIDToken();
    setUser({
      accessToken: accessToken,
      accessTokenJwt: accessTokenJwt,
      idTokenJwt: idTokenJwt
    });
  }

  useEffect(() => {
    if (isLoggedIn) {
      updateUserTokens();
      navigate('/protected');
    }
  }, [isLoggedIn, navigate]);

  auth.on("closed", () => {
    setIsLoggingIn(false);
  });

  auth.on("authenticated", result => {
    setIsLoggedIn(true);
    updateUserTokens();
  });

  auth.on("logged_out", () => {
    setIsLoggedIn(false);
    setUser(null);
  });

  auth.on("error", error => {
    alert(error);
  });
  return (
    <div className="wrapper">
      <h1>Application</h1>
      <button onClick={() => {
        if (isLoggingIn) {
          handleCancelLogin();
          return;
        }
        if (isLoggedIn) {
          handleLogout();
        } else {
          handleLogin();
        }
      }}>
        {isLoggingIn ? 'Cancel Log in' : (isLoggedIn ? 'Log out' : 'Log in')}
      </button>
      <div id="myLoginDiv"></div>
      <Routes>
        <Route path="/protected" element={
          <ProtectedRoute user={user}>
            <ProtectedPage user={user} />
          </ProtectedRoute>} />
        <Route index element={
          <PublicPage />
        } />
      </Routes>
    </div>
  );
}

export default App;
