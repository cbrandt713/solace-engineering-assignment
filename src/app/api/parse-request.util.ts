export function parseRequestSearchParams(request: Request): URLSearchParams {
  return URL.parse(request.url)?.searchParams ?? new URLSearchParams();
}
