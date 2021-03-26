import { TestContext } from 'ember-test-helpers'

declare module 'qunit-parameterize' {

  interface CasesFunction<T> {
    test: (name: string, callback: (this: TestContext, attrs : T, assert: Assert) => void | Promise<void>) => void;
  }

  type QunitParameters = <T>(toto: T[]) => CasesFunction<T>

  const cases: QunitParameters

  export default cases
} 
