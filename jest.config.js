module.exports = {
  transform: {
    "^.+\\.jsx?$": `<rootDir>/jest-preprocess.js`,
  },
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": `identity-obj-proxy`,
    ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": `<rootDir>/__mocks__/file-mock.js`,
    "\.\.\/\.\.\/static\/conferences.yaml": `<rootDir>/__mocks__/conferences.js`,
  },
  testPathIgnorePatterns: [`node_modules`, `\\.cache`, `<rootDir>.*/public`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
  globals: {
    __PATH_PREFIX__: ``,
  },
//  testURL: `http://localhost`,
  setupFiles: [`<rootDir>/loadershim.js`],
  reporters: [
    'default',
    [
      'jest-qase-reporter',
      {
//        apiToken: '46aac0a5e10a1a33c9ddb0cc52ab36337bc558b3',
        projectCode: 'awesomecl',
//        runId: 45,
//        environmentId: 1,
        logging: true,
        runComplete: true,
      },
    ],
  ],
}
