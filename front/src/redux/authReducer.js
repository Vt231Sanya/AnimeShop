const initialState = {
    isAuthenticated: false,
    userId: null,
};

function authReducer(state = initialState, action) {
    switch (action.type) {
        case "LOGIN":
            return {
                isAuthenticated: true,
                userId: action.payload.userId,
            };
        case "LOGOUT":
            return {
                isAuthenticated: false,
                userId: null,
            };
        default:
            return state;
    }
}

export default authReducer;
