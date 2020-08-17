export default function jsonBody(method: string, body: unknown): RequestInit {
  return {
    method,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  };
}
