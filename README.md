# Call Analyzer Frontend
  

This is a Nuxt codebase (Vue + Typescript + Vuetify). It uses the coposition-api method of creating components. The end result is a pre-generated static site.
Check below for a list of notable libraries used. Please note that this code-base uses strict formatting checks compatible with VS Code via ESLint and stylelint. The formatting can be easily handled by using prettier.
  

## Development Requirements

1. Yarn

2. vue-cli

3. access to the `API` repository.

  
##  Notable Libraries
1. nuxt-auth-next: authentication and authorization
2. nuxt-i18n: for internationlization and centralization of the UI verbiage.
3. dot-env: nuxt module to use `.env` files.
4. vue-i18n and vue-i18n-composable: used for compatibility with the composition API.

  

## Development Procedure

1. clone the repo

2. update packages by running `yarn`

3. create a `.env` file in the root and have the following config in there:

```
BASE_URL_DEVELOPMENT    = 'http://localhost:8000/api/v1'
BASE_URL_STAGING        = ''
BASE_URL_PRODUCTION     = ''
```

4. to develop, use `yarn dev`

5. to generate the production build, run `yarn generate-prod`. Similarly use `yarn generate-stag` for the staging copy.
6. For other nuxt related commands, consult the [official doc](https://nuxtjs.org/docs/2.x/get-started/installation).
