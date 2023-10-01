import store from 'src/redux/store';

function isLoggedIn(): boolean {
  return store.getState().user.currentUser.username !== '';
}

export { isLoggedIn };
