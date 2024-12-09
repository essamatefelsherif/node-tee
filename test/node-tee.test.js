/**
 * tee (GNU coreutils) 8.32
 * Copyright (C) 2020 Free Software Foundation, Inc.
 * License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>.
 * This is free software: you are free to change and redistribute it.
 * There is NO WARRANTY, to the extent permitted by law.
 *
 * Written by Mike Parker, Richard M. Stallman, and David MacKenzie.
 *
 * Implemented in node.js by Essam A. El-Sherif.
 *
 * @module  node-tee.test
 * @desc    Testing module for 'node-tee' core utility.
 * @version 1.0.1
 * @author  Essam A. El-Sherif
 */

/** Import nodeJS core modules */
import os                 from 'node:os';
import process            from 'node:process';
import assert             from 'node:assert/strict';
import fs                 from 'node:fs';
import { exec, execSync } from 'node:child_process';
import { fileURLToPath }  from 'node:url';
import { dirname, join }  from 'node:path';

/** @const {string} CMD_SHELL - The coreutils shell command */
const CMD_SHELL = 'tee';

/** @const {string} CMD_NODE - The coreutils node command */
const CMD_NODE = 'node-tee';

/** @const {string} CMD_NODE_TEST - The coreutils node testing command */
const CMD_NODE_TEST = 'node-tee-test';

/** Emulate commonJS __filename and __dirname constants */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** Prepare test environment */
const cmdNode = join(__dirname, '..', 'lib/node-tee.js');
const cmdNodeTest = join(__dirname, '..', 'test/node-tee.test.js');

let cmdShell = CMD_SHELL;
let cmdShellVer = cmdShell;

const devNull = os.devNull;
const tmpDir  = os.tmpdir();
const noOpCmd = 'exit';

let testCount   = 1;
let passCount   = 0;
let failCount   = 0;
let cancelCount = 0
let skipCount   = 0;
let todoCount   = 0;
let startTime = Date.now();

const suites = new Map();

/** @const {object} cmdOptions - Command line arguments */
const cmdOptions = {
	node    : true,  // -n --node / - d --def
	verbose : false, // -v --verbose
};

/**
 *     function main()
 * function verifyShellCmd()
 * function loadTestData()
 * function nodeRunner()
 * function defRunner()
 * async function makeTest()
 * function getCmdOutput()
 * function parseCmdLine()
 * function getHelp()
 * function getError()
 *
 * @func Main
 * @desc The application entry point function
 */
(() => {
	parseCmdLine();

	if(process.env['NODE_TEE_TEST']){
		process.stdout.write(JSON.stringify(cmdOptions));
	}
	else{
		verifyShellCmd();
		loadTestData();

		if(cmdOptions.node){

			import('node:test')
				.then(runner => {
					cmdOptions.verbose = false;
					nodeRunner(runner);
				})
				/* node:coverage disable */
				.catch((e) => {
					defRunner();
				});
		}
		else{
			defRunner();
		}
	}
	/* node:coverage enable */
})('Main Function');

/**
 * function main()
 *     function verifyShellCmd()
 * function loadTestData()
 * function nodeRunner()
 * function defRunner()
 * async function makeTest()
 * function getCmdOutput()
 * function parseCmdLine()
 * function getHelp()
 * function getError()
 *
 * @func verifyShellCmd
 * @desc Verify existance of the core utility command and test its version
 */
function verifyShellCmd(){

let cmdVer = `\
tee (GNU coreutils) 8.32
Copyright (C) 2020 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Written by Mike Parker, Richard M. Stallman, and David MacKenzie.
`;
	try{
		const ver = execSync(`${cmdShell} --version`, {encoding: 'UTF-8'});
		if(ver !== cmdVer)
			cmdShellVer = '';
	}
	/* node:coverage disable */
	catch(e){
		cmdShell = '';
		cmdShellVer = '';
	}
	/* node:coverage enable */
}

/**
 * function main()
 * function verifyShellCmd()
 *     function loadTestData()
 * function nodeRunner()
 * function defRunner()
 * async function makeTest()
 * function getCmdOutput()
 * function parseCmdLine()
 * function getHelp()
 * function getError()
 *
 * @func loadTestData
 * @desc Load test data
 */
