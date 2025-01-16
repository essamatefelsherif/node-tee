# node-tee

[![Static Badge](https://img.shields.io/badge/GNU%20coreutils-node--tee-blue?logo=GNU&logoColor=FFFFFF)](https://www.npmjs.com/package/@essamonline/node-tee)
[![NPM Downloads](https://img.shields.io/npm/d18m/%40essamonline%2Fnode-tee?logo=npm&color=lightgreen)](https://www.npmjs.com/package/@essamonline/node-tee)
[![NPM Last Update](https://img.shields.io/npm/last-update/%40essamonline%2Fnode-tee?logo=npm&color=blue)](https://www.npmjs.com/package/@essamonline/node-tee)
[![NPM Version](https://img.shields.io/npm/v/%40essamonline%2Fnode-tee?logo=npm)](https://www.npmjs.com/package/@essamonline/node-tee)
[![Coverage Status](https://coveralls.io/repos/github/essamatefelsherif/node-tee/badge.svg?branch=main)](https://coveralls.io/github/essamatefelsherif/node-tee?branch=main)

A Node.js implementation of the ([GNU coreutils](https://www.gnu.org/software/coreutils/ "GNU coreutils")) '[tee](https://www.gnu.org/software/coreutils/manual/html_node/tee-invocation.html "tee")' redirection command version 8.32.

## Installation

```
npm install [-g] @essamonline/node-tee
```

## Usage

```
Usage: node-tee [OPTION]... [FILE]...
Copy standard input to each FILE, and also to standard output.

  -a, --append              append to the given FILEs, do not overwrite
  -i, --ignore-interrupts   ignore interrupt signals
  -p                        diagnose errors writing to non pipes
      --output-error[=MODE]   set behavior on write error.  See MODE below
      --help     display this help and exit
      --version  output version information and exit

MODE determines behavior with write errors on the outputs:
  'warn'         diagnose errors writing to any output
  'warn-nopipe'  diagnose errors writing to any output not a pipe
  'exit'         exit on error writing to any output
  'exit-nopipe'  exit on error writing to any output not a pipe
The default MODE for the -p option is 'warn-nopipe'.
The default operation when --output-error is not specified, is to
exit immediately on error writing to a pipe, and diagnose errors
writing to non pipe outputs.

```

## Testing

[node-tee](bin/node-tee "node-tee") was tested to verify full emulation of the GNU [tee](https://www.gnu.org/software/coreutils/manual/html_node/tee-invocation.html "tee") command version 8.32, by running each of the two commands [tee](https://www.gnu.org/software/coreutils/manual/html_node/tee-invocation.html "tee") and [node-tee](bin/node-tee "node-tee") in a child process and asserting the strict equality of their respective outputs (stdout, stderr) and exit codes.


Tests were successfully carried on 'linux' and 'win32' platforms, to cover all possible combinations of inputs and command line arguments.


A command line utility [node-tee-test](bin/node-tee-test "node-tee-test") has been developed for the user to ensure the software is successfully tested on his own platform.
```
Usage: node-tee-test [OPTIONS]...
Test the developed 'node-tee'.

With no options, testing will be done using nodejs test runner API if supported.

  -n  --node     use nodejs test runner API if supported
  -d  --def      use default test runner
  -v  --verbose  make the testing operation more talkative
  -h  --help     display this help and exit

'node-tee' was tested againts the GNU 'tee' command version 8.32.
```

## Documentation

Source code documentation, along with a test coverage report and more relevant documents are all included under [Documentation](https://essamatefelsherif.github.io/node-tee/ "Documentation").

## Node version support

**node-tee** supports all currently maintained Node versions. See the [Node Release Schedule](https://github.com/nodejs/Release#release-schedule).

## License

This software is licensed under the MIT license, see the [LICENSE](./LICENSE "LICENSE") file.
