export const signUp = (info) =>(
  $.ajax({
    method: 'POST',
    url: '/api/users',
    data: {user:info}
  })
);

export const logIn = (info) => (
  $.ajax({
    method: 'POST',
    url: '/api/session',
    data: info
  })
);

export const logOut = () => (
  $.ajax({
    method: 'DELETE',
    url: '/api/session'
  })
);