function loadTestData(){

	let cmdData = null;
	let suiteDesc = '';
	let actFile = '', expFile = '';

	// TEST SUITE #0 - Self test this test module
	suiteDesc = 'Self test this test module';
	suites.set(suiteDesc, []);

	// TEST ### - node-tee-test --help
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNodeTest} --help`;
	cmdData.cmd_exp = '';
	cmdData.cmd_inp = '';

	cmdData.cmd_out = getHelp();
	cmdData.cmd_err = '';

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `${CMD_NODE_TEST} --help`;

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - node-tee-test -h
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNodeTest} -h`;
	cmdData.cmd_exp = '';
	cmdData.cmd_inp = '';

	cmdData.cmd_out = getHelp();
	cmdData.cmd_err = '';

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `${CMD_NODE_TEST} -h`;

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - NODE_TEE_TEST=1 node-tee-test
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNodeTest}`;
	cmdData.cmd_exp = '';
	cmdData.cmd_inp = '';

	cmdData.cmd_out = `{"node":true,"verbose":false}`;
	cmdData.cmd_err = '';

	cmdData.cmd_opt = {encoding: 'UTF-8', env:{NODE_TEE_TEST:1}};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `NODE_TEE_TEST=1 ${CMD_NODE_TEST}`;

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - NODE_TEE_TEST=1 node-tee-test --node
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNodeTest} --node`;
	cmdData.cmd_exp = '';
	cmdData.cmd_inp = '';

	cmdData.cmd_out = `{"node":true,"verbose":false}`;
	cmdData.cmd_err = '';

	cmdData.cmd_opt = {encoding: 'UTF-8', env:{NODE_TEE_TEST:1}};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `NODE_TEE_TEST=1 ${CMD_NODE_TEST} --node`;

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - NODE_TEE_TEST=1 node-tee-test -n
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNodeTest} -n`;
	cmdData.cmd_exp = '';
	cmdData.cmd_inp = '';

	cmdData.cmd_out = `{"node":true,"verbose":false}`;
	cmdData.cmd_err = '';

	cmdData.cmd_opt = {encoding: 'UTF-8', env:{NODE_TEE_TEST:1}};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `NODE_TEE_TEST=1 ${CMD_NODE_TEST} -n`;

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - NODE_TEE_TEST=1 node-tee-test --def
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNodeTest} --def`;
	cmdData.cmd_exp = '';
	cmdData.cmd_inp = '';

	cmdData.cmd_out = `{"node":false,"verbose":false}`;
	cmdData.cmd_err = '';

	cmdData.cmd_opt = {encoding: 'UTF-8', env:{NODE_TEE_TEST:1}};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `NODE_TEE_TEST=1 ${CMD_NODE_TEST} --def`;

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - NODE_TEE_TEST=1 node-tee-test -d
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNodeTest} -d`;
	cmdData.cmd_exp = '';
	cmdData.cmd_inp = '';

	cmdData.cmd_out = `{"node":false,"verbose":false}`;
	cmdData.cmd_err = '';

	cmdData.cmd_opt = {encoding: 'UTF-8', env:{NODE_TEE_TEST:1}};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `NODE_TEE_TEST=1 ${CMD_NODE_TEST} -d`;

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - NODE_TEE_TEST=1 node-tee-test --verbose
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNodeTest} --verbose`;
	cmdData.cmd_exp = '';
	cmdData.cmd_inp = '';

	cmdData.cmd_out = `{"node":true,"verbose":true}`;
	cmdData.cmd_err = '';

	cmdData.cmd_opt = {encoding: 'UTF-8', env:{NODE_TEE_TEST:1}};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `NODE_TEE_TEST=1 ${CMD_NODE_TEST} --verbose`;

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - NODE_TEE_TEST=1 node-tee-test -v
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNodeTest} -v`;
	cmdData.cmd_exp = '';
	cmdData.cmd_inp = '';

	cmdData.cmd_out = `{"node":true,"verbose":true}`;
	cmdData.cmd_err = '';

	cmdData.cmd_opt = {encoding: 'UTF-8', env:{NODE_TEE_TEST:1}};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `NODE_TEE_TEST=1 ${CMD_NODE_TEST} -v`;

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - NODE_TEE_TEST=1 node-tee-test --xxx
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNodeTest} --xxx`;
	cmdData.cmd_exp = '';
	cmdData.cmd_inp = '';

cmdData.cmd_out = ``;
cmdData.cmd_err = `\
${CMD_NODE_TEST}: invalid option -- 'xxx'
Try '${CMD_NODE_TEST} --help' for more information.
`;

	cmdData.cmd_opt = {encoding: 'UTF-8', env:{NODE_TEE_TEST:1}};
	cmdData.cmd_ext = 1;
	cmdData.cmd_desc = `NODE_TEE_TEST=1 ${CMD_NODE_TEST} --xxx`;

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - NODE_TEE_TEST=1 node-tee-test -x
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNodeTest} -x`;
	cmdData.cmd_exp = '';
	cmdData.cmd_inp = '';

cmdData.cmd_out = ``;
cmdData.cmd_err = `\
${CMD_NODE_TEST}: unrecognized option '-x'
Try '${CMD_NODE_TEST} --help' for more information.
`,

	cmdData.cmd_opt = {encoding: 'UTF-8', env:{NODE_TEE_TEST:1}};
	cmdData.cmd_ext = 1;
	cmdData.cmd_desc = `NODE_TEE_TEST=1 ${CMD_NODE_TEST} -x`;

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - NODE_TEE_TEST=1 node-tee-test xxx
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNodeTest} xxx`;
	cmdData.cmd_exp = '';
	cmdData.cmd_inp = '';

