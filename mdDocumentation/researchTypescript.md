# Research typescript ✅

After making a basic version of the back-end with Javascript, I thought it would be better to convert it to TypeScript, for that, a few things needed to change in the configuration of the project.

## 1. First compiling and then executing

By adding a tsconfig.json file that specifies a few typescript settings and where the files that should be compiled come from and where they should be compiled to, it is possible to use typescript in the project relatively fast.

The downside is that this method requires to type `npx tsc` every single time a change is made in the TypeScript file, to update the JavaScript version, and then `nodemon build/index.js` to run the JavaScript version. which is really time consuming and a very bad workflow.

## 2. Using TypeScript with nodemon

The 2nd method, which is actually even simpler, is something I found in [an article](https://blog.logrocket.com/configuring-nodemon-with-typescript/) which describes how to use TypeScript with nodemon directly, simply ba adding 2 packages and typing `` npx nodemon`./filename.ts `` in the CLI.
