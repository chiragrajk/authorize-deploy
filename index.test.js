const run = require('.');
const git = require('./git');
const core = require('@actions/core');

jest.mock('./git');
jest.mock('@actions/core');

describe('Authorize deploy', () => {

  beforeEach(() => {
    jest.clearAllMocks();

    core.getInput = jest
      .fn()
      .mockReturnValueOnce('staging')             // environment
      .mockReturnValueOnce('a-commit-id')         // commit-id
      .mockReturnValueOnce('main')                // main
      .mockReturnValueOnce('secret-token');       // github-token

    git.findBranch = jest
      .fn()
      .mockResolvedValueOnce('mock/main')              // main

  });

  test('should run', async () => {
    await run();
    expect(core.setFailed).toHaveBeenCalledTimes(0);
  });
});
