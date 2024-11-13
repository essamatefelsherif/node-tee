/*
 * tee (GNU coreutils) 8.32
 * Copyright (C) 2020 Free Software Foundation, Inc.
 * License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>.
 * This is free software: you are free to change and redistribute it.
 * There is NO WARRANTY, to the extent permitted by law.
 *
 * Written by Mike Parker, Richard M. Stallman, and David MacKenzie.
 */

import process from 'node:process';
import fs      from 'node:fs';
import errno   from './errno.js';

// command
const CMD_NODE = 'node-tee';

// command line options
const options = {
	readOpts:          true,            //    --
	append:            true,            // -a --append
	ignoreInterrupts:  false,           // -i --ignore-interrupts
	outputError:      'warn-nopipe',    //    --output-error[=MODE]
};

const outputErrorArgs = [
	'warn', 'warn-nopipe', 'exit', 'exit-nopipe', ''
];

// file list
const fileList = new Set();

// main
parseCmdLine();
processCmd();

/*
 *     parseCmdLine()
 * processCmd()
 * getHelp()
 * getVersion()
 * getError(n)
 */

function parseCmdLine(){

	const args = process.argv;

	for(let i = 2; i < args.length; i++)
		if(options.readOpts && args[i] === '--help'){
			process.stdout.write(`${getHelp()}\n`);
			process.exit(0);
		}
		else
		if(options.readOpts && args[i] === '--version'){
			process.stdout.write(`${getVersion()}\n`);
			process.exit(0);
		}
		else
		if(args[i] === '--')
			options.readOpts = false;
		else
		if(options.readOpts && args[i] === '--append')
			options.append = true;
		else
		if(options.readOpts && args[i] === '--ignore-interrupts')
			options.ignoreInterrupts = true;
		else
		if(options.readOpts && args[i].startsWith('--output-error=')){
			let str = args[i];
			str = str.replace('--output-error=', '');

			switch(str){
				case 'warn':
				case 'warn-nopipe':
				case 'exit':
				case 'exit-nopipe':
					options.outputError = str;
					break;
				case '':
					process.stderr.write(`${getError(0)}\n`);
					process.exit(1);
					break;
				default:
					process.stderr.write(`${getError(1).replace('_', str)}\n`);
					process.exit(1);
					break;
			}
		}
		else
		if(options.readOpts && args[i] === '--output-error')
			true;
		else
		if(options.readOpts && args[i].startsWith('--')){
			process.stderr.write(`${getError(2).replace('_', args[i])}\n`);
			process.exit(1);
		}
		else
		if(options.readOpts && args[i] === '-')
			fileList.add(args[i]);
		else
		if(options.readOpts && args[i].startsWith('-')){
			let str = args[i];
			str = str.replace('-', '');

			for(let c of str){
				switch(c){
					case 'a':
						options.append = true;
						break;
					case 'i':
						options.ignoreInterrupts = true;
						break;
					case 'p':
						options.outputError = 'warn-nopipe';
						break;
					default:
						process.stderr.write(`${getError(3).replace('_', c)}\n`);
						process.exit(1);
				}
			}
		}
		else
		if(args[i].startsWith('-') && !options.readOpts)
			fileList.add(args[i]);
		else
			fileList.add(args[i]);
}

/*
 * parseCmdLine()
 *     processCmd()
 * getHelp()
 * getVersion()
 * getError(n)
 */

function processCmd(){

	let debugSeq = 0;

	if(options.ignoreInterrupts)
		process.on('SIGINT', () => {});

	process.stdout.on('error', (err) => {
		if(options.outputError === 'warn' || options.outputError === 'exit')
			process.stderr.write(`tee: 'standard output': ${errno[err.code]}\n`);
	});

	for(const file of fileList){
		fs.open(file, options.append ? 'a' : 'w', (err, fd) => {
			if(err){
				process.stderr.write(`tee: ${file}: ${errno[err.code]}\n`);

				if(options.outputError === 'exit' || options.outputError === 'exit-nopipe')
					process.exit(1);
				else
					process.exitCode = 1;
			}
			else{
				const ws = fs.createWriteStream(file, {
					flags: options.append ? 'a' : 'w',
					fd: fd
				});
				process.stdin.pipe(ws);
			}
		});
	}

	process.stdin.pipe(process.stdout);
}

/*
 * parseCmdLine()
 * processCmd()
 *     getHelp()
 * getVersion()
 * getError(n)
 */

function getHelp(){
	return `\
Usage: tee [OPTION]... [FILE]...
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

GNU coreutils online help: <https://www.gnu.org/software/coreutils/>
Full documentation <https://www.gnu.org/software/coreutils/tee>
or available locally via: info '(coreutils) tee invocation'`;
}

/*
 * parseCmdLine()
 * processCmd()
 * getHelp()
 *     getVersion()
 * getError(n)
 */

function getVersion(){
	return `\
tee (GNU coreutils) 8.32
Copyright (C) 2020 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Written by Mike Parker, Richard M. Stallman, and David MacKenzie.`;
}

/*
 * parseCmdLine()
 * processCmd()
 * getHelp()
 * getVersion()
 *     getError(n)
 */

function getError(n){

const error = [
`\
${CMD_NODE}: ambiguous argument ‘’ for ‘--output-error’
Valid arguments are:
  - ‘warn’
  - ‘warn-nopipe’
  - ‘exit’
  - ‘exit-nopipe’
Try '${CMD_NODE} --help' for more information.`,

`\
${CMD_NODE}: invalid argument ‘_’ for ‘--output-error’
Valid arguments are:
  - ‘warn’
  - ‘warn-nopipe’
  - ‘exit’
  - ‘exit-nopipe’
Try '${CMD_NODE} --help' for more information.`,

`\
${CMD_NODE}: unrecognized option '_'
Try '${CMD_NODE} --help' for more information.`,

`\
${CMD_NODE}: invalid option -- '_'
Try '${CMD_NODE} --help' for more information.`,

];
	return error[n];
}
