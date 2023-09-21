
const config = {
    "port": 3000,
    "postgres": {
      "db": "example",
      "host": "localhost",
      "password": "root",
      "port": 5432,
      "user": "root"
    }
}

// We need a default export here. Otherwise the imported object might be undefined.
export default config;