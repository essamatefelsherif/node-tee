import os                 from 'node:os';
import assert             from 'node:assert/strict';
import { exec, execSync } from 'node:child_process';
import { fileURLToPath }  from 'node:url';
import { dirname, join }  from 'node:path';

// command line options
const cmdOptions = {
	node    : true,  // -n --node / - d --def
	verbose : true,  // -v --verbose
};

parseCmdLine();

// test command
const CMD = 'tee';
const CMD_TEST = 'node-tee.test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const cmdNode = join(__dirname, '..', 'lib/node-tee.js');
const devNull = os.devNull;
const noOpCmd = 'echo -n';

let cmdShell = CMD;
let cmdVer = `\
tee (GNU coreutils) 8.32
Copyright (C) 2020 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Written by Mike Parker, Richard M. Stallman, and David MacKenzie.
`;
let cmdShellVer = cmdShell;

try{
	const ver = execSync(`${cmdShell} --version`, {encoding: 'UTF-8'});
	if(ver !== cmdVer)
		cmdShellVer = '';
}catch(e){
	cmdShell = '';
	cmdShellVer = '';
}

let testCount = 1;
let pass   = 0;
let fail   = 0;
let cancel = 0
let skip   = 0;
let todo   = 0;
let startTime = Date.now();

let cmd_act = '', cmd_exp = '';
let cmd_inp = '', cmd_out = '', cmd_err = '';
let cmd_ext = 0;
let cmd_desc = '';

/*
 * suite 1 - test common coreutils options
 */

// TEST #01 - tee --help
cmd_act = `node ${cmdNode} --help`;
cmd_exp = cmdShellVer && `${cmdShell} --help`;
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
cmd_err = '';

cmd_ext = 0;
cmd_desc = `${CMD} --help` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

// TEST #02 - tee --version
cmd_act = `node ${cmdNode} --version`;
cmd_exp = cmdShellVer && `${cmdShell} --version`;
cmd_inp = '';

cmd_out = `\
tee (GNU coreutils) 8.32
Copyright (C) 2020 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Written by Mike Parker, Richard M. Stallman, and David MacKenzie.
`;
cmd_err = '';

cmd_ext = 0;
cmd_desc = `${CMD} --version` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

// TEST #03 - tee --
cmd_act = `node ${cmdNode} --`;
cmd_exp = cmdShell && `${cmdShell} --`;
cmd_inp = '';

cmd_out = '';
cmd_err = '';

cmd_ext = 0;
cmd_desc = `${CMD} --` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

/*
 * suite 2 - validate command line arguments
 */

// TEST #04 - tee --xxx
cmd_act = `node ${cmdNode} --xxx`;
cmd_exp = cmdShellVer && `${cmdShell} --xxx`;
cmd_inp = '';

cmd_out = '';
cmd_err = `tee: unrecognized option '--xxx'
Try 'tee --help' for more information.\n`;

cmd_ext = 1;
cmd_desc = `${CMD} --xxx` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

// TEST #05 - tee --output-error=
cmd_act = `node ${cmdNode} --output-error=`;
cmd_exp = cmdShellVer && `${cmdShell} --output-error=`;
cmd_inp = '';

cmd_out = '';
cmd_err = `\
tee: ambiguous argument ‘’ for ‘--output-error’
Valid arguments are:
  - ‘warn’
  - ‘warn-nopipe’
  - ‘exit’
  - ‘exit-nopipe’
Try 'tee --help' for more information.\n`;

cmd_ext = 1;
cmd_desc = `${CMD} --output-error=` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

// TEST #06 - tee --output-error=xxx
cmd_act = `node ${cmdNode} --output-error=xxx`;
cmd_exp = cmdShellVer && `${cmdShell} --output-error=xxx`;
cmd_inp = '';

cmd_out = '';
cmd_err = `\
tee: invalid argument ‘xxx’ for ‘--output-error’
Valid arguments are:
  - ‘warn’
  - ‘warn-nopipe’
  - ‘exit’
  - ‘exit-nopipe’
Try 'tee --help' for more information.\n`;

cmd_ext = 1;
cmd_desc = `${CMD} --output-error=xxx` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

// TEST #07 - tee -x
cmd_act = `node ${cmdNode} -x`;
cmd_exp = cmdShellVer && `${cmdShell} -x`;
cmd_inp = '';

cmd_out = '';
cmd_err = `tee: invalid option -- 'x'
Try 'tee --help' for more information.\n`;

cmd_ext = 1;
cmd_desc = `${CMD} -x` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

