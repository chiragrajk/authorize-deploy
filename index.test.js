const run = require('.');
const core = require('@actions/core');

jest.mock('@actions/core');
jest.mock('fs');

describe('Deploy to ECS', () => {
  test('should run', async () => {
    await run();
    expect(core.setFailed).toHaveBeenCalledTimes(0);
  });
});
