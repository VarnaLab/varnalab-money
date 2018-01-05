
# varnalab-money

## inv.bg

```bash
node varnalab-money/bin/ \
  --config path/to/config.json \
  --auth path/to/auth.json \
  --source invbg \
  --env production
```


### config.json

```json
{
  "production": {
    "invbg": {
      "cashbox": "1",
      "from": "2017-08-01",
      "to": "2020-01-01",
      "xls": "/path/to/cashbox.xls",
      "json": "/path/to/cashbox.json"
    }
  }
}
```

### auth.json

```json
{
  "production": {
    "invbg": {
      "domain": "varnalab",
      "email": "...",
      "password": "...",
      "token": "...",
      "expires": 0
    }
  }
}
```
