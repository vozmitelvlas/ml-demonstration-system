import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        info: {}
    },
    reducers: {
        setUserInfo: (state, action) => {
            state.info = action.payload;
        }
    }
});

export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;
