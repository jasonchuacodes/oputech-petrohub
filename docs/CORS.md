# CORS and Axios `withCredentials`

## What is `withCredentials: true`?

In Axios, setting `withCredentials: true` tells the browser to include credentials—such as cookies, authorization headers, or TLS client certificates—on cross-site HTTP requests. Without this flag, browsers omit cookies when making requests to a different origin.

## How It Relates to CORS

1. **Server-side Credentials Header**  
   The server must explicitly allow credentialed requests by sending:
   ```
   Access-Control-Allow-Credentials: true
   ```
2. **Origin Restriction**  
   When allowing credentials, the server cannot use a wildcard (`*`) for the `Access-Control-Allow-Origin` header. The server must echo back the exact origin of the request:
   ```
   Access-Control-Allow-Origin: https://your-client-domain.com
   ```
3. **Axios & Browser Behavior**  
   - Axios will attach cookies if `withCredentials: true`.
   - The browser enforces CORS: it will block the response unless the server’s CORS headers satisfy both the origin check and the credentials requirement.

## Example

### Client (Axios)
```ts
// client/src/lib/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Include cookies on cross-site requests
  timeout: 5000,
});

export default axiosInstance;
```

### Server (Express + CORS)
```ts
// server/src/middlewares/cors.middleware.ts
import cors, { CorsOptions } from 'cors';

export const corsMiddleware = () => {
  const whitelist = [process.env.CLIENT_URL as string];

  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies
  };

  return cors(corsOptions);
};
