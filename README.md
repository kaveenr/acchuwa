අච්චුව / Acchuwa
=======

Acchuwa quick and dirty templating based on [handlebars](https://handlebarsjs.com/guide/#simple-expressions).

The project name Acchuwa, is the Sinhala word අච්චුව which is translated to template.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

* [Usage](#usage)
* [Commands](#commands)
# Usage
```sh-session
$ acchuwa --help [COMMAND]
Acchuwa quick and dirty templating

USAGE
  $ acchuwa [CONFIG_FILE]

OPTIONS
  -h, --help     show CLI help
  -v, --version  show CLI version

```
# Example Acchuwa Config

```json 
{
    "acchuwaVersion": "0.0.0",
    "templates": [
        {
            "template": {
                "name": "Generate CRUD API path",
                "file": "templates/crud.yaml.hbs",
                "outputDirectory": "generated/",
                "outFileTemplate": "{{type}}-partial.yaml"
            },
            "parameters": [{
                "type": "pet",
                "tag": "CRUD for Pets"
            }]
        }
    ]
}
```