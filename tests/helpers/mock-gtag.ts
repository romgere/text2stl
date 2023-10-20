import type Owner from '@ember/owner';
import Service from '@ember/service';

export default function (owner: Owner) {
  owner.register(
    'service:gtag',
    class extends Service {
      event() {}
    },
  );
}
