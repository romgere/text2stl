declare module 'qunit-parameterize' {

  import { TestContext } from 'ember-test-helpers'

  interface CasesFunction<T> {
    test: (name: string, callback: (this: TestContext, attrs : T, assert: Assert) => void | Promise<void>) => void;
  }

  const cases: <T>(args: T[]) => CasesFunction<T>

  export default cases
}
