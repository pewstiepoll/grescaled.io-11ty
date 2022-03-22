---
title: Dependency Confusion attack
summary: An important note on the security of the npm ecosystem.
tags: webdev

length: 4
date: 2022-03-18
---
In this article, I will talk about private NPM registries, a Dependency Confusion attack, and how a misconfigured private NPM registry can be a potential target for one. I assume that the reader has a basic understanding of the JavaScript ecosystem, including the concept behind Node Package Manager and [the public registry](https://www.npmjs.com/).
To better understand how the attack was possible, we will discuss how the private registries work. And to learn how to prevent these sorts of attacks, we will need to understand the importance of a proper configuration when it comes to setting up one's private registry.

## Introduction
Not long ago, one of the clients that I work with has undergone a hacker attack. The attack targeted a vulnerability exposed by a misconfigured private NPM registry. This kind of attack vector is called Dependency Confusion, and sometimes it is referred to as a Namespace Shadowing or a Supply Chain attack. The attack was spotted almost immediately, leaving no room for hackers to do any real damage.

## Private Registry
Companies want to have their private registries for various reasons. One of the most critical reasons is security. Hosting your private registry, when configured correctly, can ensure that the modules developed by the company are inaccessible to the public, which leads to some great benefits:
- Secure storage of sensitive code and data.
- Ability to overwrite public packages.

There are a lot of different tools that can help companies create their private registries. Here are a few examples: 
- [Artifactory](https://jfrog.com/artifactory/), 
- [Verdaccio](https://verdaccio.org/). 

Jfrog's Universal Artifact Management is a powerful tool that can host not just NPM packages but can also be the single source of truth for all company's packages, container images, and much more.
Our team has been using the tool as a private NPM registry for the apps and modules developed and maintained by the web department.

## How the Dependency Confusion Attack works
In web-dev, a supply chain refers to node_modules. So how exactly does one exploit the supplies in the chain for their malicious needs?

By default, tools like Artifactory provide a proxy functionality that allows developers to seamlessly install the package from the public registry if, for example, a requested package has not been found in the private registry or there is a newer version of the package version available. And that's where the potential vulnerability lives: if misconfigured, this allows an attacker to create a "newer" version of the supposedly private package in the public registry. The proxy then resolves this malicious version as a genuine newer version and fetches it instead.
Here's an example of how that works:
1. A company has a private module that stored in its private registry:
```
@acme/core-library@1.2.3
```
2. A company also has an app that depends on the `core-library` but doesn't lock the package version:
```json
// package.json:
"dependencies": {
    "@acme/core-library": "^1.3.3",
    // less conventional
    "@acme/core-library": "1.x.x",
    // idc style
    "@acme/core-library": "*"
}
```
3. A hacker creates a malicious version of the package and publishes it in the public NPM registry using the same name as a private package, but with a "newer" version:
```
@acme/core-library@1.3.3
```
4. During the next `npm install` the npm command receives "1.3.3" as the most up-to-date version that matches the package version criteria from package.json and installs it in the project. It could be a new local installation, CI running the pipeline, or someone deploying to a production server.

Simple as that, the only requirement is to know the exact name of the private package. Once the malicious package gets into the build, it opens the door of possibilities for a hacker to exploit the environment where the app runs even further.
The hacker uses the dependency of a project to get the desired outcome. The proxy feature of the private registry gets confused trying to resolve the dependency version, thus the name - Dependency Confusion.

## The consequences of Dependency Confusion Attack
At this point, there are plenty of options for how hackers can inflict more harm. Having a fully controlled node module in the running app gives them room to create various scenarios to compromise the integrity of the app and the users' data. The hacker can create a build-time attack, tweaking the "scripts" section in the "package.json" inside the module. One way they can achieve this is by setting up hooks to any standard npm command, like so:
```json
// package.json
"scripts": {
    // runs before each "npm install"
    "preinstall": "node aweful_things.js",
}
```
Or the hacker can create a runtime attack that would execute a custom script whenever the module is imported, like so:
```js
// index.js, a common entry file for npm modules
module.exports = { ... };

// during the runtime when the module is imported
require("./awful_things.js");
```
## How to prevent a Dependency Confusion Attack?
Multiple steps should be taken to prevent the DCA, each ensuring the protection from different vulnerabilities that make the attack possible.
The most straightforward step is to always lock the dependency version in the "package.json" file. This can be achieved by using the `--save-exact` or `-E` flag when running `npm install`:
```js
// Install the "react" module
// saving the exact version number
npm install --save-exact react@latest
```
Because of this flag, the next time someone runs `npm install` exact version of the package will be installed, leaving no room for the wrong version to sneak in.

Depending on the private registry service, various methods of configuration can help reduce the risk of DCA. 

For example, Artifactory has a feature called ["Exclude Patterns"](https://jfrog.com/knowledge-base/how-to-use-include-exclude-patterns/). It allows limiting the resolution or deployment of artifacts by using the exclude/include pattern. The simplest example that blocks `@my/` scope would look like this: `“.npm/@my/**”`. 


Other private registries like Verdaccio also have features that help protect against DCA. It's always recommended to follow [the best practices](https://verdaccio.org/docs/best/) when using a private registry.

## Conclusion
Dependency Confusion attacks are not new and are easily preventable. Nonetheless, they still happen in the real world quite often, and even big players on the market can become a target.
The name for the attack was coined by [Alex Birsan](https://medium.com/@alex.birsan), who conducted research and [successfully hacked](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610) companies like Apple, Microsoft, and Dozens of others. I recommend reading his great article if you want to get deeper on the subject.

## Resources
1. [Avoiding npm substitution attacks - GitHub Blog](https://github.blog/2021-02-12-avoiding-npm-substitution-attacks/)
2. [Using Exclude Patterns in Remote Repositories - jFrog Blog](https://jfrog.com/blog/yet-another-case-for-using-exclude-patterns-in-remote-repositories/)
3. [How we protected ourselves from the Dependency Confusion attack - Schibsted](https://schibsted.com/blog/dependency-confusion-how-we-protected-ourselves/)