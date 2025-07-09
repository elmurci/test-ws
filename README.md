# TEST Nillion on Next

How to reproduce the issue:

1. Run `pnpm dev`
2. `GET http://localhost:3000/api/nillion`
3. Error: 
 ```
⨯ [Error: unable to determine transport target for "pino-pretty"] {
  page: '/api/nillion'
}
```



`pnpm build && pnpm start`: works, as this runs in prod env - `secretvaults/lib` isn't using `pino-pretty` transport there.

