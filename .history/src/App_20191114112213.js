import React, { useState, useEffect } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { NavLink, Switch, Route } from "react-router-dom"
import facade from "./apiFacade";

const Home = () => (
  <div>
    <h1>Home</h1>
  </div>
)

const Header = () => {
  if (facade.getRole() === "admin") {
    return (
      <ul className="header">
        <li>
          <NavLink className="active" to="/Home">Home</NavLink>
        </li>
      </ul>
    );
  };
}
const Content = props => {
  return (
    <Switch>
      <Route exact path="/Home" />
      <Home />
    </Switch>
  )
}


function LogIn({ login }) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);

  const performLogin = (evt) => {
    evt.preventDefault();
    login(loginCredentials.username, loginCredentials.password);
  }
  const onChange = (evt) => {
    setLoginCredentials({ ...loginCredentials, [evt.target.id]: evt.target.value })
  }

  return (
    <div>
      <h2>Login</h2>
      <form onChange={onChange} >
        <input placeholder="User Name" id="username" />
        <input placeholder="Password" id="password" />
        <button onClick={performLogin}>Login</button>
      </form>
    </div>
  )

}
function LoggedIn() {
  const [dataFromServer, setDataFromServer] = useState("Loading...")

  useEffect(() => {
    facade.fetchData().then(data => setDataFromServer(data.msg));
  },
    [])

  return (
    <div>
      <h2>Data Received from server</h2>
      <h3>{dataFromServer}</h3>
    </div>
  )

}

function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  const logout = () => {
    facade.logout()
    setLoggedIn(false)
  }
  const login = (user, pass) => {
    facade.login(user, pass)
      .then(res => setLoggedIn(true));
  }

  return (
    <div>
      <Router>
        {!loggedIn ? (<LogIn login={login} />) :
          (<div>
            <LoggedIn />
            <button onClick={logout}>Logout</button>
          </div>)}
        
    </div>
  )

}
export default App;
