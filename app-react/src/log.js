const LEVELS = [`debug`, `info`, `warn`, `error`];

const log = {
    LEVEL: 1,
    debug: (...args) => logger(`debug`, ...args),
    info: (...args) => logger(`info`, ...args),
    warn: (...args) => logger(`warn`, ...args),
    error: (...args) => logger(`error`, ...args),
};
module.exports = log;

function logger(type, ...args) {
    const index = LEVELS.indexOf(type);
    if (index === -1) {
        throw new Error(`Invalid log type "${type}" received`);
    }
    if (log.LEVEL < index) {
        return;
    }
    console[type](...args);
}
