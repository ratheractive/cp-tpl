# Directory based templating engine

This Library will allow you to create templates of projects and services that can be compiled before being applied. Oposite to many templating engines where you have to use some special syntax to mark which parts of the template should be replaced, in this engine you just specify what strings should be replaced with what. This approach makes development of templates much easier as you just create a working project and then customize it to your liking.

The engine is inspired by the ```dotnet new``` command.  

## Usage

``` js
const {dirTpl} = require("dir-tpl")

const templateDirPath = "/home/dev1/templates/my_service_template"
const outputDirPath = "/home/dev1/projects/service"

const rules = {
    replace: {
        "TemplateValueOne": "ActualValueOne"
    },
    exclude: ["path1","path2"],
    toggle: {
        "TOGGLE_ONE": true
    }
}
await dirTpl(templateDirPath, outputDirPath, rules)
```
