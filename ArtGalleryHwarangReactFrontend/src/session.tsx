let loginaccounts = [];

// List of login users
function GetLoginUsers() {
    return JSON.parse(localStorage.getItem('loginaccounts') || '[]');
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
    const updated = existing.filter(user => user !== logoutuser);
    localStorage.setItem('loginaccounts', JSON.stringify(updated));
}

export default {
    GetLoginUsers, 
    UserLogin, 
    UserLogout
};