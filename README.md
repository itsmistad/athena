# Athena

An omnifarious UI library.

## Setup

When developing, you may find that attempting to test your changes in both `@athena-ui/base` and any other dependent package proves to be tedious or unreasonable due to the required build & publish process.

This is where `npm link` becomes handy! All you need to do is run the following command from within the directory of your dependent framework, such as within `frameworks/react`:

```bash
npm link ../base
```
