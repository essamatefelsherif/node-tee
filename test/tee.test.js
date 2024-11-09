import os                 from 'node:assert/strict';
import assert             from 'node:assert/strict';
import { exec, execSync } from 'node:child_process';
import { fileURLToPath }  from 'node:url';
import { dirname, join }  from 'node:path';

// test command
const CMD = 'node-tee.test';

// command line options
const cmdOptions = {
	node    : true,  // -n --node / - d --def
	verbose : true,  // -v --verbose
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const teeJS = join(__dirname, '..', 'lib/tee.js');
let teeShell = 'tee';

try{ execSync(teeShell); }catch(e){	teeShell = ''; }

// teeShell = '';

let testCount = 1;
let pass   = 0;
let fail   = 0;
let cancel = 0
let skip   = 0;
let todo   = 0;
let startTime = Date.now();

let cmd_act = '', cmd_exp = '';
let cmd_inp = '', cmd_out = '';
let cmd_ext = 0;
let cmd_desc = '';

/*
 * suite 1 - test common coreutils options
 */

// TEST #01 - tee --help
cmd_act = `node ${teeJS} --help`;
cmd_exp = teeShell && `${teeShell} --help`;
cmd_inp = '';

cmd_out = `\
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
or available locally via: info '(coreutils) tee invocation'
`;

cmd_ext = 0;
cmd_desc = `tee --help`;
makeTest();

// TEST #02 - tee --version
cmd_act = `node ${teeJS} --version`;
cmd_exp = teeShell && `${teeShell} --version`;
cmd_inp = '';

cmd_out = `\
tee (GNU coreutils) 8.32
Copyright (C) 2020 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Written by Mike Parker, Richard M. Stallman, and David MacKenzie.
`;

cmd_ext = 0;
cmd_desc = `tee --version`;
makeTest();

// TEST #03 - tee --
cmd_act = `node ${teeJS} --`;
cmd_exp = teeShell && `${teeShell} --`;
cmd_inp = '';

cmd_out = '';

cmd_ext = 0;
cmd_desc = `tee --`;
makeTest();

/*
 * suite 2 - validate command line arguments
 */

// TEST #04 - tee --xxx
cmd_act = `node ${teeJS} --xxx`;
cmd_exp = teeShell && `${teeShell} --xxx`;
cmd_inp = '';

cmd_out = `tee: unrecognized option '--xxx'
Try 'tee --help' for more information.
`;

cmd_ext = 1;
cmd_desc = `tee --xxx`;
makeTest();

// TEST #05 - tee --output-error=
cmd_act = `node ${teeJS} --output-error=`;
cmd_exp = teeShell && `${teeShell} --output-error=`;
cmd_inp = '';

cmd_out = `\
tee: ambiguous argument ‘’ for ‘--output-error’
Valid arguments are:
  - ‘warn’
  - ‘warn-nopipe’
  - ‘exit’
  - ‘exit-nopipe’
Try 'tee --help' for more information.
`;

cmd_ext = 1;
cmd_desc = `tee --output-error=`;
makeTest();

// TEST #06 - tee --output-error=xxx
cmd_act = `node ${teeJS} --output-error=xxx`;
cmd_exp = teeShell && `${teeShell} --output-error=xxx`;
cmd_inp = '';

cmd_out = `\
tee: invalid argument ‘xxx’ for ‘--output-error’
Valid arguments are:
  - ‘warn’
  - ‘warn-nopipe’
  - ‘exit’
  - ‘exit-nopipe’
Try 'tee --help' for more information.
`;

cmd_ext = 1;
cmd_desc = `tee --output-error=xxx`;
makeTest();

// TEST #07 - tee -x
cmd_act = `node ${teeJS} -x`;
cmd_exp = teeShell && `${teeShell} -x`;
cmd_inp = '';

cmd_out = `tee: invalid option -- 'x'
Try 'tee --help' for more information.
`;

cmd_ext = 1;
cmd_desc = `tee -x`;
makeTest();

/*
 * suite 3 - test normal operation
 */

// TEST #08 - tee
cmd_act = `node ${teeJS}`;
cmd_exp = teeShell && `${teeShell}`;
cmd_inp = '';

cmd_out = '';

cmd_ext = 0;
cmd_desc = `tee`;
makeTest();

// TEST #09 - tee
cmd_act = `node ${teeJS}`;
cmd_exp = teeShell && `${teeShell}`;
cmd_inp = '\x00\x01\x02\x03\x04';

cmd_out = `\x00\x01\x02\x03\x04`;

cmd_ext = 0;
cmd_desc = 'tee' + ' << \\x00\\x01\\x02\\x03\\x04';
makeTest();

// TEST #10 - tee
cmd_act = `node ${teeJS}`;
cmd_exp = teeShell && `${teeShell}`;
cmd_inp = 'test data\nline 1\nline 2\x04\nline 3';

cmd_out = `test data
line 1
line 2\x04
line 3`;

cmd_ext = 0;
cmd_desc = 'tee' + ' << test data\\nline 1\\nline 2\\x04\\nline 3';
makeTest();

/*
 * suite 4 - test warn/error conditions of output files
 */

// TEST #11 - tee non-existent/file
cmd_act = `node ${teeJS} non-existent/file`;
cmd_exp = teeShell && `${teeShell} non-existent/file`;
cmd_inp = 'test data';

cmd_out = `test datatee: non-existent/file: No such file or directory
`;

cmd_ext = 1;
cmd_desc = `tee non-existent/file`;
makeTest();

// TEST #12 - tee --output-error=warn non-existent/file
cmd_act = `node ${teeJS} --output-error=warn non-existent/file`;
cmd_exp = teeShell && `${teeShell} --output-error=warn non-existent/file`;
cmd_inp = 'test data';

cmd_out = `test datatee: non-existent/file: No such file or directory
`;

cmd_ext = 1;
cmd_desc = `tee --output-error=warn non-existent/file`;
makeTest();

// TEST #13 - tee --output-error=warn-nopipe non-existent/file
cmd_act = `node ${teeJS} --output-error=warn-nopipe non-existent/file`;
cmd_exp = teeShell && `${teeShell} --output-error=warn-nopipe non-existent/file`;
cmd_inp = 'test data';

cmd_out = `test datatee: non-existent/file: No such file or directory
`;

cmd_ext = 1;
cmd_desc = `tee --output-error=warn-nopipe non-existent/file`;
makeTest();

// TEST #14 - tee --output-error=exit non-existent/file
cmd_act = `node ${teeJS} --output-error=exit non-existent/file`;
cmd_exp = teeShell && `${teeShell} --output-error=exit non-existent/file`;
cmd_inp = 'test data';

cmd_out = `tee: non-existent/file: No such file or directory
`;

cmd_ext = 1;
cmd_desc = `tee --output-error=exit non-existent/file`;
makeTest();

// TEST #15 - tee --output-error=exit-nopipe non-existent/file
cmd_act = `node ${teeJS} --output-error=exit-nopipe non-existent/file`;
cmd_exp = teeShell && `${teeShell} --output-error=exit-nopipe non-existent/file`;
cmd_inp = 'test data';

cmd_out = `tee: non-existent/file: No such file or directory
`;

cmd_ext = 1;
cmd_desc = `tee --output-error=exit-nopipe non-existent/file`;
makeTest();

// TEST #16 - tee /dev/null non-existent/file /dev/null
cmd_act = `node ${teeJS} /dev/null non-existent/file /dev/null`;
cmd_exp = teeShell && `${teeShell} /dev/null non-existent/file /dev/null`;
cmd_inp = 'test data';

cmd_out = `test datatee: non-existent/file: No such file or directory
`;

cmd_ext = 1;
cmd_desc = `tee /dev/null non-existent/file /dev/null`;
 makeTest();

// TEST #17 - tee --output-error=warn /dev/null non-existent/file /dev/null
cmd_act = `node ${teeJS} --output-error=warn /dev/null non-existent/file /dev/null`;
cmd_exp = teeShell && `${teeShell} --output-error=warn /dev/null non-existent/file /dev/null`;
cmd_inp = 'test data';

cmd_out = `test datatee: non-existent/file: No such file or directory
`;

cmd_ext = 1;
cmd_desc = `tee --output-error=warn /dev/null non-existent/file /dev/null`;
makeTest();

// TEST #18 - tee --output-error=warn-nopipe /dev/null non-existent/file /dev/null
cmd_act = `node ${teeJS} --output-error=warn-nopipe /dev/null non-existent/file /dev/null`;
cmd_exp = teeShell && `${teeShell} --output-error=warn-nopipe /dev/null non-existent/file /dev/null`;
cmd_inp = 'test data';

cmd_out = `test datatee: non-existent/file: No such file or directory
`;

cmd_ext = 1;
cmd_desc = `tee --output-error=warn-nopipe /dev/null non-existent/file /dev/null`;
makeTest();

// TEST #19 - tee --output-error=exit /dev/null non-existent/file /dev/null
cmd_act = `node ${teeJS} --output-error=exit /dev/null non-existent/file /dev/null`;
cmd_exp = teeShell && `${teeShell} --output-error=exit /dev/null non-existent/file /dev/null`;
cmd_inp = 'test data';

cmd_out = `tee: non-existent/file: No such file or directory
`;

cmd_ext = 1;
cmd_desc = `tee --output-error=exit /dev/null non-existent/file /dev/null`;
makeTest();

// TEST #20 - tee --output-error=exit-nopipe /dev/null non-existent/file /dev/null
cmd_act = `node ${teeJS} --output-error=exit-nopipe /dev/null non-existent/file /dev/null`;
cmd_exp = teeShell && `${teeShell} --output-error=exit-nopipe /dev/null non-existent/file /dev/null`;
cmd_inp = 'test data';

cmd_out = `tee: non-existent/file: No such file or directory
`;

cmd_ext = 1;
cmd_desc = `tee --output-error=exit-nopipe /dev/null non-existent/file /dev/null`;
makeTest();

/*
 * suite 5 - test warn/error conditions of broken pipes
 */

// TEST #21 - tee | echo
cmd_act = `node ${teeJS} | echo`;
cmd_exp = teeShell && `${teeShell} | echo`;
cmd_inp = 'test data';

cmd_out = '\n';

cmd_ext = 0;
cmd_desc = `tee | echo`;
makeTest();

// TEST #22 - tee --output-error=warn | echo
cmd_act = `node ${teeJS} --output-error=warn | echo`;
cmd_exp = teeShell && `${teeShell} --output-error=warn | echo`;
cmd_inp = 'test data';

cmd_ext = 0;
cmd_out = `
tee: 'standard output': Broken pipe
`;

cmd_desc = `tee --output-error=warn | echo`;
makeTest();

// TEST #23 - tee --output-error=warn-nopipe | echo
cmd_act = `node ${teeJS} --output-error=warn-nopipe | echo`;
cmd_exp = teeShell && `${teeShell} --output-error=warn-nopipe | echo`;
cmd_inp = 'test data';

cmd_out = '\n';

cmd_ext = 0;
cmd_desc = `tee --output-error=warn-nopipe | echo`;
makeTest();

// TEST #24 - tee --output-error=exit | echo
cmd_act = `node ${teeJS} --output-error=exit | echo`;
cmd_exp = teeShell && `${teeShell} --output-error=exit | echo`;
cmd_inp = 'test data';

cmd_out = `
tee: 'standard output': Broken pipe
`;

cmd_ext = 0;
cmd_desc = `tee --output-error=exit | echo`;
makeTest();

// TEST #25 - tee --output-error=exit-nopipe | echo
cmd_act = `node ${teeJS} --output-error=exit-nopipe | echo`;
cmd_exp = teeShell && `${teeShell} --output-error=exit-nopipe | echo`;
cmd_inp = 'test data';

cmd_out = '\n';

cmd_ext = 0;
cmd_desc = `tee --output-error=exit-nopipe | echo`;
 makeTest();

/*
 * suite 6 - test warn/error conditions of output files and broken pipes
 */

// TEST #26 - tee /dev/null non-existent/file /dev/null | echo
cmd_act = `node ${teeJS} /dev/null non-existent/file /dev/null | echo`;
cmd_exp = teeShell && `${teeShell} /dev/null non-existent/file /dev/null | echo`;
cmd_inp = 'test data';

cmd_out = `
tee: non-existent/file: No such file or directory
`;

cmd_ext = 0;
cmd_desc = `tee /dev/null non-existent/file /dev/null | echo`;
 makeTest();

// TEST #27 - tee --output-error=warn /dev/null non-existent/file /dev/null | echo
cmd_act = `node ${teeJS} --output-error=warn /dev/null non-existent/file /dev/null | echo`;
cmd_exp = teeShell && `${teeShell} --output-error=warn /dev/null non-existent/file /dev/null | echo`;
cmd_inp = 'test data';

cmd_out = `
tee: non-existent/file: No such file or directory
tee: 'standard output': Broken pipe
`;

cmd_ext = 0;
cmd_desc = `tee --output-error=warn /dev/null non-existent/file /dev/null | echo`;
makeTest();

// TEST #28 - tee --output-error=warn-nopipe /dev/null non-existent/file /dev/null | echo
cmd_act = `node ${teeJS} --output-error=warn-nopipe /dev/null non-existent/file /dev/null | echo`;
cmd_exp = teeShell && `${teeShell} --output-error=warn-nopipe /dev/null non-existent/file /dev/null | echo`;
cmd_inp = 'test data';

cmd_out = `
tee: non-existent/file: No such file or directory
`;

cmd_ext = 0;
cmd_desc = `tee --output-error=warn-nopipe /dev/null non-existent/file /dev/null | echo`;
makeTest();

// TEST #29 - tee --output-error=exit /dev/null non-existent/file /dev/null | echo
cmd_act = `node ${teeJS} --output-error=exit /dev/null non-existent/file /dev/null | echo`;
cmd_exp = teeShell && `${teeShell} --output-error=exit /dev/null non-existent/file /dev/null | echo`;
cmd_inp = 'test data';

cmd_out = `
tee: non-existent/file: No such file or directory
`;

cmd_ext = 0;
cmd_desc = `tee --output-error=exit /dev/null non-existent/file /dev/null | echo`;
makeTest();

// TEST #30 - tee --output-error=exit-nopipe /dev/null non-existent/file /dev/null | echo
cmd_act = `node ${teeJS} --output-error=exit-nopipe /dev/null non-existent/file /dev/null | echo`;
cmd_exp = teeShell && `${teeShell} --output-error=exit-nopipe /dev/null non-existent/file /dev/null | echo`;
cmd_inp = 'test data';

cmd_out = `
tee: non-existent/file: No such file or directory
`;

cmd_ext = 0;
cmd_desc = `tee --output-error=exit-nopipe /dev/null non-existent/file /dev/null | echo`;
makeTest();

// Report on tests
cmdOptions.verbose && console.log();
cmdOptions.verbose && process.on('exit', () => {
	console.log();
	console.log('ℹ tests',       --testCount);
	console.log('ℹ suites',      1);
	console.log('ℹ pass',        pass);
	console.log('ℹ fail',        fail);
	console.log('ℹ cancelled',   cancel);
	console.log('ℹ skipped',     skip);
	console.log('ℹ todo',        todo);
	console.log('ℹ duration_ms', Math.round(Date.now() - startTime));
});

/*
 *     async function makeTest()
 * function getCmdOutput()
 * function parseCmdLine()
 * function getHelp()
 * function getError()
 */
async function makeTest(){

	let out_act, out_exp;
	let prc_act, prc_exp;

	const testID   = testCount++;
	const testDesc = cmd_desc;
	const testOut  = cmd_out;
	const testExit = cmd_ext;

	let preMsg = `Test#${(testID).toString().padStart(3, '0')} ... `;
	let postMsg = preMsg;

	preMsg += `Initiate ... ${testDesc}`;
	cmdOptions.verbose && console.error(preMsg);

	[out_act, out_exp, prc_act, prc_exp] = await getCmdOutput(cmd_act, cmd_exp, cmd_inp);

	if(out_exp === null) out_exp = testOut;
	if(prc_exp === null) prc_exp = {exitCode: testExit};

	if(!cmdOptions.verbose){

		assert.strictEqual(out_act, out_exp);
		assert.strictEqual(prc_act.exitCode, prc_exp.exitCode);

		return;
	}

	try{
		assert.strictEqual(out_act, out_exp);
		assert.strictEqual(prc_act.exitCode, prc_exp.exitCode);

		pass++;

		postMsg += `Success ... ${testDesc}`;
		cmdOptions.verbose && console.error(postMsg);
	}
	catch(e){
		fail++;

		postMsg += `Failure ... ${testDesc}`;
		cmdOptions.verbose && console.error(postMsg);
	}
}

/*
 * async function makeTest()
 *     function getCmdOutput()
 * function parseCmdLine()
 * function getHelp()
 * function getError()
 */
function getCmdOutput(cmd_1, cmd_2, input = ''){

	let proc_1, proc_2;

	let p1 = new Promise((resolve, reject) => {
		proc_1 = exec(cmd_1, {encoding: 'UTF-8'}, (err, stdout, stderr) => {
			resolve(stdout + stderr);
		});
		proc_1.stdin.write(input);
		proc_1.stdin.end();
	});

	if(cmd_2){
		let p2 = new Promise((resolve, reject) => {
			proc_2 = exec(cmd_2, {encoding: 'UTF-8'}, (err, stdout, stderr) => {
				resolve(stdout + stderr);
			});
			proc_2.stdin.write(input);
			proc_2.stdin.end();
		});

		return Promise.all([p1, p2, proc_1, proc_2]);
	}

	return Promise.all([p1, null, proc_1, null]);
}

/*
 * async function makeTest()
 * function getCmdOutput()
 *     function parseCmdLine()
 * function getHelp()
 * function getError()
 */
function parseCmdLine(){

	for(let i = 2; i < process.argv.length; i++){
		let opt = process.argv[i];

		if(opt.startsWith('--')){
			if(opt === '--help'){
				process.stdout.write(`${getHelp()}${os.EOL}`);
				process.exit(0);
			}
			else
			if(opt === '--verbose'){
				cmdOptions.verbose = true;
			}
			else
			if(opt === '--node'){
				cmdOptions.node = true;
			}
			else
			if(opt === '--default'){
				cmdOptions.node = false;
			}
			else{
				process.stderr.write(`${getError(0).replace('_', opt)}${os.EOL}`);
				process.exit(1);
			}
		}
		else
		if(opt.startsWith('-')){
			if(opt === '-h'){
				process.stdout.write(`${getHelp()}${os.EOL}`);
				process.exit(0);
			}
			else
			if(opt === '-v'){
				cmdOptions.verbose = true;
			}
			else
			if(opt === '-n'){
				cmdOptions.node = true;
			}
			else
			if(opt === '-d'){
				cmdOptions.node = false;
			}
			else{
				process.stderr.write(`${getError(1).replace('_', opt)}${os.EOL}`);
				process.exit(1);
			}
		}
		else{
			process.stderr.write(`${getError(1).replace('_', opt)}${os.EOL}`);
			process.exit(1);
		}
	}
}

/*
 * async function makeTest()
 * function getCmdOutput()
 * function parseCmdLine()
 *     function getHelp()
 * function getError()
 */
function getHelp(){
	return `\
Usage: ${CMD} [OPTIONS]...
Test the developed 'node-tee'.

With no options, testing will be done using nodejs test runner API if supported.

  -n  --node     use nodejs test runner API if supported
  -d  --def      use default test runner
  -v  --verbose  make the testing operation more talkative
  -h  --help     display this help and exit

'node-tee' was tested againts the GNU 'tee' command version 8.32.`;
}

/*
 * async function makeTest()
 * function getCmdOutput()
 * function parseCmdLine()
 * function getHelp()
 *     function getError()
 */
function getError(n){
const error = [
// error[0]
`\
${CMD}: invalid option -- '_'
Try '${CMD} --help' for more information.`,

// error[1]
`\
${CMD}: unrecognized option '_'
Try '${CMD} --help' for more information.`,

// error[2]
`${CMD}: option '_' requires an argument
Try '${CMD} --help' for more information.`,

// error[3]
`${CMD}: invalid argument ‘_’ for ‘_’
Try '${CMD} --help' for more information.`,
];

	return error[n];
}
