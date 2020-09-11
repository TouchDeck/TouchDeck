export default function fetchTimeout(
  input: RequestInfo,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const fetchPromise = fetch(input, { signal: controller.signal });
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  return fetchPromise.then((res) => {
    clearTimeout(timeoutId);
    return res;
  });
}
