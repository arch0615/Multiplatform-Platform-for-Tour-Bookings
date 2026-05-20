type Dict = Record<string, unknown>;

function unflatten(input: Dict): Dict {
  const out: Dict = {};
  for (const [key, value] of Object.entries(input)) {
    const normalized =
      value !== null && typeof value === "object" && !Array.isArray(value)
        ? unflatten(value as Dict)
        : value;

    if (key.includes(".")) {
      const parts = key.split(".");
      let target = out;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (typeof target[part] !== "object" || target[part] === null) {
          target[part] = {};
        }
        target = target[part] as Dict;
      }
      target[parts[parts.length - 1]] = normalized;
    } else {
      out[key] = normalized;
    }
  }
  return out;
}

function deepMerge(a: Dict, b: Dict): Dict {
  const out: Dict = { ...a };
  for (const [key, value] of Object.entries(b)) {
    const existing = out[key];
    if (
      existing !== null &&
      typeof existing === "object" &&
      !Array.isArray(existing) &&
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      out[key] = deepMerge(existing as Dict, value as Dict);
    } else {
      out[key] = value;
    }
  }
  return out;
}

const FILES_USING_DEFAULT_NAMESPACE = new Set(["tours"]);

const modules = import.meta.glob("./*/*.ts", { eager: true });

const messages: Record<string, Record<string, Dict>> = {};

for (const path of Object.keys(modules)) {
  const match = path.match(/\.\/([^/]+)\/([^/]+)\.ts$/);
  if (!match) continue;
  const [, lang, filename] = match;

  const mod = modules[path] as Record<string, unknown>;
  const raw =
    (mod.default as Dict | undefined) ?? (mod[filename] as Dict | undefined);
  if (!raw) continue;

  const ns = FILES_USING_DEFAULT_NAMESPACE.has(filename) ? "translation" : filename;
  const normalized = unflatten(raw);

  if (!messages[lang]) messages[lang] = {};
  messages[lang][ns] = messages[lang][ns]
    ? deepMerge(messages[lang][ns], normalized)
    : normalized;
}

export default messages;
