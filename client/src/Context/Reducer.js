const Reducer = (state, action) => {
    switch(action.type){
        case "LOGGED_IN":
            const { user } = action.payload;
            return {
                user: user
            }
        case "LOGOUT":
            return{
                user: null
            }
        default:
            return state;
    }
};

export default Reducer;