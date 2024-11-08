import { JestConfigWithTsJest } from 'ts-jest'

const config: JestConfigWithTsJest = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
  },
  moduleDirectories: ['node_modules',],
  setupFiles: [
    "fake-indexeddb/auto",
    "whatwg-fetch",
  ],
  // setupFilesAfterEnv: [
  //   "<rootDir>/src/global.d.ts"
  // ],
  transform: {
    '^.+\\.(ts|tsx)$': ["ts-jest", { isolatedModules: true }],
  },
}

export default config