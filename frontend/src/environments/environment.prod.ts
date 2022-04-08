export const environment = {
  production: false,

  socketio: {
    uri: `wss://${window.location.host}`,
    options: {
      path: '/chat/api/socket.io'
    }
  },
  apiBaseUrl: `http://${window.location.host}/chat/api`
};
