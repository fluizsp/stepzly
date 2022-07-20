# Stepzly

Stepzly is a lib to perform stepped, predefined actions suitable to data transformation, aggregation, calculation and validation. 
It's part of a Low-Code BFF (Back for Front) solution, but can be used separately. It is designed to run on the server-side.

  [![NPM Version][npm-version-image]][npm-url]
  [![NPM Install Size][npm-install-size-image]][npm-install-size-url]
  [![NPM Downloads][npm-downloads-image]][npm-downloads-url]

````
const Stepzly = require('stepzly')
const steps = [
    {
        set: {
            to: ['Name', 'Age'],
            from: ['John', 20]
        },
        name: 'Set Some Vars'
    }
]
const stepzly = new Stepzly(steps, null)
stepzly.run(true).then(output => {
    try {
        console.log(output);
    }
    catch (err) {
    }
});
````
Example result (with debug on):
````

{
  result: {},
  state: { start: 2022-07-14T09:19:09.742Z, Name: 'John', Age: 20 },
  errors: [],
  log: '2022-07-14T09:19:09.742Z Start: 2022-07-14T09:19:09.742Z\n' +
    '2022-07-14T09:19:09.743Z Performing step Set Some Vars\n' +
    '2022-07-14T09:19:09.744Z End: 2022-07-14T09:19:09.744Z\n'
}
````

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

If this is a brand new project, make sure to create a `package.json` first with
the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```console
$ npm install stepzly
```

## Features

  * Perform promise-based steps
  * Fetch data from external sources
  * Manipulate (set/unset) state and result
  * Convert data to and from string/number/date
  * Calculate data
  * Split/Join data
  * Extract data with regular expressions
  * Validate data with comparison and logical operators
  * Run loops based on lists with context
  * Define conditions for each step execution
  
## Desired Features for next versions

  * Implement common Authentication methods for Fetch (Basic, API key, Bearer, Basic auth, Digest, OAuth 1.0, OAuth 2.0)
  * Implement routines, wich is basically groups of steps that runs on the same context (e.g. a loop) and have similar conditions
  * Support more robust logging and instrumentation/telemetry
  
