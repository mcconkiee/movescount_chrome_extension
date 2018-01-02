## WORK IN PROGRESS

### Install

[geolib](https://github.com/mcconkiee/movescount_chrome_extension_be/tree/master/geolib) from [backend](https://github.com/mcconkiee/movescount_chrome_extension_be) is required. Recomended to have both sources in the same dir. eg:

```
path/to/dir =>
    => backend
        => geolib
    => movescount-for-chrome
```

### Dev

1. `webpack -w` to build and watch source for changes
2. add the `dist` directory to chrome extensions (Chrome -> Manage Extensions -> Load Unpacked Extension)
3. log into your MovesCount account
