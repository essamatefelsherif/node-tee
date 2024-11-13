/*
 * tee (GNU coreutils) 8.32
 * Copyright (C) 2020 Free Software Foundation, Inc.
 * License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>.
 * This is free software: you are free to change and redistribute it.
 * There is NO WARRANTY, to the extent permitted by law.
 *
 * Written by Mike Parker, Richard M. Stallman, and David MacKenzie.
 */

// Import nodeJS core modules
import os                 from 'node:os';
import assert             from 'node:assert/strict';
import { exec, execSync } from 'node:child_process';
import { fileURLToPath }  from 'node:url';
import { dirname, join }  from 'node:path';

// Define the coreutils command
const CMD_SHELL = 'tee';
const CMD_NODE = 'node-tee';
const CMD_NODE_TEST = 'node-tee-test';

// Command line options
const cmdOptions = {
	node    : true,  // -n --node / - d --def
	verbose : false, // -v --verbose
};

// Handle command line options
parseCmdLine();

// Prepare test data
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const cmdNode = join(__dirname, '..', 'lib/node-tee.js');
const devNull = os.devNull;
const noOpCmd = 'echo -n';

let cmdShell = CMD_SHELL;
let cmdShellVer = cmdShell;

let cmdVer = `\
tee (GNU coreutils) 8.32
Copyright (C) 2020 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Written by Mike Parker, Richard M. Stallman, and David MacKenzie.
`;

// Verify existance of the command core utility and test its version
try{
	const ver = execSync(`${cmdShell} --version`, {encoding: 'UTF-8'});
	if(ver !== cmdVer)
		cmdShellVer = '';
}catch(e){
	cmdShell = '';
	cmdShellVer = '';
}

// Initialize test report parameters
let testCount = 1;
let suites = 0;
let pass   = 0;
let fail   = 0;
let cancel = 0
let skip   = 0;
let todo   = 0;
let startTime = Date.now();

const testData = [];
const testSuites = [];
let cmdData = null;

// TEST SUITE #1 - test common coreutils options
testSuites.push('test common coreutils options');
suites++;

// TEST #01 - tee --help
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} --help`;
cmdData.cmd_exp = cmdShellVer && `${cmdShell} --help`;
cmdData.cmd_inp = '';

cmdData.cmd_out = `\
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
cmdData.cmd_err = '';

cmdData.cmd_ext = 0;
cmdData.cmd_desc = `${CMD_NODE} --help` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST #02 - tee --version
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} --version`;
cmdData.cmd_exp = cmdShellVer && `${cmdShell} --version`;
cmdData.cmd_inp = '';

cmdData.cmd_out = `\
tee (GNU coreutils) 8.32
Copyright (C) 2020 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Written by Mike Parker, Richard M. Stallman, and David MacKenzie.
`;
cmdData.cmd_err = '';

cmdData.cmd_ext = 0;
cmdData.cmd_desc = `${CMD_NODE} --version` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST #03 - tee --
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} --`;
cmdData.cmd_exp = cmdShell && `${cmdShell} --`;
cmdData.cmd_inp = '';

cmdData.cmd_out = '';
cmdData.cmd_err = '';

cmdData.cmd_ext = 0;
cmdData.cmd_desc = `${CMD_NODE} --` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST SUITE #2 - validate command line arguments
testSuites.push('validate command line arguments');
suites++;

// TEST #04 - tee --xxx
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} --xxx`;
cmdData.cmd_exp = cmdShellVer && `${cmdShell} --xxx`;
cmdData.cmd_inp = '';

cmdData.cmd_out = '';
cmdData.cmd_err = `tee: unrecognized option '--xxx'
Try 'tee --help' for more information.\n`;

cmdData.cmd_ext = 1;
cmdData.cmd_desc = `${CMD_NODE} --xxx` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST #05 - tee --output-error=
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} --output-error=`;
cmdData.cmd_exp = cmdShellVer && `${cmdShell} --output-error=`;
cmdData.cmd_inp = '';

cmdData.cmd_out = '';
cmdData.cmd_err = `\
tee: ambiguous argument ‘’ for ‘--output-error’
Valid arguments are:
  - ‘warn’
  - ‘warn-nopipe’
  - ‘exit’
  - ‘exit-nopipe’
Try 'tee --help' for more information.\n`;

cmdData.cmd_ext = 1;
cmdData.cmd_desc = `${CMD_NODE} --output-error=` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST #06 - tee --output-error=xxx
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} --output-error=xxx`;
cmdData.cmd_exp = cmdShellVer && `${cmdShell} --output-error=xxx`;
cmdData.cmd_inp = '';

cmdData.cmd_out = '';
cmdData.cmd_err = `\
tee: invalid argument ‘xxx’ for ‘--output-error’
Valid arguments are:
  - ‘warn’
  - ‘warn-nopipe’
  - ‘exit’
  - ‘exit-nopipe’
