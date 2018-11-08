export const config = {
  development: {
    config_id: "development",
    node_port: 3000,
    database: {
      name: "tweet-app-db",
      host: "ds125723.mlab.com",
      port: "25723",
      username: "admin",
      password: "password1"
    }
  },
  staging: {
    config_id: "staging",
    node_port: 8080,
    database: {
      name: "tweet-app-db",
      host: "ds125723.mlab.com",
      port: "25723",
      username: "admin",
      password: "password1"
    }
  },
  production: {
    config_id: "production",
    node_port: 8080,
    database: {
      name: "tweet-app-db",
      host: "ds125723.mlab.com",
      port: "25723",
      username: "admin",
      password: "password1"
    }
  }
};
