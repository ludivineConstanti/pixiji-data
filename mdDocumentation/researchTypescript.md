# Research typescript ✅

After making a basic version of the back-end with Javascript, I thought it would be better to convert it to TypeScript, for that, a few things needed to change in the configuration of the project.

## Typescript compiling with the Command Line Interface

By adding a tsconfig.json file that specifies a few typescript settings and where the files that should be compiled come from and where they should be compiled to, it is possible to use typescript in the project relatively fast.

The downside is that this method requires to type `npx tsc` every single time a change is made in the TypeScript file, to update the JavaScript version, and then `nodemon build/index.js` to run the JavaScript version. which is really time consuming and a very bad workflow.