Try 'tee --help' for more information.\n`;

cmdData.cmd_ext = 1;
cmdData.cmd_desc = `${CMD_NODE} --output-error=xxx` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST #07 - tee -x
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} -x`;
cmdData.cmd_exp = cmdShellVer && `${cmdShell} -x`;
cmdData.cmd_inp = '';

cmdData.cmd_out = '';
cmdData.cmd_err = `tee: invalid option -- 'x'
Try 'tee --help' for more information.\n`;

cmdData.cmd_ext = 1;
cmdData.cmd_desc = `${CMD_NODE} -x` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST SUITE #3 - test normal operation
testSuites.push('test normal operation');
suites++;

// TEST #08 - tee
cmdData = {};

cmdData.cmd_act = `node ${cmdNode}`;
cmdData.cmd_exp = cmdShell && `${cmdShell}`;
cmdData.cmd_inp = '';

cmdData.cmd_out = '';
cmdData.cmd_err = '';

cmdData.cmd_ext = 0;
cmdData.cmd_desc = `${CMD_NODE}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST #09 - tee
cmdData = {};

cmdData.cmd_act = `node ${cmdNode}`;
cmdData.cmd_exp = cmdShell && `${cmdShell}`;
cmdData.cmd_inp = '\x00\x01\x02\x03\x04';

cmdData.cmd_out = `\x00\x01\x02\x03\x04`;
cmdData.cmd_err = '';

cmdData.cmd_ext = 0;
cmdData.cmd_desc = `${CMD_NODE}` + ` << \\x00\\x01\\x02\\x03\\x04`;

testData.push(cmdData);

// TEST #10 - tee
cmdData = {};

cmdData.cmd_act = `node ${cmdNode}`;
cmdData.cmd_exp = cmdShell && `${cmdShell}`;
cmdData.cmd_inp = 'test data\nline 1\nline 2\x04\nline 3';

cmdData.cmd_out = `test data
line 1
line 2\x04
line 3`;
cmdData.cmd_err = '';

cmdData.cmd_ext = 0;
cmdData.cmd_desc = `${CMD_NODE}` + ` << test data\\nline 1\\nline 2\\x04\\nline 3`;

testData.push(cmdData);

// TEST SUITE #4 - test warn/error conditions of output files
testSuites.push('test warn/error conditions of output files');
suites++;

// TEST #11 - tee non-existent/file
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} non-existent/file`;
cmdData.cmd_exp = cmdShell && `${cmdShell} non-existent/file`;
cmdData.cmd_inp = 'test data';

cmdData.cmd_out = `test data`;
cmdData.cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmdData.cmd_ext = 1;
cmdData.cmd_desc = `${CMD_NODE} non-existent/file` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST #12 - tee --output-error=warn non-existent/file
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} --output-error=warn non-existent/file`;
cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=warn non-existent/file`;
cmdData.cmd_inp = 'test data';

cmdData.cmd_out = `test data`;
cmdData.cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmdData.cmd_ext = 1;
cmdData.cmd_desc = `${CMD_NODE} --output-error=warn non-existent/file` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST #13 - tee --output-error=warn-nopipe non-existent/file
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} --output-error=warn-nopipe non-existent/file`;
cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=warn-nopipe non-existent/file`;
cmdData.cmd_inp = 'test data';

cmdData.cmd_out = `test data`;
cmdData.cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmdData.cmd_ext = 1;
cmdData.cmd_desc = `${CMD_NODE} --output-error=warn-nopipe non-existent/file` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST #14 - tee --output-error=exit non-existent/file
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} --output-error=exit non-existent/file`;
cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=exit non-existent/file`;
cmdData.cmd_inp = 'test data';

cmdData.cmd_out = ``;
cmdData.cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmdData.cmd_ext = 1;
cmdData.cmd_desc = `${CMD_NODE} --output-error=exit non-existent/file` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST #15 - tee --output-error=exit-nopipe non-existent/file
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} --output-error=exit-nopipe non-existent/file`;
cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=exit-nopipe non-existent/file`;
cmdData.cmd_inp = 'test data';