## Documentation and Wiki

  * Complete documentation coming soon! Check [Examples](#examples-and-quick-start) for Quick Start
  
## Examples and Quick-start

In `examples` folder you can have a bunch of scenarios using Stepzly capabilities. In examples Yaml is used to define Steps.

From Example 06:

````
steps:
  - set:
      to: githubOrg
      from: microsoft
    name: Define GH org
  - fetch:
      url: https://api.github.com/orgs/{{githubOrg}}
      to: ghOrgInfo
    name: Retrieve GH Org info
  - convert:
      from:
        - "{{ghOrgInfo.created_at}}"
        - "{{ghOrgInfo.updated_at}}"
      to:
        - ghOrgInfo.created_date
        - ghOrgInfo.updated_date
      conversion: toDate
    name: Convert Dates
  - calculate:
      from:
        - "{{ghOrgInfo.followers}}"
        - "{{ghOrgInfo.following}}"
      to: ghOrgInfo.follower_and_following
      operator: +
    name: Calculate Followers + Following
    conditions:
      - Has Followers:
          compare: "{{ghOrgInfo.followers}}"
          with: 0
          operator: greater
          logical: or
  - split:
      from: "{{ghOrgInfo.avatar_url}}"
      to: ghOrgInfo.avatarUrlFragments
      separator: /
    name: Separate Avatar Url Fragments
  - join:
      from: "{{ghOrgInfo.avatarUrlFragments}}"
      to: ghOrgInfo.avatarUnderlineUrl
      separator: _
    name: Join Avatar Url Fragments with underline
  - extract:
      from: "{{ghOrgInfo.avatar_url}}"
      to: ghOrgInfo.avatar_id
      expression: 'u\/(.*)\?'
    name: Extract Avatar ID
  - set:
      to: ghOrgInfo.avatar_id
      from: "{{ghOrgInfo.avatar_id.1}}"
    name: CleanUp Regex
  - validate:
      compare: "{{ghOrgInfo.followers}}"
      with: 0
      operator: greater
      to: ghOrgInfo.has_followers
    name: Validate Org followers

````
Result with Debug On:
````
{
  result: {},
  state: {
    start: 2022-07-14T09:49:52.224Z,
    githubOrg: 'microsoft',
    ghOrgInfo: {
      login: 'microsoft',
      id: 6154722,
      node_id: 'MDEyOk9yZ2FuaXphdGlvbjYxNTQ3MjI=',
      url: 'https://api.github.com/orgs/microsoft',
      repos_url: 'https://api.github.com/orgs/microsoft/repos',
      events_url: 'https://api.github.com/orgs/microsoft/events',
      hooks_url: 'https://api.github.com/orgs/microsoft/hooks',
      issues_url: 'https://api.github.com/orgs/microsoft/issues',
      members_url: 'https://api.github.com/orgs/microsoft/members{/member}',
      public_members_url: 'https://api.github.com/orgs/microsoft/public_members{/member}',
      avatar_url: 'https://avatars.githubusercontent.com/u/6154722?v=4',
      description: 'Open source projects and samples from Microsoft',
      name: 'Microsoft',
      company: null,
      blog: 'https://opensource.microsoft.com',
      location: 'Redmond, WA',
      email: 'opensource@microsoft.com',
      twitter_username: 'OpenAtMicrosoft',
      is_verified: true,
      has_organization_projects: true,
      has_repository_projects: true,
      public_repos: 4939,
      public_gists: 0,
      followers: 0,
      following: 0,
      html_url: 'https://github.com/microsoft',
      created_at: '2013-12-10T19:06:48Z',
      updated_at: '2022-06-13T17:49:25Z',
      type: 'Organization',
      created_date: 2013-12-10T19:06:48.000Z,
      updated_date: 2022-06-13T17:49:25.000Z,
      avatarUrlFragments: [Array],
      avatarUnderlineUrl: 'https:__avatars.githubusercontent.com_u_6154722?v=4',
      avatar_id: '6154722',
      has_followers: false
    }
  },
  errors: [],
  log: '2022-07-14T09:49:52.224Z Start: 2022-07-14T09:49:52.224Z\n' +
    '2022-07-14T09:49:52.225Z Performing step Define GH org\n' +
    '2022-07-14T09:49:52.226Z Performing step Retrieve GH Org info\n' +
    '2022-07-14T09:49:52.226Z Fecthing URL: https://api.github.com/orgs/microsoft\n' +
    '2022-07-14T09:49:52.457Z Performing step Convert Dates\n' +
    '2022-07-14T09:49:52.459Z Performing step Calculate Followers + Following\n' +
    '2022-07-14T09:49:52.459Z Condition Has Followers satisfied? false\n' +
    '2022-07-14T09:49:52.459Z Performing step Separate Avatar Url Fragments\n' +
    '2022-07-14T09:49:52.460Z Performing step Join Avatar Url Fragments with underline\n' +
    '2022-07-14T09:49:52.460Z Performing step Extract Avatar ID\n' +
    '2022-07-14T09:49:52.460Z Performing step CleanUp Regex\n' +
    '2022-07-14T09:49:52.460Z Performing step Validate Org followers\n' +
    '2022-07-14T09:49:52.460Z End: 2022-07-14T09:49:52.460Z\n'
}
````

## People

The author of Stepzly is [Fábio Luiz Pereira](https://github.com/fabio-luiz-pereira).

I began the development a few years back, but in 2022 revised and shaped into a library

Current looking for contributors to help adding new features!

## License

[MIT](LICENSE)

[npm-downloads-image]: https://badgen.net/npm/dm/stepzly
[npm-downloads-url]: https://npmcharts.com/compare/stepzly?minimal=true
[npm-install-size-image]: https://badgen.net/packagephobia/install/stepzly
[npm-install-size-url]: https://packagephobia.com/result?p=stepzly
[npm-url]: https://npmjs.org/package/stepzly
[npm-version-image]: https://badgen.net/npm/v/stepzly