/*
 * suite 3 - test normal operation
 */

// TEST #08 - tee
cmd_act = `node ${cmdNode}`;
cmd_exp = cmdShell && `${cmdShell}`;
cmd_inp = '';

cmd_out = '';
cmd_err = '';

cmd_ext = 0;
cmd_desc = `${CMD}` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

// TEST #09 - tee
cmd_act = `node ${cmdNode}`;
cmd_exp = cmdShell && `${cmdShell}`;
cmd_inp = '\x00\x01\x02\x03\x04';

cmd_out = `\x00\x01\x02\x03\x04`;
cmd_err = '';

cmd_ext = 0;
cmd_desc = `${CMD}` + ` << \\x00\\x01\\x02\\x03\\x04`;
makeTest();

// TEST #10 - tee
cmd_act = `node ${cmdNode}`;
cmd_exp = cmdShell && `${cmdShell}`;
cmd_inp = 'test data\nline 1\nline 2\x04\nline 3';

cmd_out = `test data
line 1
line 2\x04
line 3`;
cmd_err = '';

cmd_ext = 0;
cmd_desc = `${CMD}` + ` << test data\\nline 1\\nline 2\\x04\\nline 3`;
makeTest();

/*
 * suite 4 - test warn/error conditions of output files
 */

// TEST #11 - tee non-existent/file
cmd_act = `node ${cmdNode} non-existent/file`;
cmd_exp = cmdShell && `${cmdShell} non-existent/file`;
cmd_inp = 'test data';

cmd_out = `test data`;
cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmd_ext = 1;
cmd_desc = `${CMD} non-existent/file` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

// TEST #12 - tee --output-error=warn non-existent/file
cmd_act = `node ${cmdNode} --output-error=warn non-existent/file`;
cmd_exp = cmdShell && `${cmdShell} --output-error=warn non-existent/file`;
cmd_inp = 'test data';

cmd_out = `test data`;
cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmd_ext = 1;
cmd_desc = `${CMD} --output-error=warn non-existent/file` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

// TEST #13 - tee --output-error=warn-nopipe non-existent/file
cmd_act = `node ${cmdNode} --output-error=warn-nopipe non-existent/file`;
cmd_exp = cmdShell && `${cmdShell} --output-error=warn-nopipe non-existent/file`;
cmd_inp = 'test data';

cmd_out = `test data`;
cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmd_ext = 1;
cmd_desc = `${CMD} --output-error=warn-nopipe non-existent/file` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

// TEST #14 - tee --output-error=exit non-existent/file
cmd_act = `node ${cmdNode} --output-error=exit non-existent/file`;
cmd_exp = cmdShell && `${cmdShell} --output-error=exit non-existent/file`;
cmd_inp = 'test data';

cmd_out = ``;
cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmd_ext = 1;
cmd_desc = `${CMD} --output-error=exit non-existent/file` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

// TEST #15 - tee --output-error=exit-nopipe non-existent/file
cmd_act = `node ${cmdNode} --output-error=exit-nopipe non-existent/file`;
cmd_exp = cmdShell && `${cmdShell} --output-error=exit-nopipe non-existent/file`;
cmd_inp = 'test data';

cmd_out = ``;
cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmd_ext = 1;
cmd_desc = `${CMD} --output-error=exit-nopipe non-existent/file` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

// TEST #16 - tee /dev/null non-existent/file /dev/null
cmd_act = `node ${cmdNode} ${devNull} non-existent/file ${devNull}`;
cmd_exp = cmdShell && `${cmdShell} ${devNull} non-existent/file ${devNull}`;
cmd_inp = 'test data';

cmd_out = `test data`;
cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmd_ext = 1;
cmd_desc = `${CMD} ${devNull} non-existent/file ${devNull}` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

// TEST #17 - tee --output-error=warn /dev/null non-existent/file /dev/null
cmd_act = `node ${cmdNode} --output-error=warn ${devNull} non-existent/file ${devNull}`;
cmd_exp = cmdShell && `${cmdShell} --output-error=warn ${devNull} non-existent/file ${devNull}`;
cmd_inp = 'test data';

cmd_out = `test data`;
cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmd_ext = 1;
cmd_desc = `${CMD} --output-error=warn ${devNull} non-existent/file ${devNull}` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

// TEST #18 - tee --output-error=warn-nopipe /dev/null non-existent/file /dev/null
cmd_act = `node ${cmdNode} --output-error=warn-nopipe ${devNull} non-existent/file ${devNull}`;
cmd_exp = cmdShell && `${cmdShell} --output-error=warn-nopipe ${devNull} non-existent/file ${devNull}`;
cmd_inp = 'test data';

