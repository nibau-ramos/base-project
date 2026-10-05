import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type UserStatus = 'active' | 'pending' | 'inactive'

export interface User {
  id: number
  name: string
  email: string
  role: string
  department: string
  status: UserStatus
  projects: number
  joined: string
}

const INITIAL_USERS: User[] = [
  { id: 1, name: 'Ana Ferreira',   email: 'ana@enso.com',      role: 'Design Lead',  department: 'Design',     status: 'active',   projects: 4, joined: '2023-01-15' },
  { id: 2, name: 'Bruno Costa',    email: 'bruno@enso.com',    role: 'Developer',    department: 'Tecnologia', status: 'active',   projects: 7, joined: '2022-08-01' },
  { id: 3, name: 'Catarina Silva', email: 'catarina@enso.com', role: 'Strategist',   department: 'Estratégia', status: 'pending',  projects: 2, joined: '2024-03-10' },
  { id: 4, name: 'David Nunes',    email: 'david@enso.com',    role: 'Developer',    department: 'Tecnologia', status: 'inactive', projects: 0, joined: '2021-11-05' },
  { id: 5, name: 'Eva Martins',    email: 'eva@enso.com',      role: 'Marketing',    department: 'Marketing',  status: 'active',   projects: 3, joined: '2023-07-20' },
]

interface UsersState {
  list: User[]
  nextId: number
}

const usersSlice = createSlice({
  name: 'users',
  initialState: { list: INITIAL_USERS, nextId: 6 } satisfies UsersState,
  reducers: {
    addUser(state, action: PayloadAction<Omit<User, 'id' | 'joined'>>) {
      state.list.push({
        ...action.payload,
        id: state.nextId++,
        joined: new Date().toISOString().slice(0, 10),
      })
    },
    updateUser(state, action: PayloadAction<User>) {
      const idx = state.list.findIndex((u) => u.id === action.payload.id)
      if (idx !== -1) state.list[idx] = action.payload
    },
    deleteUser(state, action: PayloadAction<number>) {
      state.list = state.list.filter((u) => u.id !== action.payload)
    },
  },
})

export const { addUser, updateUser, deleteUser } = usersSlice.actions
export default usersSlice.reducer
