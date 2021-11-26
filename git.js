const core = require('@actions/core');
const exec = require('@actions/exec');
const github = require('@actions/github');

async function findBranch(commitID) {
  core.info(`Finding branch with commit${commitID}`);
  await exec.exec('git', ['fetch']);

  if (commitID) {
    let output = '';
    let error = '';

    const options = {};
    options.listeners = {
      stdout: (data) => {
        output += data.toString();
      },
      stderr: (data) => {
        error += data.toString();
      }
    };

    await exec.exec('git', ['branch', '--all', '--contains', commitID], options);

    if (error) {
      throw new Error(error);
    }

    core.info(`git branches: ${output}`);
    console.log(`git branches: ${output}`);

    const branches = output.trim().split('\n');
    const branch = branches.find(branch => branch.startsWith('*')) || branches[0];
    const branchName = branch.replace('remotes/origin/', '').split(' ').pop().trim();

    return branchName;
  } else {
    return github.context.ref.substring(11);
  }
}

module.exports = { findBranch };
