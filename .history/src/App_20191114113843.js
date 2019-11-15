import React, { useState, useEffect, dataFromServer } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { NavLink, Switch, Route } from "react-router-dom"
import facade from "./apiFacade";

const Home = () => (
  <div>
    <h1>Home</h1>
  </div>
)

const Products = () => (
  <div>
    <h1>People</h1>
  </div>
)
const Header = () => {
  if (facade.getRole() === "admin") {
    return (
      <ul className="header">
        <li>
          <NavLink className="active" to="/Home">Home</NavLink>
        </li>
        <li>
          <NavLink className="active" to="/Products">People</NavLink>
        </li>
        <li>
          <p>{dataFromServer}</p>
        </li>
      </ul>
    );
  }
  return facade.getRole() === "user";

}
const Content = props => {
  return (
    <Switch>
      <Route exact path="/Home" />
      <Home />
      <Route path="P/Products" />
      <Products />
      <Route>
        <LoggedIn />
      </Route>
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
    <div className="App">
      <Router>
        <Header />

        <h2>Data Received from server</h2>
        <h3>{dataFromServer}</h3>
      </Router>
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
      {!loggedIn ? (<LogIn login={login} />) :
        (<div>
          <LoggedIn />
          <button onClick={logout}>Logout</button>
        </div>)}

    </div>
  )

}
export default App;