export const setLoginDetails = (id, name, token) => {
    const loggedin_user = {
        id: id,
        name: name,
        token: token,
        expiryTime : new Date().getTime() + 30 * 60 * 1000
      } 
    window.localStorage.setItem("loggedin_user", JSON.stringify(loggedin_user));
};

export const getUserName = () => {
    return JSON.parse(window.localStorage.getItem('loggedin_user'))?.name || "";
};

export const getUserId = () => {
    return JSON.parse(window.localStorage.getItem('loggedin_user'))?.id || "";
};

export const logOutUser = () => {
    window.localStorage.removeItem("loggedin_user");
}

export const isLoggedIn = () => {
    return window.localStorage.getItem('loggedin_user');
}

export const getAuthToken = () => {
    return JSON.parse(window.localStorage.getItem('loggedin_user'))?.token || "";
};

export const getTokenExpiryTime = () => {
    return JSON.parse(window.localStorage.getItem('loggedin_user'))?.expiryTime;
};