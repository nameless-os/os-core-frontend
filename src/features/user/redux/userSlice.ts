// Libraries
import { FetchState } from '@Interfaces/fetchState.interface';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

// Features
import { initSocket } from '@Features/websocket/websocket';

interface InitialState {
  currentUser: {
    username: string,
    name: string,
    photo: string,
    id: number,
  }
  login: FetchState,
  registration: FetchState,
  isUserLoading: boolean,
}

interface UsernameAndPassword {
  username: string;
  password: string;
}

interface UsernameAndPhoto {
  username: string;
  photo?: string;
}

const initialState: InitialState = {
  currentUser: {
    username: '',
    name: '',
    photo: '',
    id: -1,
  },
  login: {
    isLoading: false,
    error: '',
  },
  registration: {
    isLoading: false,
    error: '',
  },
  isUserLoading: false,
};

const logout = createAsyncThunk<void, void>('user/logout', async () => {
  await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`, {}, {
    timeout: 30000,
    withCredentials: true,
  });
});

const loginFetch = createAsyncThunk<unknown, UsernameAndPassword>('user/login',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        username: payload.username,
        password: payload.password,
      }, {
        timeout: 30000,
        withCredentials: true,
      });
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue(err);
    }
  });

const registration = createAsyncThunk<unknown, UsernameAndPassword>('user/registration',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        username: payload.username,
        password: payload.password,
      }, {
        timeout: 30000,
        withCredentials: true,
      });
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue(err);
    }
  });

const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/me`, {
    timeout: 30000,
    withCredentials: true,
  });
  return res.data;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, { payload }: PayloadAction<UsernameAndPhoto>) {
      state.currentUser.username = payload.username;
      state.currentUser.photo = payload.photo || '';
      state.isUserLoading = false;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, (state) => {
      state.currentUser.username = '';
      state.currentUser.photo = '';
      state.currentUser.name = '';
      localStorage.clear();
      document.location.reload();
    });
    builder.addCase(loginFetch.pending, (state) => {
      state.login.isLoading = true;
      state.login.error = '';
    });
    builder.addCase(loginFetch.fulfilled, (state) => {
      state.login.isLoading = false;
      window.history.pushState(null, '', '/');
      window.location.reload();
    });
    builder.addCase(loginFetch.rejected, (state, action) => {
      state.login.isLoading = false;
      try {
        state.login.error = (action.payload as AxiosError).response?.data.error || (action.payload as AxiosError).response?.data.message[0];
      } catch (error: unknown) {
        state.login.error = (action.payload as string);
      }
    });
    builder.addCase(registration.pending, (state) => {
      state.registration.isLoading = true;
      state.registration.error = '';
    });
    builder.addCase(registration.fulfilled, (state) => {
      state.registration.isLoading = false;
      window.history.pushState(null, '', '/');
      window.location.reload();
    });
    builder.addCase(registration.rejected, (state, action) => {
      state.registration.isLoading = false;
      try {
        state.registration.error = (action.payload as AxiosError).response?.data.error || (action.payload as AxiosError).response?.data.message[0];
      } catch (error: unknown) {
        state.registration.error = (action.payload as string);
      }
    });
    builder.addCase(fetchUser.fulfilled, (state, action: { payload: string }) => {
      state.currentUser.username = action.payload;
      initSocket();
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      console.log(action.error.message);
    });
  },
});

export default userSlice.reducer;
export const { login } = userSlice.actions;
export { logout, loginFetch, registration, fetchUser };
