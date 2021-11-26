const core = require('@actions/core');

async function run() {
  try {
    core.info('Hello world!');
    console.log('Hello world!');
  }
  catch (error) {
    console.log(error);
    core.setFailed(error.message);
    core.debug(error.stack);
  }
}

module.exports = run;

/* istanbul ignore next */
if (require.main === module) {
  run();
}