cmdData.cmd_out = ``;
cmdData.cmd_err = `\
${CMD_NODE_TEST}: unrecognized option 'xxx'
Try '${CMD_NODE_TEST} --help' for more information.
`,

	cmdData.cmd_opt = {encoding: 'UTF-8', env:{NODE_TEE_TEST:1}};
	cmdData.cmd_ext = 1;
	cmdData.cmd_desc = `NODE_TEE_TEST=1 ${CMD_NODE_TEST} xxx`;

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST SUITE #1 - Test common coreutils options
	suiteDesc = 'Test common coreutils options';
	suites.set(suiteDesc, []);

	// TEST ### - tee --help
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} --help`;
	cmdData.cmd_exp = '';
	cmdData.cmd_inp = '';

cmdData.cmd_out = `\
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
`;
cmdData.cmd_err = '';

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `${CMD_NODE} --help`;

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee --version
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} --version`;
	cmdData.cmd_exp = '';
	cmdData.cmd_inp = '';

	cmdData.cmd_out = `v1.0.1\n`;
	cmdData.cmd_err = '';

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `${CMD_NODE} --version`;

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee --
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} --`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} --`;
	cmdData.cmd_inp = '';

	cmdData.cmd_out = '';
	cmdData.cmd_err = '';

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `${CMD_NODE} --`;

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST SUITE #2 - Validate command line arguments
	suiteDesc = 'Validate command line arguments';
	suites.set(suiteDesc, []);

	// TEST ### - tee --xxx
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} --xxx`;
	cmdData.cmd_exp = cmdShellVer && `${cmdShell} --xxx`;
	cmdData.cmd_inp = '';

cmdData.cmd_out = '';
cmdData.cmd_err = `${CMD_NODE}: unrecognized option '--xxx'
Try '${CMD_NODE} --help' for more information.\n`;

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 1;
	cmdData.cmd_desc = `${CMD_NODE} --xxx`;

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee --output-error=
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} --output-error=`;
	cmdData.cmd_exp = cmdShellVer && `${cmdShell} --output-error=`;
	cmdData.cmd_inp = '';

cmdData.cmd_out = '';
cmdData.cmd_err = `\
${CMD_NODE}: ambiguous argument ‘’ for ‘--output-error’
Valid arguments are:
  - ‘warn’
  - ‘warn-nopipe’
  - ‘exit’
  - ‘exit-nopipe’
Try '${CMD_NODE} --help' for more information.\n`;

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 1;
	cmdData.cmd_desc = `${CMD_NODE} --output-error=`;

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee --output-error=xxx
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} --output-error=xxx`;
	cmdData.cmd_exp = cmdShellVer && `${cmdShell} --output-error=xxx`;
	cmdData.cmd_inp = '';

cmdData.cmd_out = '';
cmdData.cmd_err = `\
${CMD_NODE}: invalid argument ‘xxx’ for ‘--output-error’
Valid arguments are:
  - ‘warn’
  - ‘warn-nopipe’
  - ‘exit’
  - ‘exit-nopipe’
Try '${CMD_NODE} --help' for more information.\n`;


	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 1;
	cmdData.cmd_desc = `${CMD_NODE} --output-error=xxx`;

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee -x
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} -x`;
	cmdData.cmd_exp = cmdShellVer && `${cmdShell} -x`;
	cmdData.cmd_inp = '';

