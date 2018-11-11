'use strict';

module.exports = outdent => ({
  '--bail': {
    description: 'Exit immediatly when first test fail.',
    default: false,
    validator: types => types.BOOL,
  },
  '--colors': {
    description:
      'Forces test results output highlighting even if stdout is not a TTY.',
    default: false,
    validator: types => types.BOOL,
  },
  '--ci': {
    description: outdent`
      When this option is provided, Jest will assume it is running in a CI environment.

      This changes the behavior when a new snapshot is encountered.
      
      Instead of the regular behavior of storing a new snapshot automatically, it will fail the test and require Jest to be run with --updateSnapshot.
    `,
    default: false,
    validator: types => types.BOOL,
  },
  '--clearCache': {
    description:
      'Deletes the Jest cache directory and then exits without running tests.',
    default: false,
    validator: types => types.BOOL,
  },
  '--coverage': {
    description:
      'Indicates that test coverage information should be collected and reported in the output.',
    default: false,
    validator: types => types.BOOL,
  },
  '--runInBand': {
    description:
      'Run all tests serially in the current process, rather than creating a worker pool of child processes that run tests, useful for debugging.',
    default: false,
    validator: types => types.BOOL,
  },
  '--updateSnapshot': {
    description:
      'Use this flag to re-record every snapshot that fails during this test run.',
    default: false,
    validator: types => types.BOOL,
  },
  '--watch': {
    description: outdent`
      Watch files for changes and rerun tests related to changed files.
      
      If you want to re-run all tests when a file has changed, use the --watchAll option instead.
    `,
    default: false,
    validator: types => types.BOOL,
  },
  '--watchAll': {
    description: outdent`
      Watch files for changes and rerun all tests when something changes.
      
      If you want to re-run only the tests that depend on the changed files, use the --watch option.
    `,
    default: false,
    validator: types => types.BOOL,
  },
});
