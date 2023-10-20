type GenericCalciteElement = Element & {
  componentOnReady?: () => Promise<void>;
};

export default async function waitCalciteReady() {
  const existingTagNames = [...document.querySelectorAll('*')].map((o) => o.tagName);
  const uniqTagNames = Object.keys(
    existingTagNames.reduce<Record<string, true>>(function (acc, name) {
      acc[name] = true;
      return acc;
    }, {}),
  );

  const calciteComponentName = uniqTagNames.filter((name) => name.startsWith('CALCITE'));

  await Promise.all(
    calciteComponentName.map(async (tagName) => {
      await customElements.whenDefined(tagName.toLowerCase());
      await Promise.all(
        [...document.querySelectorAll<GenericCalciteElement>(tagName)].map((e) =>
          e.componentOnReady?.(),
        ),
      );
    }),
  );
}
