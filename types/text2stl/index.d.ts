import Route from '@ember/routing/route';
import Service from '@ember/service';

declare global {
  // interface Array<T> extends Ember.ArrayPrototypeExtensions<T> {}
  // interface Function extends Ember.FunctionPrototypeExtensions {}

  type Resolved<P> = P extends Promise<infer T> ? T : P;
  export type RouteModel<R extends Route> = Resolved<ReturnType<R['model']>>;

  export type GTagService = Service & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event(name: string, data: any): void;
  };
}

declare module '@ember/service' {
  interface Registry {
    gtag: GTagService;
  }
}

export {};
