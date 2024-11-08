# node-tee

A Node.js implementation of the '[tee](https://www.gnu.org/software/coreutils/manual/html_node/tee-invocation.html "tee")' command developed by ([GNU coreutils](https://www.gnu.org/software/coreutils/ "GNU coreutils")) 8.32.

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

## License

This plugin is licensed under the MIT license, see the LICENSE file.
