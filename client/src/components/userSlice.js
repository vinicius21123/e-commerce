import {createSlice} from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name:'user',
    initialState:{
        user:null,
        searchTerm:''
    },
    reducers:{ 
        loginSlice:(state,action)=>{
            state.user = action.payload
        },
        logoutSlice:(state)=>{
            state.user=null
        },
        searchSlice:(state,action)=>{
            state.searchTerm = action.payload
        },
    },
});

export const {loginSlice,logoutSlice,searchSlice} = userSlice.actions;
export const selectUser=(state)=>state.user.user;
export const selectSearch=(state)=>state.user.searchTerm;


export default userSlice.reducer;