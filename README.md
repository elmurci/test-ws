# TEST Nillion on Next

Try to `GET http://localhost:3000/api/nillion`

`pnpm dev`: fails

`pnpm build && pnpm start`: works, as this runs in prod env - `secretvaults/lib` isn't using `pino-pretty` transport there.

