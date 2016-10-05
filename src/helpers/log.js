const level = 'production' === process.env.NODE_ENV ? 'error' : 'debug';
const log = require('console-log-level')({level});

export default log;