cmdData.cmd_out = '';
cmdData.cmd_err = `${CMD_NODE}: invalid option -- 'x'
Try '${CMD_NODE} --help' for more information.\n`;

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 1;
	cmdData.cmd_desc = `${CMD_NODE} -x`;

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST SUITE #3 - Test normal operation
	suiteDesc = 'Test normal operation';
	suites.set(suiteDesc, []);

	// TEST ### - tee
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode}`;
	cmdData.cmd_exp = cmdShell && `${cmdShell}`;
	cmdData.cmd_inp = '';

	cmdData.cmd_out = '';
	cmdData.cmd_err = '';

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `${CMD_NODE}`;

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee << \\x00\\x01\\x02\\x03\\x04
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode}`;
	cmdData.cmd_exp = cmdShell && `${cmdShell}`;
	cmdData.cmd_inp = '\x00\x01\x02\x03\x04';

	cmdData.cmd_out = `\x00\x01\x02\x03\x04`;
	cmdData.cmd_err = '';

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `${CMD_NODE}` + ` << \\x00\\x01\\x02\\x03\\x04`;

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee << test data\\nline 1\\nline 2\\x04\\nline 3
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode}`;
	cmdData.cmd_exp = cmdShell && `${cmdShell}`;
	cmdData.cmd_inp = 'test data\nline 1\nline 2\x04\nline 3';

cmdData.cmd_out = `test data
line 1
line 2\x04
line 3`;
cmdData.cmd_err = '';

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `${CMD_NODE}` + ` << test data\\nline 1\\nline 2\\x04\\nline 3`;

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee -i << test data\\nline 1\\nline 2\\x04\\nline 3
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} -i`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} -i`;
	cmdData.cmd_inp = 'test data\nline 1\nline 2\x04\nline 3';

cmdData.cmd_out = `test data
line 1
line 2\x04
line 3`;
cmdData.cmd_err = '';

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `${CMD_NODE} -i` + ` << test data\\nline 1\\nline 2\\x04\\nline 3`;

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee --ignore-interrupts << test data\\nline 1\\nline 2\\x04\\nline 3
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} --ignore-interrupts`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} --ignore-interrupts`;
	cmdData.cmd_inp = 'test data\nline 1\nline 2\x04\nline 3';

cmdData.cmd_out = `test data
line 1
line 2\x04
line 3`;
cmdData.cmd_err = '';

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `${CMD_NODE} --ignore-interrupts` + ` << test data\\nline 1\\nline 2\\x04\\nline 3`;

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee << test data << CTRL-C signal
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode}`;
	cmdData.cmd_exp = cmdShell && `${cmdShell}`;
	cmdData.cmd_inp = 'test data';

	cmdData.cmd_out = `test data`;
	cmdData.cmd_err = '';

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `${CMD_NODE}` + ` << test data << CTRL-C signal`;

	cmdData.signal = 'SIGINT';

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee -i << test data << CTRL-C signal
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} -i`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} -i`;
	cmdData.cmd_inp = 'test data';

	cmdData.cmd_out = `test data`;
	cmdData.cmd_err = '';

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `${CMD_NODE} -i` + ` << test data << CTRL-C signal`;

	cmdData.signal = 'SIGINT';

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee tmpDir/testTeeAct-1.pid << test data
	cmdData = {cmd_aux: null};
	cmdData.actFile = join(tmpDir, `testTeeAct-1.${process.pid}`);
	cmdData.expFile = join(tmpDir, `testTeeExp-1.${process.pid}`);

	fs.writeFileSync(cmdData.actFile, 'test data',{encoding: 'utf8'});
	fs.writeFileSync(cmdData.expFile, 'test data',{encoding: 'utf8'});

	cmdData.cmd_act = `node ${cmdNode} ${cmdData.actFile}`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} ${cmdData.expFile}`;
	cmdData.cmd_inp = 'test data';

	cmdData.cmd_out = '';
	cmdData.cmd_err = '';

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `${CMD_NODE} ${cmdData.actFile}` + ` << test data`;

	cmdData.cmd_aux = (cmdData) => {
		fs.open(cmdData.actFile, (err, fd) => {
			fs.readFile(fd, 'utf8', (err, data) => {
				assert.strictEqual(data, 'test data');
				fs.unlink(cmdData.actFile, (err)=>{});
			});
		});
		fs.open(cmdData.expFile, (err, fd) => {
			fs.readFile(fd, 'utf8', (err, data) => {
				assert.strictEqual(data, 'test data');
				fs.unlink(cmdData.expFile, (err)=>{});
			});
		});
	};

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee -a tmpDir/testTeeAct-2.pid << test data
	cmdData = {cmd_aux: null};
	cmdData.actFile = join(tmpDir, `testTeeAct-2.${process.pid}`);
	cmdData.expFile = join(tmpDir, `testTeeExp-2.${process.pid}`);

	fs.writeFileSync(cmdData.actFile, 'test data',{encoding: 'utf8'});
	fs.writeFileSync(cmdData.expFile, 'test data',{encoding: 'utf8'});

	cmdData.cmd_act = `node ${cmdNode} -a ${cmdData.actFile}`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} -a ${cmdData.expFile}`;
	cmdData.cmd_inp = 'test data';

	cmdData.cmd_out = '';
	cmdData.cmd_err = '';

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `${CMD_NODE} -a ${cmdData.actFile}` + ` << test data`;

	cmdData.cmd_aux = (cmdData) => {
		fs.open(cmdData.actFile, (err, fd) => {
			fs.readFile(fd, 'utf8', (err, data) => {
				assert.strictEqual(data, 'test datatest data');
				fs.unlink(cmdData.actFile, (err)=>{});
			});
		});
		fs.open(cmdData.expFile, (err, fd) => {
			fs.readFile(fd, 'utf8', (err, data) => {
				assert.strictEqual(data, 'test datatest data');
				fs.unlink(cmdData.expFile, (err)=>{});
			});
		});
	};

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST SUITE #4 - Test warn/error conditions of output files
	suiteDesc = 'Test warn/error conditions of output files';
	suites.set(suiteDesc, []);

	// TEST ### - tee non-existent/file << test data
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} non-existent/file`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} non-existent/file`;
	cmdData.cmd_inp = 'test data';

	cmdData.cmd_out = `test data`;
	cmdData.cmd_err = `${CMD_NODE}: non-existent/file: No such file or directory\n`;

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 1;
	cmdData.cmd_desc = `${CMD_NODE} non-existent/file` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee --output-error=warn non-existent/file << test data
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} --output-error=warn non-existent/file`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=warn non-existent/file`;
	cmdData.cmd_inp = 'test data';

	cmdData.cmd_out = `test data`;
	cmdData.cmd_err = `${CMD_NODE}: non-existent/file: No such file or directory\n`;

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 1;
	cmdData.cmd_desc = `${CMD_NODE} --output-error=warn non-existent/file` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee --output-error=warn-nopipe non-existent/file << test data
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} --output-error=warn-nopipe non-existent/file`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=warn-nopipe non-existent/file`;
	cmdData.cmd_inp = 'test data';

	cmdData.cmd_out = `test data`;
	cmdData.cmd_err = `${CMD_NODE}: non-existent/file: No such file or directory\n`;

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 1;
	cmdData.cmd_desc = `${CMD_NODE} --output-error=warn-nopipe non-existent/file` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee --output-error=exit non-existent/file << test data
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} --output-error=exit non-existent/file`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=exit non-existent/file`;
	cmdData.cmd_inp = 'test data';

	cmdData.cmd_out = ``;
	cmdData.cmd_err = `${CMD_NODE}: non-existent/file: No such file or directory\n`;

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 1;
	cmdData.cmd_desc = `${CMD_NODE} --output-error=exit non-existent/file` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee --output-error=exit-nopipe non-existent/file << test data
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} --output-error=exit-nopipe non-existent/file`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=exit-nopipe non-existent/file`;
	cmdData.cmd_inp = 'test data';

	cmdData.cmd_out = ``;
	cmdData.cmd_err = `${CMD_NODE}: non-existent/file: No such file or directory\n`;

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 1;
	cmdData.cmd_desc = `${CMD_NODE} --output-error=exit-nopipe non-existent/file` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee /dev/null non-existent/file /dev/null << test data
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} ${devNull} non-existent/file ${devNull}`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} ${devNull} non-existent/file ${devNull}`;
	cmdData.cmd_inp = 'test data';

	cmdData.cmd_out = `test data`;
	cmdData.cmd_err = `${CMD_NODE}: non-existent/file: No such file or directory\n`;

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 1;
	cmdData.cmd_desc = `${CMD_NODE} ${devNull} non-existent/file ${devNull}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee --output-error=warn /dev/null non-existent/file /dev/null << test data
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} --output-error=warn ${devNull} non-existent/file ${devNull}`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=warn ${devNull} non-existent/file ${devNull}`;
	cmdData.cmd_inp = 'test data';

	cmdData.cmd_out = `test data`;
	cmdData.cmd_err = `${CMD_NODE}: non-existent/file: No such file or directory\n`;

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 1;
	cmdData.cmd_desc = `${CMD_NODE} --output-error=warn ${devNull} non-existent/file ${devNull}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee --output-error=warn-nopipe /dev/null non-existent/file /dev/null << test data
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} --output-error=warn-nopipe ${devNull} non-existent/file ${devNull}`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=warn-nopipe ${devNull} non-existent/file ${devNull}`;
	cmdData.cmd_inp = 'test data';

	cmdData.cmd_out = `test data`;
	cmdData.cmd_err = `${CMD_NODE}: non-existent/file: No such file or directory\n`;

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 1;
	cmdData.cmd_desc = `${CMD_NODE} --output-error=warn-nopipe ${devNull} non-existent/file ${devNull}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee --output-error=exit /dev/null non-existent/file /dev/null << test data
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} --output-error=exit ${devNull} non-existent/file ${devNull}`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=exit ${devNull} non-existent/file ${devNull}`;
	cmdData.cmd_inp = 'test data';

	cmdData.cmd_out = ``;
	cmdData.cmd_err = `${CMD_NODE}: non-existent/file: No such file or directory\n`;

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 1;
	cmdData.cmd_desc = `${CMD_NODE} --output-error=exit ${devNull} non-existent/file ${devNull}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee --output-error=exit-nopipe /dev/null non-existent/file /dev/null << test data
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} --output-error=exit-nopipe ${devNull} non-existent/file ${devNull}`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=exit-nopipe ${devNull} non-existent/file ${devNull}`;
	cmdData.cmd_inp = 'test data';

	cmdData.cmd_out = ``;
	cmdData.cmd_err = `${CMD_NODE}: non-existent/file: No such file or directory\n`;

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 1;
	cmdData.cmd_desc = `${CMD_NODE} --output-error=exit-nopipe ${devNull} non-existent/file ${devNull}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST SUITE #5 - Test warn/error conditions of broken pipes
	suiteDesc = 'Test warn/error conditions of broken pipes';
	suites.set(suiteDesc, []);

	// TEST ### - tee | noOpCmd << test data
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} | ${noOpCmd}`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} | ${noOpCmd}`;
	cmdData.cmd_inp = 'test data';

	cmdData.cmd_out = ``;
	cmdData.cmd_err = ``;

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `${CMD_NODE} | ${noOpCmd}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee --output-error=warn | noOpCmd << test data
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} --output-error=warn | ${noOpCmd}`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=warn | ${noOpCmd}`;
	cmdData.cmd_inp = 'test data';

	cmdData.cmd_out = '';
	cmdData.cmd_err = `${CMD_NODE}: 'standard output': Broken pipe\n`;

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `${CMD_NODE} --output-error=warn | ${noOpCmd}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee --output-error=warn-nopipe | noOpCmd << test data
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} --output-error=warn-nopipe | ${noOpCmd}`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=warn-nopipe | ${noOpCmd}`;
	cmdData.cmd_inp = 'test data';

	cmdData.cmd_out = ``;
	cmdData.cmd_err = ``;

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `${CMD_NODE} --output-error=warn-nopipe | ${noOpCmd}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee --output-error=exit | noOpCmd << test data
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} --output-error=exit | ${noOpCmd}`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=exit | ${noOpCmd}`;
	cmdData.cmd_inp = 'test data';

	cmdData.cmd_out = ``;
	cmdData.cmd_err = `${CMD_NODE}: 'standard output': Broken pipe\n`;

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `${CMD_NODE} --output-error=exit | ${noOpCmd}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee --output-error=exit-nopipe | noOpCmd << test data
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} --output-error=exit-nopipe | ${noOpCmd}`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=exit-nopipe | ${noOpCmd}`;
	cmdData.cmd_inp = 'test data';

	cmdData.cmd_out = ``;
	cmdData.cmd_err = ``;

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `${CMD_NODE} --output-error=exit-nopipe | ${noOpCmd}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST SUITE #6 - Test warn/error conditions of output files and broken pipes
	suiteDesc = 'Test warn/error conditions of output files and broken pipes';
	suites.set(suiteDesc, []);

	// TEST ### - tee /dev/null non-existent/file /dev/null | noOpCmd << test data
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
	cmdData.cmd_inp = 'test data';

	cmdData.cmd_out = ``;
	cmdData.cmd_err = `${CMD_NODE}: non-existent/file: No such file or directory\n`;

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `${CMD_NODE} ${devNull} non-existent/file ${devNull} | ${noOpCmd}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee --output-error=warn /dev/null non-existent/file /dev/null | noOpCmd << test data
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} --output-error=warn ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=warn ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
	cmdData.cmd_inp = 'test data';

cmdData.cmd_out = '';
cmdData.cmd_err = `\
${CMD_NODE}: non-existent/file: No such file or directory
${CMD_NODE}: 'standard output': Broken pipe\n`;

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `${CMD_NODE} --output-error=warn ${devNull} non-existent/file ${devNull} | ${noOpCmd}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee --output-error=warn-nopipe /dev/null non-existent/file /dev/null | noOpCmd << test data
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} --output-error=warn-nopipe ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=warn-nopipe ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
	cmdData.cmd_inp = 'test data';

	cmdData.cmd_out = ``;
	cmdData.cmd_err = `${CMD_NODE}: non-existent/file: No such file or directory\n`;

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `${CMD_NODE} --output-error=warn-nopipe ${devNull} non-existent/file ${devNull} | ${noOpCmd}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST ### - tee --output-error=exit /dev/null non-existent/file /dev/null | noOpCmd << test data
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} --output-error=exit ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=exit ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
	cmdData.cmd_inp = 'test data';

	cmdData.cmd_out = ``;
	cmdData.cmd_err = `${CMD_NODE}: non-existent/file: No such file or directory\n`;

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `${CMD_NODE} --output-error=exit ${devNull} non-existent/file ${devNull} | ${noOpCmd}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);

	// TEST #30 - tee --output-error=exit-nopipe /dev/null non-existent/file /dev/null | noOpCmd << test data
	cmdData = {cmd_aux: null};

	cmdData.cmd_act = `node ${cmdNode} --output-error=exit-nopipe ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
	cmdData.cmd_exp = cmdShell && `${cmdShell} --output-error=exit-nopipe ${devNull} non-existent/file ${devNull} | ${noOpCmd}`;
	cmdData.cmd_inp = 'test data';

	cmdData.cmd_out = ``;
	cmdData.cmd_err = `${CMD_NODE}: non-existent/file: No such file or directory\n`;

	cmdData.cmd_opt = {encoding: 'UTF-8'};
	cmdData.cmd_ext = 0;
	cmdData.cmd_desc = `${CMD_NODE} --output-error=exit-nopipe ${devNull} non-existent/file ${devNull} | ${noOpCmd}` + (cmdData.cmd_inp && ` << ${cmdData.cmd_inp}`);

	cmdData.cmd_skip = false;
	suites.get(suiteDesc).push(cmdData);
}

/**
 * function main()
 * function verifyShellCmd()
 * function loadTestData()
 *     function nodeRunner()
 * function defRunner()
 * async function makeTest()
 * function getCmdOutput()
 * function parseCmdLine()
 * function getHelp()
 * function getError()
 *
 * @func  nodeRunner
 * @param {object} runner - The node core module 'node:test' object
 * @desc  Carry out the loaded tests using node test runner
 */
function nodeRunner(runner){

	for(let [suiteDesc, suiteTests] of suites){
		runner.suite(suiteDesc, () => {
			for(let cmdObj of suiteTests){
				runner.test(cmdObj.cmd_desc, {skip: cmdObj.cmd_skip}, async () => {
					await makeTest(cmdObj);
				});
			}
		});
	}
}

/* node:coverage disable */
/**
 * function main()
 * function verifyShellCmd()
 * function loadTestData()
 * function nodeRunner()
 *     function defRunner()
 * async function makeTest()
 * function getCmdOutput()
 * function parseCmdLine()
 * function getHelp()
 * function getError()
 *
 * @func  defRunner
 * @desc  Carry out the loaded tests using this developed test runner
 */
function defRunner(){

	cmdOptions.verbose && process.on('exit', () => {
		console.log();
		console.log('▶ tests',       --testCount);
		console.log('▶ suites',      suites.size);
		console.log('▶ pass',        passCount);
		console.log('▶ fail',        failCount);
		console.log('▶ cancelled',   cancelCount);
		console.log('▶ skipped',     skipCount);
		console.log('▶ todo',        todoCount);
		console.log('▶ duration_ms', Math.round(Date.now() - startTime));
	});

	cmdOptions.verbose && console.error();
	for(let [suiteDesc, suiteTests] of suites)
		for(let cmdObj of suiteTests)
			if(!cmdObj.cmd_skip)
				makeTest(cmdObj);

	cmdOptions.verbose && console.log();
}
/* node:coverage enable */

/**
 * function main()
 * function verifyShellCmd()
 * function loadTestData()
 * function nodeRunner()
 * function defRunner()
 *     async function makeTest()
 * function getCmdOutput()
 * function parseCmdLine()
 * function getHelp()
 * function getError()
 *
 * @func  makeTest
 * @async
 * @param {object} obj - The test data object
 * @desc  Carry out a single test
 */
async function makeTest(obj){

	const testID   = testCount++;

	let preMsg = `Test#${(testID).toString().padStart(3, '0')} ... `;
	let postMsg = preMsg;

	preMsg += `Initiate ... ${obj.cmd_desc}`;
	cmdOptions.verbose && console.error(preMsg);

	let [out_act, out_exp, prc_act, prc_exp] = await getCmdOutput(obj);

	if(out_exp !== null)
		out_exp.stderr = out_exp.stderr.replace(new RegExp(CMD_SHELL, 'g'), CMD_NODE);
	else{
		out_exp = {stdout: obj.cmd_out, stderr: obj.cmd_err};
		prc_exp = {exitCode: obj.cmd_ext};
	}

	if(!cmdOptions.verbose){

		assert.strictEqual(out_act.stdout, out_exp.stdout);
		assert.strictEqual(out_act.stderr, out_exp.stderr);
		assert.strictEqual(prc_act.exitCode, prc_exp.exitCode);
		obj.cmd_aux && obj.cmd_aux(obj);
	}
	/* node:coverage disable */
	else{
	try{
			assert.strictEqual(out_act.stdout, out_exp.stdout);
			assert.strictEqual(out_act.stderr, out_exp.stderr);
			assert.strictEqual(prc_act.exitCode, prc_exp.exitCode);
			obj.cmd_aux && obj.cmd_aux(obj);

			passCount++;

			postMsg += `Success ... ${obj.cmd_desc}`;
			cmdOptions.verbose && console.error(postMsg);
		}
		catch(e){
			failCount++;

			postMsg += `Failure ... ${obj.cmd_desc}`;
			cmdOptions.verbose && console.error(postMsg);
		}
	}
	/* node:coverage enable */
}

