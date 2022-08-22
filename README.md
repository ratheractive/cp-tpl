# Directory based templating engine

This Library will allow you to create templates of projects and services that can be compiled before being applied. Oposite to many templating engines where you have to use some special syntax to mark which parts of the template should be replaced, in this engine you just specify what strings should be replaced with what. This approach makes development of templates much easier as you just create a working project and then customize it to your liking.

The engine is inspired by the ```dotnet new``` command.  

## Usage

``` js
const {cpTpl} = require("cp-tpl")

const templateDirPath = "/home/dev1/templates/my_service_template"
const outputDirPath = "/home/dev1/projects/service"

const rules = {
    replace: {
        "TemplateValueOne": "ActualValueOne"
    },
    exclude: ["path1","path2"],
}
await cpTpl(templateDirPath, outputDirPath, rules)
```

## comming next

### Conditional exclusion of parts of file

You will be able to declare a toggle like this
``` js
const rules = {
    toggle: {
        "TOGGLE_ONE": true
    }
}
```

and then use it in your code file like this

``` js
const a = require('b')

// cp-tpl:if TOGGLE_ONE
a.configureIfToggleOneOn()

// cp-tpl:endif TOGGLE_ONE
```

I'm sure you can already see where this is going...

Other rules are:
* if there is a "cp-tpl:if TOGGLE_X" statement in code and TOGGLE_X isn't defined, the app will throw an exception
* if there's no closing code, the lib will throw an exception
* whatever is the comment line indication, the whole line will be removed

## Command Line Interface

``` sh
> cp-tpl ../template-directory output-directory --replace template-val-1=val-1 --replace template-val-2=val2 --exclude templatize
```
