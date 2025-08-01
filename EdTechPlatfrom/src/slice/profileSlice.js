import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading:false,
    user:null,

};

const profileSlice= createSlice({
    name : "profile",
    initialState : initialState,
    reducers : {
        setUser(state,value) {
            state.user = value.payload ;
        },
        setLoading(state, value) {
            state.loading = value.payload;
        },
    },
});

export const {setUser,setLoading} = profileSlice.actions;
export default profileSlice.reducer;