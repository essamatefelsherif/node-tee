# node-tee

A Node.js implementation of the ([GNU coreutils](https://www.gnu.org/software/coreutils/ "GNU coreutils")) '[tee](https://www.gnu.org/software/coreutils/manual/html_node/tee-invocation.html "tee")' redirection command version 8.32.

## Installation

```
npm install [-g] node-tee
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

[node-tee](bin/node-tee "node-tee") was tested againts the GNU [tee](https://www.gnu.org/software/coreutils/manual/html_node/tee-invocation.html "tee") command version 8.32, by running each of the two commands in a child process and asserting the strict equality of their respective outputs (stdout, stderr) and the exit codes of both child processes. About 30 tests were successfully carried to cover all possible combinations of input conditions and command line arguments.

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

## Node version support

**node-tee** supports all currently maintained Node versions. See the [Node Release Schedule][].

[node release schedule]: https://github.com/nodejs/Release#release-schedule

## License

This plugin is licensed under the MIT license, see the LICENSE file.