/**
 * function main()
 * function verifyShellCmd()
 * function loadTestData()
 * function nodeRunner()
 * function defRunner()
 * async function makeTest()
 *     function getCmdOutput()
 * function parseCmdLine()
 * function getHelp()
 * function getError()
 *
 * @func  getCmdOutput
 * @param {object} cmdObj - The test data object
 * @desc  Carry out a single test
 */
function getCmdOutput(cmdObj){

	let proc_act, proc_exp;

	let prom_act = new Promise((resolve, reject) => {
		proc_act = exec(cmdObj.cmd_act, cmdObj.cmd_opt, (err, stdout, stderr) => {
			resolve({stdout, stderr});
		});
		proc_act.stdin.write(cmdObj.cmd_inp);
		cmdObj.cmd_signal && proc_act.kill(cmdObj.cmd_signal);
		proc_act.stdin.end();
	});

	if(cmdObj.cmd_exp){
		let prom_exp = new Promise((resolve, reject) => {
			proc_exp = exec(cmdObj.cmd_exp, cmdObj.cmd_opt, (err, stdout, stderr) => {
				resolve({stdout, stderr});
			});
			proc_exp.stdin.write(cmdObj.cmd_inp);
			cmdObj.cmd_signal && proc_exp.kill(cmdObj.cmd_signal);
			proc_exp.stdin.end();
		});

		return Promise.all([prom_act, prom_exp, proc_act, proc_exp]);
	}

	return Promise.all([prom_act, null, proc_act, null]);
}

