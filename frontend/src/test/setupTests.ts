import "@testing-library/jest-dom";

// Silence React Router warnings during tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    const msg = args[0]?.toString?.() || "";
    if (
      msg.includes("React Router") ||
      msg.includes("Not implemented: navigation")
    )
      return;
    originalError(...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Basic fetch mock
beforeEach(() => {
  global.fetch = vi.fn(async (input: RequestInfo | URL) => {
    const url = input.toString();
    // Return OK for most endpoints with minimal payload
    if (url.includes("/api")) {
      return new Response(JSON.stringify({ data: [], meta: {} }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }) as unknown as Response;
    }
    return new Response("{}", { status: 200 }) as unknown as Response;
  }) as unknown as typeof fetch;
});
