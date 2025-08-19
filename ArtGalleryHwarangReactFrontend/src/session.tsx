let loginaccounts = [];

//current user
let currentUser;

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
    console.log(loginaccounts);
    localStorage.setItem('loginaccounts', JSON.stringify([]));
}

// Function to add a user to the login accounts when they log in
function UserLogin(loginuser) {
    if (loginuser) {
        const existing = JSON.parse(localStorage.getItem('loginaccounts') || '[]');
        if (!existing.includes(loginuser)) {
            existing.push(loginuser);
            localStorage.setItem('loginaccounts', JSON.stringify(existing));
        }
    }
}

// Function to remove a user from the login accounts when they log out
function UserLogout(logoutuser) {
    const existing = JSON.parse(localStorage.getItem('loginaccounts') || '[]');
    console.log("Existing users before logout:", existing);
    console.log("User to logout:", logoutuser);

    const updated = existing.filter(user => user !== logoutuser);
    console.log("login sessions after logout: ", updated);
    
    if (existing.length === updated.length) {
        localStorage.setItem('loginaccounts', JSON.stringify(updated));
        console.warn("User not found for logout:", logoutuser);
    } else {
        console.log("User logged out successfully:", logoutuser);
    }

}

function GetCurrentLoginSession() {
    return currentUser;
}

function SwitchLoginSession(user) {
    currentUser = user;
}

export default {
    GetLoginUsers, 
    ResetLoginSessions, 
    GetCurrentLoginSession,
    SwitchLoginSession,
    UserLogin, 
    UserLogout
};