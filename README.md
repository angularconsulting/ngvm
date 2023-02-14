### Angular CLI Version Manager

Forget about typing all these long npm commands that you used to maintain Angular CLI versions. Use ngvm instead!

### Install:

```
npm install ngvm -g
ngvm help
```

### Options:

| command            | description                                                                                                                                         |
|--------------------| --------------------------------------------------------------------------------------------------------------------------------------------------- |
| install &#124; i   | Install a specific version of Angular CLI. By default it will install the latest version                                                            |
| uninstall &#124; u | Uninstall the global or local Angular CLI                                                                                                           |
| new &#124; n       | Create a new Angular application. You can use the global Angular CLI or NPX. You can specify any existing Angular CLI version                       |
| latest             | Print out the latest Angular CLI version available on NPM                                                                                           |
| global             | Print out the global Angular CLI version                                                                                                            |
| local              | Print out the local Angular CLI version                                                                                                             |
| versions &#124; vs  | Print out the global, local and latest Angular CLI versions                                                                                         |
| inspect            | Print out Angular CLI, Angular, NodeJS, TypeScript, RxJS versions and more info about current working directory                                     |
| list &#124; ls     | List of all Angular CLI releases available on NPM                                                                                                   |
| show               | Check information about a particular Angular CLI version released on NPM. By default, the latest version is shown                                   |
| pkgmgr &#124; pm   | Print out or set local or global Angular CLI default package manager                                                                                |
| compat             | Navigate to the Angular CLI, Angular, NodeJs, TypeScript, RxJS compatibility list                                                                   |
| diff               | Compare the difference between Angular CLI versions. You can specify any existing versions. By default local version will be diffed with the latest |
| consulting            | Everything about Angular. High level of expertise, engineering and training |

### Examples:
```
$ ngvm new my-app --routing --style=scss -npx  
$ ngvm new my-app --routing --style=scss -ng 15.0.0  
$ ngvm show 15.0.0    
$ ngvm pm yarn  
$ ngvm diff 14.0.0 15.0.0    
$ ngvm install -g  
```
created by [angularconsulting.au](https://angularconsulting.au)
