const URL = "https://renzcph.dk/security/";

function handleHttpErrors(res) {
    if (!res.ok) {
        return Promise.reject({ status: res.status, fullError: res.json() })
    }
    return res.json();
}

function apiFacade() {
    /* Insert utility-methods from a latter step (d) here (REMEMBER to uncomment in the returned object when you do)*/

    const setToken = (token) => {
        localStorage.setItem('jwtToken', token)
    }
    const getToken = () => {
        return localStorage.getItem('jwtToken')
    }
    const loggedIn = () => {
        const loggedIn = getToken() != null;
        return loggedIn;
    }
    const logout = () => {
        localStorage.removeItem("jwtToken");
    }

    const getRole = () => {
        let jwt = localStorage.getItem("jwtToken");
        let jwtdata = jwt.split(".")[1];
        let decodedJwtJsonData = window.atob(jwtdata);
        let decodedJwtData = JSON.parse(decodedJwtJsonData);
        //console.log(decodedJwtData);
        return decodedJwtData.roles;
    }

    const getInfo = () => {
        let jwt = localStorage.getItem("jwtToken");
        let jwtdata = jwt.split(".")[1];
        let decodedJwtJsonData = window.atob(jwtdata);
        let decodedJwtData = JSON.parse(decodedJwtJsonData);
        //console.log(decodedJwtData);
        return decodedJwtData;
    }

    const login = (user, password) => {
        const options = makeOptions("POST", true, { username: user, password: password });
        return fetch(URL + "/api/login", options)
            .then(handleHttpErrors)
            .then(res => { setToken(res.token) })
    }

    const fetchData = () => {
        const options = makeOptions("GET", true); //True add's the token
        if (getRole() === "admin") {
            return fetch(URL + "/api/info/admin", options).then(handleHttpErrors);
        }
        return fetch(URL + "/api/info/user", options).then(handleHttpErrors);
    }
    const makeOptions = (method, addToken, body) => {
        var opts = {
            method: method,
            headers: {
                "Content-type": "application/json",
                'Accept': 'application/json',
            }
        }
        if (addToken && loggedIn()) {
            opts.headers["x-access-token"] = getToken();
        }
        if (body) {
            opts.body = JSON.stringify(body);
        }
        return opts;
    }
    return {
        // Remember all statements below are a shortcut for this version:
        makeOptions,
        setToken,
        getToken,
        loggedIn,
        login,
        logout,
        fetchData,
        getRole, 
        getInfo
    }
}
const facade = apiFacade();
export default facade;