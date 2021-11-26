const core = require('@actions/core');
const github = require('@actions/github');
const git = require('./git')

async function authorized() {
  core.setOutput('authorized', true);
}

async function getCollaborators(githubToken, teams) {
  core.info(`Getting collaborators...`);
  const octokit = github.getOctokit(githubToken);

  const team_slugs = teams.split(',');
  let users = [];

  for (let i in team_slugs) {
    const { data } = await octokit.request('GET /orgs/{org}/teams/{team_slug}/members', {
      org: github.context.repo.owner,
      team_slug: team_slugs[i].trim()
    });

    users = users.concat(data.map(user => user.login));    
  }

  return users;
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

    const teams = core.getInput('teams', { required : true });

    const users = await getCollaborators(githubToken, teams);
    core.info(`users: ${users}`);

    await authorized();

    const actor = github.context.actor;

    // // if github.actor
    if (environment === 'production') {
      if (defaultBranch !== currentBranch) {
        core.debug(`${currentBranch} cannot be deployed to production.`);
        throw new Error(`Only ${defaultBranch} branch can be deployed to production.`);
      }

      if (!users.includes(actor)) {
        core.debug(`${actor} is not given team.`);
        throw new Error(`${actor} is not given team. Only users in ${teams} can deploy to production.`);
      }

      await authorized();
    } else {
      if (!users.includes(actor)) {
        core.debug(`${actor} is not given team.`);
        throw new Error(`${actor} is not given team. Only users in ${teams} can deploy to production.`);
      }

      await authorized();
    }
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