cmd_out = `test data`;
cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmd_ext = 1;
cmd_desc = `${CMD} --output-error=warn-nopipe ${devNull} non-existent/file ${devNull}` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

// TEST #19 - tee --output-error=exit /dev/null non-existent/file /dev/null
cmd_act = `node ${cmdNode} --output-error=exit ${devNull} non-existent/file ${devNull}`;
cmd_exp = cmdShell && `${cmdShell} --output-error=exit ${devNull} non-existent/file ${devNull}`;
cmd_inp = 'test data';

cmd_out = ``;
cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmd_ext = 1;
cmd_desc = `${CMD} --output-error=exit ${devNull} non-existent/file ${devNull}` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

// TEST #20 - tee --output-error=exit-nopipe /dev/null non-existent/file /dev/null
cmd_act = `node ${cmdNode} --output-error=exit-nopipe ${devNull} non-existent/file ${devNull}`;
cmd_exp = cmdShell && `${cmdShell} --output-error=exit-nopipe ${devNull} non-existent/file ${devNull}`;
cmd_inp = 'test data';

cmd_out = ``;
cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmd_ext = 1;
cmd_desc = `${CMD} --output-error=exit-nopipe ${devNull} non-existent/file ${devNull}` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

/*
 * suite 5 - test warn/error conditions of broken pipes
 */

// TEST #21 - tee | noOpCmd
cmd_act = `node ${cmdNode} | ${noOpCmd}`;
cmd_exp = cmdShell && `${cmdShell} | ${noOpCmd}`;
cmd_inp = 'test data';

cmd_out = ``;
cmd_err = ``;

cmd_ext = 0;
cmd_desc = `${CMD} | ${noOpCmd}` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

// TEST #22 - tee --output-error=warn | noOpCmd
cmd_act = `node ${cmdNode} --output-error=warn | ${noOpCmd}`;
cmd_exp = cmdShell && `${cmdShell} --output-error=warn | ${noOpCmd}`;
cmd_inp = 'test data';

cmd_out = '';
cmd_err = `tee: 'standard output': Broken pipe\n`;

cmd_ext = 0;
cmd_desc = `${CMD} --output-error=warn | ${noOpCmd}` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

// TEST #23 - tee --output-error=warn-nopipe | noOpCmd
cmd_act = `node ${cmdNode} --output-error=warn-nopipe | ${noOpCmd}`;
cmd_exp = cmdShell && `${cmdShell} --output-error=warn-nopipe | ${noOpCmd}`;
cmd_inp = 'test data';

cmd_out = ``;
cmd_err = ``;

cmd_ext = 0;
cmd_desc = `${CMD} --output-error=warn-nopipe | ${noOpCmd}` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

// TEST #24 - tee --output-error=exit | noOpCmd
cmd_act = `node ${cmdNode} --output-error=exit | ${noOpCmd}`;
cmd_exp = cmdShell && `${cmdShell} --output-error=exit | ${noOpCmd}`;
cmd_inp = 'test data';

cmd_out = ``;
cmd_err = `tee: 'standard output': Broken pipe\n`;

cmd_ext = 0;
cmd_desc = `${CMD} --output-error=exit | ${noOpCmd}` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

// TEST #25 - tee --output-error=exit-nopipe | noOpCmd
cmd_act = `node ${cmdNode} --output-error=exit-nopipe | ${noOpCmd}`;
cmd_exp = cmdShell && `${cmdShell} --output-error=exit-nopipe | ${noOpCmd}`;
cmd_inp = 'test data';

cmd_out = ``;
cmd_err = ``;

cmd_ext = 0;
cmd_desc = `${CMD} --output-error=exit-nopipe | ${noOpCmd}` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

/*
 * suite 6 - test warn/error conditions of output files and broken pipes
 */

// TEST #26 - tee /dev/null non-existent/file /dev/null | noOpCmd
cmd_act = `node ${cmdNode} ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
cmd_exp = cmdShell && `${cmdShell} ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
cmd_inp = 'test data';

cmd_out = ``;
cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmd_ext = 0;
cmd_desc = `${CMD} ${devNull} non-existent/file ${devNull} | ${noOpCmd}` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

// TEST #27 - tee --output-error=warn /dev/null non-existent/file /dev/null | noOpCmd
cmd_act = `node ${cmdNode} --output-error=warn ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
cmd_exp = cmdShell && `${cmdShell} --output-error=warn ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
cmd_inp = 'test data';

