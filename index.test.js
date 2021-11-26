const run = require('.');
const core = require('@actions/core');
const git = require('./git');

jest.mock('./git');
jest.mock('@actions/core');

const mockOctokitRequest = jest.fn();
jest.mock('@actions/github', () => ({
  getOctokit: jest.fn(() => ({
    request: mockOctokitRequest
  })),
  context: {
    actor: 'actor-jest',
    ref: 'refs/heads/main',
    repo: {
      owner: 'suitepad',
      repo: 'test-repo'
    }
  }
})
);

describe('Authorize deploy', () => {

  beforeEach(() => {
    jest.clearAllMocks();

    core.getInput = jest
      .fn()
      .mockReturnValueOnce('staging')             // environment
      .mockReturnValueOnce('a-commit-id')         // commit-id
      .mockReturnValueOnce('main');               // main
      // .mockReturnValueOnce('secret-token')        // github-token
      // .mockReturnValueOnce('backend,devops');     // teams

    git.findBranch = jest
      .fn()
      .mockResolvedValueOnce('mock/main')         // main

    mockOctokitRequest.mockImplementation(() => {
      return Promise.resolve({
      data: [
        {
          // role_name: 'admin',
          login: 'actor-jest'
        }
      ]});
    });

  });

  test('should run', async () => {
    await run();
    expect(core.setFailed).toHaveBeenCalledTimes(0);
    expect(core.setOutput).toBeCalledWith('authorized', true);
  });
});
