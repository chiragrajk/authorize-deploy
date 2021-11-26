const core = require('@actions/core');
// const github = require('@actions/github');
// const exec = require('@actions/exec');
const git = require('./git')

async function authorized() {
  core.setOutput('authorized', true);
}

async function run() {
  core.info('Running...');
  try {
    const environment = core.getInput('environment', { required : false }) || 'staging';
    core.info(`Environment: ${environment}`);
    const commitID = core.getInput('commit-id', { required : true });
    core.info(`Commit ID: ${commitID}`);
    const currentBranch = await git.findBranch(commitID);
    console.log(`Current branch: ${currentBranch}`);
    core.info(`Current branch: ${currentBranch}`);

    const defaultBranch = core.getInput('default-branch', { required : true });
    core.info(`Default branch: ${defaultBranch}`);

    const githubToken = core.getInput('github-token', { required : true });
    core.info(`Github token: ${githubToken}`);
    // const [admins, writers] = await getCollaborators(githubToken);
    // core.info(`Admins: ${admins}`);
    // core.info(`Writers: ${writers}`);

    await authorized();

    // const actor = github.context.actor;

    // // if github.actor
    // if (environment === 'production') {
    //   if (defaultBranch !== currentBranch) {
    //     core.debug(`${currentBranch} cannot be deployed to production.`);
    //     throw new Error(`Only ${defaultBranch} branch can be deployed to production.`);
    //   }

    //   if (!admins.includes(actor)) {
    //     core.debug(`${actor} is not an admin user.`);
    //     throw new Error(`${actor} is not an admin user. Only admin user can deploy to production.`);
    //   }

    //   await authorized();
    // } else {
    //   if (!admins.includes(actor) && !writers.includes(actor)) {
    //     core.debug(`${actor} is not an admin or write user.`);
    //     throw new Error(`${actor} is not an admin or write user. Only admin or write user can deploy to production.`);
    //   }

    //   await authorized();
    // }
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
