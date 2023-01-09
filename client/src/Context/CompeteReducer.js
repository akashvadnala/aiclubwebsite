const Reducer = (state, action) => {
    switch(action.type){
        case "LOGGED_IN":
            const { cuser } = action.payload;
            return {
                cuser: cuser
            }
        case "LOGOUT":
            return{
                cuser: null
            }
        default:
            return state;
    }
};

export default Reducer;