/**
 * function main()
 * function verifyShellCmd()
 * function loadTestData()
 * function nodeRunner()
 * function defRunner()
 * async function makeTest()
 * function getCmdOutput()
 *     function parseCmdLine()
 * function getHelp()
 * function getError()
 *
 * @func parseCmdLine
 * @desc Command line parser function
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
			if(opt === '--def'){
				cmdOptions.node = false;
			}
			else{
				process.stderr.write(`${getError(0).replace('__', opt.substring(2))}\n`);
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
				process.stderr.write(`${getError(1).replace('__', opt)}\n`);
				process.exit(1);
			}
		}
		else{
			process.stderr.write(`${getError(1).replace('__', opt)}\n`);
			process.exit(1);
		}
	}
}

/**
 * function main()
 * function verifyShellCmd()
 * function loadTestData()
 * function nodeRunner()
 * function defRunner()
 * async function makeTest()
 * function getCmdOutput()
 * function parseCmdLine()
 *     function getHelp()
 * function getError()
 *
 * @func   getHelp
 * @return {string}
 * @desc   Function to return help info
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

/**
 * function verifyShellCmd()
 * function loadTestData()
 * function nodeRunner()
 * function defRunner()
 * async function makeTest()
 * function getCmdOutput()
 * function parseCmdLine()
 * function getHelp()
 *     function getError()
 *
 * @func   getError
 * @param  {number} Error number
 * @return {string} Error message
 * @desc   Function to return error message
 */
function getError(n){

const error = [
// error[0]
`\
${CMD_NODE_TEST}: invalid option -- '__'
Try '${CMD_NODE_TEST} --help' for more information.`,

// error[1]
`\
${CMD_NODE_TEST}: unrecognized option '__'
Try '${CMD_NODE_TEST} --help' for more information.`,

// error[2]
`${CMD_NODE_TEST}: option '__' requires an argument
Try '${CMD_NODE_TEST} --help' for more information.`,

// error[3]
`${CMD_NODE_TEST}: invalid argument ‘__’ for ‘__’
Try '${CMD_NODE_TEST} --help' for more information.`,
];

	return error[n];
}
