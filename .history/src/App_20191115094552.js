import React, { useState, useEffect } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { NavLink, Switch, Route } from "react-router-dom"
import facade from "./apiFacade";


function Home() {
  const [dataFromServer, setDataFromServer] = useState("Loading...")

  useEffect(() => {
    facade.fetchData().then(data => setDataFromServer(data.msg));
  }, [])
  return (
    < div >
      <h1>Home</h1>
      <h2>Data Received from server</h2>
      <h3>{dataFromServer}</h3>
    </div >
  )
}

const Admin = () => (
  <div>
    <h1>Admin</h1>
  </div>
)

const Products = () => (
  <div>
    <h1>People</h1>
  </div>
)

const ReadMe = () => (
  <div>
    <h1>README</h1>
  </div>
)

const Company = () => (
  <div>
    <h1>Company</h1>
  </div>
)

const NoMatch = () => (
  <div>
    <h1>Page not found</h1>
  </div>
)

const Logout = ({logout}) => {
  return(
  <div>
    <h1>Logout</h1>
    <button onClick={logout}>Logout</button>
  </div>

  )
}
const Header = (props) => {
  if (facade.getRole() === "admin") {
    return (
      <ul className="header">
        <li>
          <NavLink activeclassname="active" to="/Home">Home</NavLink>
        </li>
        <li>
          <NavLink activeclassname="active" to="/Products">People</NavLink>
        </li>
        <li>
          <NavLink activeclassname="active" to="/Company">Company</NavLink>
        </li>
        <li>
          <NavLink activeclassname="active" to="/ReadMe">README</NavLink>
        </li>
        <li style={{float:"right"}}>
        <NavLink activeclassname="active" to="/Admin"></NavLink>
        </li>
        <li style={{float:"right"}}>
          <NavLink activeclassname="active" to="/Logout">Logout</NavLink>
        </li>
      </ul>
    );
  }
  return (
    <ul className="header">
      <li>
        <NavLink className="active" to="/Home">Home</NavLink>
      </li>
    </ul>
  )

}
const Content = props => {
  return (
    <Switch>
      <Route path="/Home">
        <Home />
      </Route>
      <Route path="/Products">
        <Products />
      </Route>
      <Route path="/Company">
        <Company />
      </Route>
      <Route path="/ReadMe">
        <ReadMe />
      </Route>
      <Route path="/Admin">
        <Admin />
      </Route>
      <Route path="/logout">
        <Logout logout={props.logout}/>
      </Route>
      <Route path="*">
        <NoMatch />
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
function LoggedIn({logout}) {

  return (
    <div className="App">
      <Router>
        <Header />
        <Content logout={logout}/>
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
        <Router>
          <LoggedIn logout={logout}/>
        </Router>
      }
    </div>
  )

}
export default App;
