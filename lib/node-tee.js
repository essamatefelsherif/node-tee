/**
 * tee (GNU coreutils) 8.32
 * Copyright (C) 2020 Free Software Foundation, Inc.
 * License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>.
 * This is free software: you are free to change and redistribute it.
 * There is NO WARRANTY, to the extent permitted by law.
 *
 * Written by Mike Parker, Richard M. Stallman, and David MacKenzie.
 *
 * Implemented in nodeJS by Essam A. El-Sherif.
 *
 * @module  node-tee
 * @desc    A Node.js implementation of the (GNU coreutils) 'tee' redirection command version 8.32.
 * @version 1.0.0
 * @author  Essam A. El-Sherif
 */

/** Import nodeJS core modules */
import process from 'node:process';
import fs from 'node:fs';

/**
 * @const errno {object} - Imported error symbols/messages
 * @see   module:node-tee-errno
 */
import errno from './node-tee-errno.js';

/** @const {string} CMD_NODE - The coreutils node command */
const CMD_NODE = 'node-tee';

/** @const {string} CMD_NODE_VER - The coreutils node command version */
const CMD_NODE_VER = 'v1.0.0';

/** @const {object} cmdOptions - Command line arguments */
const cmdOptions = {
	readOpts:          true,            //    --
	append:            true,            // -a --append
	ignoreInterrupts:  false,           // -i --ignore-interrupts
	outputError:      'warn-nopipe',    //    --output-error[=MODE]
};

/** @const {Set} fileList - Files given as command line arguments */
const fileList = new Set();

/**
 *     function main
 * function parseCmdLine()
 * function processCmd()
 * function getHelp()
 * function getError(n)
 *
 * @func Main
 * @desc The application entry point function
 */
(() => {

	parseCmdLine();
	processCmd();

})('Main Function');

/**
 * function main
 *     function parseCmdLine()
 * function processCmd()
 * function getHelp()
 * function getError(n)
 *
 * @func parseCmdLine
 * @desc Command line parser function
 */
function parseCmdLine(){

	const args = process.argv;

	for(let i = 2; i < args.length; i++)
		if(cmdOptions.readOpts && args[i] === '--help'){
			process.stdout.write(`${getHelp()}\n`);
			process.exit(0);
		}
		else
		if(cmdOptions.readOpts && args[i] === '--version'){
			process.stdout.write(`${CMD_NODE_VER}\n`);
			process.exit(0);
		}
		else
		if(args[i] === '--')
			cmdOptions.readOpts = false;
		else
		if(cmdOptions.readOpts && args[i] === '--append')
			cmdOptions.append = true;
		else
		if(cmdOptions.readOpts && args[i] === '--ignore-interrupts')
			cmdOptions.ignoreInterrupts = true;
		else
		if(cmdOptions.readOpts && args[i].startsWith('--output-error=')){
			let str = args[i];
			str = str.replace('--output-error=', '');

			switch(str){
				case 'warn':
				case 'warn-nopipe':
				case 'exit':
				case 'exit-nopipe':
					cmdOptions.outputError = str;
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
		if(cmdOptions.readOpts && args[i] === '--output-error')
			true;
		else
		if(cmdOptions.readOpts && args[i].startsWith('--')){
			process.stderr.write(`${getError(2).replace('_', args[i])}\n`);
			process.exit(1);
		}
		else
		if(cmdOptions.readOpts && args[i] === '-')
			fileList.add(args[i]);
		else
		if(cmdOptions.readOpts && args[i].startsWith('-')){
			let str = args[i];
			str = str.replace('-', '');

			for(let c of str){
				switch(c){
					case 'a':
						cmdOptions.append = true;
						break;
					case 'i':
						cmdOptions.ignoreInterrupts = true;
						break;
					case 'p':
						cmdOptions.outputError = 'warn-nopipe';
						break;
					default:
						process.stderr.write(`${getError(3).replace('_', c)}\n`);
						process.exit(1);
				}
			}
		}
		else
		if(args[i].startsWith('-') && !cmdOptions.readOpts)
			fileList.add(args[i]);
		else
			fileList.add(args[i]);
}

/**
 * function main
 * function parseCmdLine()
 *     function processCmd()
 * function getHelp()
 * function getError(n)
 *
 * @func processCmd
 * @desc Command processer function
 */
function processCmd(){

	let debugSeq = 0;

	if(cmdOptions.ignoreInterrupts)
		process.on('SIGINT', () => {});

	process.stdout.on('error', (err) => {
		if(cmdOptions.outputError === 'warn' || cmdOptions.outputError === 'exit')
			process.stderr.write(`${CMD_NODE}: 'standard output': ${errno[err.code]}\n`);
	});

	for(const file of fileList){
		fs.open(file, cmdOptions.append ? 'a' : 'w', (err, fd) => {
			if(err){
				process.stderr.write(`${CMD_NODE}: ${file}: ${errno[err.code]}\n`);

				if(cmdOptions.outputError === 'exit' || cmdOptions.outputError === 'exit-nopipe')
					process.exit(1);
				else
					process.exitCode = 1;
			}
			else{
				const ws = fs.createWriteStream(file, {
					flags: cmdOptions.append ? 'a' : 'w',
					fd: fd
				});
				process.stdin.pipe(ws);
			}
		});
	}

	process.stdin.pipe(process.stdout);
}

/**
 * function main
 * function parseCmdLine()
 * function processCmd()
 *     function getHelp()
 * function getError(n)
 *
 * @func   getHelp
 * @return {string}
 * @desc   Function to return help info
 */
function getHelp(){

	return `\
Usage: ${CMD_NODE} [OPTION]... [FILE]...
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
writing to non pipe outputs.`;
}

/**
 * function main
 * function parseCmdLine()
 * function processCmd()
 * function getHelp()
 *     function getError(n)
 *
 * @func   getError
 * @param  {number} Error number
 * @return {string} Error message
 * @desc   Function to return error message
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