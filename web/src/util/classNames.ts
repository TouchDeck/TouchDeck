export function classNames(names: unknown[]): string {
  let result = '';
  names.forEach((name) => {
    if (name) {
      result = `${result} ${name}`;
    }
  });
  return result.trim();
}