cmd_out = '';
cmd_err = `\
tee: non-existent/file: No such file or directory
tee: 'standard output': Broken pipe\n`;

cmd_ext = 0;
cmd_desc = `${CMD} --output-error=warn ${devNull} non-existent/file ${devNull} | ${noOpCmd}` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

// TEST #28 - tee --output-error=warn-nopipe /dev/null non-existent/file /dev/null | noOpCmd
cmd_act = `node ${cmdNode} --output-error=warn-nopipe ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
cmd_exp = cmdShell && `${cmdShell} --output-error=warn-nopipe ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
cmd_inp = 'test data';

cmd_out = ``;
cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmd_ext = 0;
cmd_desc = `${CMD} --output-error=warn-nopipe ${devNull} non-existent/file ${devNull} | ${noOpCmd}` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

// TEST #29 - tee --output-error=exit /dev/null non-existent/file /dev/null | noOpCmd
cmd_act = `node ${cmdNode} --output-error=exit ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
cmd_exp = cmdShell && `${cmdShell} --output-error=exit ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
cmd_inp = 'test data';

cmd_out = ``;
cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmd_ext = 0;
cmd_desc = `${CMD} --output-error=exit ${devNull} non-existent/file ${devNull} | ${noOpCmd}` + (cmd_inp && ` << ${cmd_inp}`);
makeTest();

// TEST #30 - tee --output-error=exit-nopipe /dev/null non-existent/file /dev/null | noOpCmd
cmd_act = `node ${cmdNode} --output-error=exit-nopipe ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
cmd_exp = cmdShell && `${cmdShell} --output-error=exit-nopipe ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
cmd_inp = 'test data';

cmd_out = ``;
cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmd_ext = 0;
cmd_desc = `${CMD} --output-error=exit-nopipe ${devNull} non-existent/file ${devNull} | ${noOpCmd}` + (cmd_inp && ` << ${cmd_inp}`);
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
	const testErr  = cmd_err;
	const testExit = cmd_ext;

	let preMsg = `Test#${(testID).toString().padStart(3, '0')} ... `;
	let postMsg = preMsg;

	preMsg += `Initiate ... ${testDesc}`;
	cmdOptions.verbose && console.error(preMsg);

	[out_act, out_exp, prc_act, prc_exp] = await getCmdOutput(cmd_act, cmd_exp, cmd_inp);

	if(out_exp === null) out_exp = {stdout: testOut, stderr: testErr};
	if(prc_exp === null) prc_exp = {exitCode: testExit};

	if(!cmdOptions.verbose){

		assert.strictEqual(out_act.stdout, out_exp.stdout);
		assert.strictEqual(out_act.stderr, out_exp.stderr);
		assert.strictEqual(prc_act.exitCode, prc_exp.exitCode);

		return;
	}

	try{
		assert.strictEqual(out_act.stdout, out_exp.stdout);
		assert.strictEqual(out_act.stderr, out_exp.stderr);
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
function getCmdOutput(cmd_act, cmd_exp, cmd_inp = ''){

	let proc_act, proc_exp;

	let prom_act = new Promise((resolve, reject) => {
		proc_act = exec(cmd_act, {encoding: 'UTF-8'}, (err, stdout, stderr) => {
			resolve({stdout, stderr});
		});
		proc_act.stdin.write(cmd_inp);
		proc_act.stdin.end();
	});

	if(cmd_exp){
		let prom_exp = new Promise((resolve, reject) => {
			proc_exp = exec(cmd_exp, {encoding: 'UTF-8'}, (err, stdout, stderr) => {
				resolve({stdout, stderr});
			});
			proc_exp.stdin.write(cmd_inp);
			proc_exp.stdin.end();
		});

		return Promise.all([prom_act, prom_exp, proc_act, proc_exp]);
	}

	return Promise.all([prom_act, null, proc_act, null]);
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
Usage: ${CMD_TEST} [OPTIONS]...
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
${CMD_TEST}: invalid option -- '_'
Try '${CMD_TEST} --help' for more information.`,

// error[1]
`\
${CMD_TEST}: unrecognized option '_'
Try '${CMD_TEST} --help' for more information.`,

// error[2]
`${CMD_TEST}: option '_' requires an argument
Try '${CMD_TEST} --help' for more information.`,

// error[3]
`${CMD_TEST}: invalid argument ‘_’ for ‘_’
Try '${CMD_TEST} --help' for more information.`,
];

	return error[n];
}
