// import { reset } from "nodemon";

export const createAuthSlice = (set) => ({
    users: null,
    setUser: (updatedFields) =>
        set((state) => ({
            users: {
                ...state.users,
                ...updatedFields,
            },
        })),
    
        // resetUser: () =>
        // set((state) => ({
        //     users: null,
        // })),
})