cmdData.cmd_out = ``;
cmdData.cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmdData.cmd_ext = 1;
cmdData.cmd_desc = `${CMD_NODE} --output-error=exit-nopipe non-existent/file` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST #16 - tee /dev/null non-existent/file /dev/null
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} ${devNull} non-existent/file ${devNull}`;
cmdData.cmd_exp = cmdShell && `${cmdShell} ${devNull} non-existent/file ${devNull}`;
cmdData.cmd_inp = 'test data';

cmdData.cmd_out = `test data`;
cmdData.cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmdData.cmd_ext = 1;
cmdData.cmd_desc = `${CMD_NODE} ${devNull} non-existent/file ${devNull}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST #17 - tee --output-error=warn /dev/null non-existent/file /dev/null
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} --output-error=warn ${devNull} non-existent/file ${devNull}`;
cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=warn ${devNull} non-existent/file ${devNull}`;
cmdData.cmd_inp = 'test data';

cmdData.cmd_out = `test data`;
cmdData.cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmdData.cmd_ext = 1;
cmdData.cmd_desc = `${CMD_NODE} --output-error=warn ${devNull} non-existent/file ${devNull}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST #18 - tee --output-error=warn-nopipe /dev/null non-existent/file /dev/null
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} --output-error=warn-nopipe ${devNull} non-existent/file ${devNull}`;
cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=warn-nopipe ${devNull} non-existent/file ${devNull}`;
cmdData.cmd_inp = 'test data';

cmdData.cmd_out = `test data`;
cmdData.cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmdData.cmd_ext = 1;
cmdData.cmd_desc = `${CMD_NODE} --output-error=warn-nopipe ${devNull} non-existent/file ${devNull}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST #19 - tee --output-error=exit /dev/null non-existent/file /dev/null
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} --output-error=exit ${devNull} non-existent/file ${devNull}`;
cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=exit ${devNull} non-existent/file ${devNull}`;
cmdData.cmd_inp = 'test data';

cmdData.cmd_out = ``;
cmdData.cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmdData.cmd_ext = 1;
cmdData.cmd_desc = `${CMD_NODE} --output-error=exit ${devNull} non-existent/file ${devNull}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST #20 - tee --output-error=exit-nopipe /dev/null non-existent/file /dev/null
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} --output-error=exit-nopipe ${devNull} non-existent/file ${devNull}`;
cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=exit-nopipe ${devNull} non-existent/file ${devNull}`;
cmdData.cmd_inp = 'test data';

cmdData.cmd_out = ``;
cmdData.cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmdData.cmd_ext = 1;
cmdData.cmd_desc = `${CMD_NODE} --output-error=exit-nopipe ${devNull} non-existent/file ${devNull}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST SUITE #5 - test warn/error conditions of broken pipes
testSuites.push('test warn/error conditions of broken pipes');
suites++;

// TEST #21 - tee | noOpCmd
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} | ${noOpCmd}`;
cmdData.cmd_exp = cmdShell && `${cmdShell} | ${noOpCmd}`;
cmdData.cmd_inp = 'test data';

cmdData.cmd_out = ``;
cmdData.cmd_err = ``;

cmdData.cmd_ext = 0;
cmdData.cmd_desc = `${CMD_NODE} | ${noOpCmd}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST #22 - tee --output-error=warn | noOpCmd
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} --output-error=warn | ${noOpCmd}`;
cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=warn | ${noOpCmd}`;
cmdData.cmd_inp = 'test data';

cmdData.cmd_out = '';
cmdData.cmd_err = `tee: 'standard output': Broken pipe\n`;

cmdData.cmd_ext = 0;
cmdData.cmd_desc = `${CMD_NODE} --output-error=warn | ${noOpCmd}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST #23 - tee --output-error=warn-nopipe | noOpCmd
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} --output-error=warn-nopipe | ${noOpCmd}`;
cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=warn-nopipe | ${noOpCmd}`;
cmdData.cmd_inp = 'test data';

cmdData.cmd_out = ``;
cmdData.cmd_err = ``;

cmdData.cmd_ext = 0;
cmdData.cmd_desc = `${CMD_NODE} --output-error=warn-nopipe | ${noOpCmd}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST #24 - tee --output-error=exit | noOpCmd
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} --output-error=exit | ${noOpCmd}`;
cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=exit | ${noOpCmd}`;
cmdData.cmd_inp = 'test data';

cmdData.cmd_out = ``;
cmdData.cmd_err = `tee: 'standard output': Broken pipe\n`;

cmdData.cmd_ext = 0;
cmdData.cmd_desc = `${CMD_NODE} --output-error=exit | ${noOpCmd}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST #25 - tee --output-error=exit-nopipe | noOpCmd
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} --output-error=exit-nopipe | ${noOpCmd}`;
cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=exit-nopipe | ${noOpCmd}`;
cmdData.cmd_inp = 'test data';

cmdData.cmd_out = ``;
cmdData.cmd_err = ``;

cmdData.cmd_ext = 0;
cmdData.cmd_desc = `${CMD_NODE} --output-error=exit-nopipe | ${noOpCmd}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST SUITE #6 - test warn/error conditions of output files and broken pipes
testSuites.push('test warn/error conditions of output files and broken pipes');
suites++;

