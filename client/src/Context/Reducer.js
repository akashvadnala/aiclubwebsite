const Reducer = (state, action) => {
    switch(action.type){
        case "LOGGED_IN":
            const { user, logged_in } = action.payload;
            return {
                user: user,
                logged_in: logged_in
            }
        case "LOGOUT":
            return{
                user: null,
                logged_in: -1
            }
        default:
            return state;
    }
};

export default Reducer;