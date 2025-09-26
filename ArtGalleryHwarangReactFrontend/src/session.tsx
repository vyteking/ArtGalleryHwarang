let loginaccounts = [];

//current user
let currentUser;

// Function to get the index of the current user from localStorage
function getCurrentUserIndex() {
    return localStorage.getItem('currentUserIndex');
}

// Function to set the index of the current user in localStorage
function setCurrentUserIndex(userIndex) {
    localStorage.setItem('currentUserIndex', userIndex);
}

// List of login users
function GetLoginUsers() {
    const storedAccounts = localStorage.getItem('loginaccounts');
    
    // Check if storedAccounts is null or undefined
    if (storedAccounts === null || storedAccounts === undefined) {
        loginaccounts = [];
        return []; // Return an empty array if no accounts are found
    }

    try {
        return JSON.parse(storedAccounts); // Attempt to parse the JSON
    } catch (error) {
        console.error("Error parsing JSON from localStorage:", error);
        localStorage.setItem('loginaccounts', JSON.stringify([]));
        loginaccounts = [];
        return []; // Return an empty array in case of a parsing error
    }
}

function ResetLoginSessions() {
    localStorage.removeItem('loginaccounts');
    localStorage.removeItem('currentUserIndex');
    console.log(loginaccounts);
    localStorage.setItem('loginaccounts', JSON.stringify([]));
}

// Function to add a user to the login accounts when they log in
function UserLogin(loginuser) {
    if (loginuser && loginuser.user_index_1st) {
        const existing = GetLoginUsers();
        const isAlreadyLoggedIn = existing.some(user => user.user_index_1st === loginuser.user_index_1st);

        if (!isAlreadyLoggedIn) {
            existing.push(loginuser);
            localStorage.setItem('loginaccounts', JSON.stringify(existing));
            // If this is the first user to log in, make them the current user
            if (existing.length === 1) {
                setCurrentUserIndex(loginuser.user_index_1st);
            }
        }
        // Store the token
        if (loginuser.token) {
            localStorage.setItem(`token_${loginuser.user_index_1st}`, loginuser.token);
        }
    }
}

// Function to remove a user from the login accounts when they log out
function UserLogout(logoutuser) {
    const existing = GetLoginUsers();
    console.log("Existing users before logout:", existing);
    console.log("User to logout:", logoutuser);

    const updated = existing.filter(user => user.user_index_1st !== logoutuser.user_index_1st);
    console.log("login sessions after logout: ", updated);
    
    localStorage.setItem('loginaccounts', JSON.stringify(updated));
    localStorage.removeItem(`token_${logoutuser.user_index_1st}`);

    // If the logged-out user was the current user, clear the current user index
    if (getCurrentUserIndex() === logoutuser.user_index_1st) {
        localStorage.removeItem('currentUserIndex');
        // If there are other users logged in, make the first one the new current user
        if (updated.length > 0) {
            setCurrentUserIndex(updated[0].user_index_1st);
        }
    }
}

function GetCurrentLoginSession() {
    const currentUserIndex = getCurrentUserIndex();
    if (!currentUserIndex) {
        return null;
    }
    const accounts = GetLoginUsers();
    return accounts.find(user => user.user_index_1st === currentUserIndex) || null;
}

function getAuthToken() {
    const currentUser = GetCurrentLoginSession();
    if (!currentUser) {
        return null;
    }
    return localStorage.getItem(`token_${currentUser.user_index_1st}`);
}

function SwitchLoginSession(user) {
    if (user && user.user_index_1st) {
        setCurrentUserIndex(user.user_index_1st);
    }
}

export default {
    GetLoginUsers, 
    ResetLoginSessions, 
    GetCurrentLoginSession,
    SwitchLoginSession,
    UserLogin, 
    UserLogout,
    getAuthToken
};