// TEST #26 - tee /dev/null non-existent/file /dev/null | noOpCmd
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
cmdData.cmd_exp = cmdShell && `${cmdShell} ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
cmdData.cmd_inp = 'test data';

cmdData.cmd_out = ``;
cmdData.cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmdData.cmd_ext = 0;
cmdData.cmd_desc = `${CMD_NODE} ${devNull} non-existent/file ${devNull} | ${noOpCmd}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST #27 - tee --output-error=warn /dev/null non-existent/file /dev/null | noOpCmd
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} --output-error=warn ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=warn ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
cmdData.cmd_inp = 'test data';

cmdData.cmd_out = '';
cmdData.cmd_err = `\
tee: non-existent/file: No such file or directory
tee: 'standard output': Broken pipe\n`;

cmdData.cmd_ext = 0;
cmdData.cmd_desc = `${CMD_NODE} --output-error=warn ${devNull} non-existent/file ${devNull} | ${noOpCmd}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST #28 - tee --output-error=warn-nopipe /dev/null non-existent/file /dev/null | noOpCmd
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} --output-error=warn-nopipe ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=warn-nopipe ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
cmdData.cmd_inp = 'test data';

cmdData.cmd_out = ``;
cmdData.cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmdData.cmd_ext = 0;
cmdData.cmd_desc = `${CMD_NODE} --output-error=warn-nopipe ${devNull} non-existent/file ${devNull} | ${noOpCmd}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST #29 - tee --output-error=exit /dev/null non-existent/file /dev/null | noOpCmd
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} --output-error=exit ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=exit ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
cmdData.cmd_inp = 'test data';

cmdData.cmd_out = ``;
cmdData.cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmdData.cmd_ext = 0;
cmdData.cmd_desc = `${CMD_NODE} --output-error=exit ${devNull} non-existent/file ${devNull} | ${noOpCmd}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// TEST #30 - tee --output-error=exit-nopipe /dev/null non-existent/file /dev/null | noOpCmd
cmdData = {};

cmdData.cmd_act = `node ${cmdNode} --output-error=exit-nopipe ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=exit-nopipe ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
cmdData.cmd_inp = 'test data';

cmdData.cmd_out = ``;
cmdData.cmd_err = `tee: non-existent/file: No such file or directory\n`;

