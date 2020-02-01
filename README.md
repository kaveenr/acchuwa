අච්චුව / Acchuwa
=======

Acchuwa quick and dirty templating based on [handlebars](https://handlebarsjs.com/guide/#simple-expressions).

*The project name Acchuwa, is the Sinhala word "අච්චුව" which translates to template*

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

# CLI Usage
```sh-session
$ acchuwa --help [COMMAND]
Acchuwa quick and dirty templating

USAGE
  $ acchuwa [CONFIG_FILE]

OPTIONS
  -h, --help     show CLI help
  -v, --version  show CLI version

```
# Quick Start Example
In the examples folder is given a letters example which batch generates text files with parameters given in the acchuwa config.

1. Install acchuwa
    ```sh
    npm install -g @kaveenr/acchuwa
    ```
2. Clone repository and navigate into the repository
    ```sh
    git clone https://github.com/kaveenr/acchuwa

    cd acchuwa
    ```
3. Run the example.
    ```sh
    acchuwa example/letters/acchuwa.conf.json
    ```
If you observe the example directory, files will be generated to the configured folder.
```sh
tree example/letters 
example/letters
├── acchuwa.conf.json
├── gen
│   ├── letter-for-John.txt
│   ├── letter-for-මංගලිකා.txt
│   └── letter-for-සමන්.txt
└── letter.txt.hbs

1 directory, 5 files
```
# Example Acchuwa Config

```json 
{
    "acchuwaVersion": "0.0.2",
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