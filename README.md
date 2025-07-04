# TEST Nillion on Next

try to `GET http://localhost:3000`

`pnpm dev`: fails

`pnpm build && pnpm start`: works, as this runs in prod env - secretvaults/lib isn't using pino-pretty transport there.

btw -> the "built" variant runs until I'm querying collections / schemas, but that's another ticket.