cmdData.cmd_ext = 0;
cmdData.cmd_desc = `${CMD_NODE} --output-error=exit-nopipe ${devNull} non-existent/file ${devNull} | ${noOpCmd}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

testData.push(cmdData);

// Call the chosen test runner
if(!cmdOptions.node){
	defRunner();
}
else{
	import('node:test')
		.then(runner => {
			cmdOptions.verbose = false;
			nodeRunner(runner);
		})
		.catch(() => {
			defRunner();
		});
}

/*
 *     function nodeRunner()
 * function defRunner()
 * async function makeTest()
 * function getCmdOutput()
 * function parseCmdLine()
 * function getHelp()
 * function getError()
 */
function nodeRunner(runner){

		// TEST SUITE #1 - test #01 - #03
		runner.describe(testSuites[0], (t) => {
			for(let i = 0; i < 3; i++){
				runner.test(testData[i].cmd_desc, () => {
					makeTest(testData[i]);
				});
			}
		});

		// TEST SUITE #2 - test #04 - #07
		runner.describe(testSuites[1], (t) => {
			for(let i = 3; i < 7; i++){
				runner.test(testData[i].cmd_desc, () => {
					makeTest(testData[i]);
				});
			}
		});

		// TEST SUITE #3 - test #08 - #10
		runner.describe(testSuites[2], (t) => {
			for(let i = 7; i < 10; i++){
				runner.test(testData[i].cmd_desc, () => {
					makeTest(testData[i]);
				});
			}
		});

		// TEST SUITE #4 - test #11 - #20
		runner.describe(testSuites[3], (t) => {
			for(let i = 10; i < 20; i++){
				runner.test(testData[i].cmd_desc, () => {
					makeTest(testData[i]);
				});
			}
		});

		// TEST SUITE #5 - test #21 - #25
		runner.describe(testSuites[4], (t) => {
			for(let i = 20; i < 25; i++){
				runner.test(testData[i].cmd_desc, () => {
					makeTest(testData[i]);
				});
			}
		});

		// TEST SUITE #6 - test #26 - #30
		runner.describe(testSuites[5], (t) => {
			for(let i = 25; i < 30; i++){
				runner.test(testData[i].cmd_desc, () => {
					makeTest(testData[i]);
				});
			}
		});
}

/*
 * function nodeRunner()
 *     function defRunner()
 * async function makeTest()
 * function getCmdOutput()
 * function parseCmdLine()
 * function getHelp()
 * function getError()
 */
function defRunner(){

	cmdOptions.verbose && process.on('exit', () => {
		console.log();
		console.log('▸ tests',       --testCount);
		console.log('▸ suites',      suites);
		console.log('▸ pass',        pass);
		console.log('▸ fail',        fail);
		console.log('▸ cancelled',   cancel);
		console.log('▸ skipped',     skip);
		console.log('▸ todo',        todo);
		console.log('▸ duration_ms', Math.round(Date.now() - startTime));
	});

	cmdOptions.verbose && console.error();
	testData.forEach(obj => makeTest(obj));
	cmdOptions.verbose && console.log();
}

/*
 * function nodeRunner()
 * function defRunner()
 *     async function makeTest()
 * function getCmdOutput()
 * function parseCmdLine()
 * function getHelp()
 * function getError()
 */
async function makeTest(obj){

	let out_act, out_exp;
	let prc_act, prc_exp;

	const testID   = testCount++;
	const testDesc = obj.cmd_desc;
	const testOut  = obj.cmd_out;
	const testErr  = obj.cmd_err;
	const testExit = obj.cmd_ext;

	let preMsg = `Test#${(testID).toString().padStart(3, '0')} ... `;
	let postMsg = preMsg;

	preMsg += `Initiate ... ${testDesc}`;
	cmdOptions.verbose && console.error(preMsg);

	[out_act, out_exp, prc_act, prc_exp] = await getCmdOutput(obj.cmd_act, obj.cmd_exp, obj.cmd_inp);

	out_act.stderr = out_act.stderr.replace(new RegExp(CMD_NODE, 'g'), CMD_SHELL);

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
 * function nodeRunner()
 * function defRunner()
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
		proc_act.stdin.write(cmdData.cmd_inp);
		proc_act.stdin.end();
	});

	if(cmd_exp){
		let prom_exp = new Promise((resolve, reject) => {
			proc_exp = exec(cmd_exp, {encoding: 'UTF-8'}, (err, stdout, stderr) => {
				resolve({stdout, stderr});
			});
			proc_exp.stdin.write(cmdData.cmd_inp);
			proc_exp.stdin.end();
		});

		return Promise.all([prom_act, prom_exp, proc_act, proc_exp]);
	}

	return Promise.all([prom_act, null, proc_act, null]);
}

/*
 * function nodeRunner()
 * function defRunner()
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
				process.stdout.write(`${getHelp()}`);
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
				process.stderr.write(`${getError(0).replace('_', opt.substring(2))}\n`);
				process.exit(1);
			}
		}
		else
		if(opt.startsWith('-')){
			if(opt === '-h'){
				process.stdout.write(`${getHelp()}`);
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
				process.stderr.write(`${getError(1).replace('_', opt)}\n`);
				process.exit(1);
			}
		}
		else{
			process.stderr.write(`${getError(1).replace('_', opt)}\n`);
			process.exit(1);
		}
	}
}

/*
 * function nodeRunner()
 * function defRunner()
 * async function makeTest()
 * function getCmdOutput()
 * function parseCmdLine()
 *     function getHelp()
 * function getError()
 */
function getHelp(){
	return `\
Usage: ${CMD_NODE_TEST} [OPTIONS]...
Test the developed 'node-tee'.

With no options, testing will be done using nodejs test runner API if supported.

  -n  --node     use nodejs test runner API if supported
  -d  --def      use default test runner
  -v  --verbose  make the testing operation more talkative
  -h  --help     display this help and exit

'node-tee' was tested againts the GNU 'tee' command version 8.32.
`;
}

/*
 * function nodeRunner()
 * function defRunner()
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
${CMD_NODE_TEST}: invalid option -- '_'
Try '${CMD_NODE_TEST} --help' for more information.`,

// error[1]
`\
${CMD_NODE_TEST}: unrecognized option '_'
Try '${CMD_NODE_TEST} --help' for more information.`,

// error[2]
`${CMD_NODE_TEST}: option '_' requires an argument
Try '${CMD_NODE_TEST} --help' for more information.`,

// error[3]
`${CMD_NODE_TEST}: invalid argument ‘_’ for ‘_’
Try '${CMD_NODE_TEST} --help' for more information.`,
];

	return error[n];
}
