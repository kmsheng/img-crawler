const level = 'production' === process.env.NODE_ENV ? 'info' : 'trace';
const log = require('console-log-level')({level});

export default log;
