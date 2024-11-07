import assert            from 'node:assert/strict';
import { exec }          from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const teeJS = join(__dirname, '..', 'lib/tee.js');

let verbose = true;

let testCount = 1;
let pass   = 0;
let fail   = 0;
let cancel = 0
let skip   = 0;
let todo   = 0;
let startTime = Date.now();

let cmd_act = '', cmd_exp = '';
let cmd_inp = '';
let cmd_desc = '';

/*
 * suite 1 - test common coreutils options
 */

// test #xx - tee --help
cmd_act = `node ${teeJS} --help`;
cmd_exp = 'tee --help';
cmd_inp = '';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

// test #xx - tee --version
cmd_act = `node ${teeJS} --version`;
cmd_exp = 'tee --version';
cmd_inp = '';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

// test #xx - tee --
cmd_act = `node ${teeJS} --`;
cmd_exp = 'tee --';
cmd_inp = '';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

/*
 * suite 2 - validate command line arguments
 */

// test #xx - tee --xxx
cmd_act = `node ${teeJS} --xxx`;
cmd_exp = 'tee --xxx';
cmd_inp = '';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

// test #xx - tee --output-error=
cmd_act = `node ${teeJS} --output-error=`;
cmd_exp = 'tee --output-error=';
cmd_inp = '';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

// test #xx - tee --output-error=xxx
cmd_act = `node ${teeJS} --output-error=xxx`;
cmd_exp = 'tee --output-error=xxx';
cmd_inp = '';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

// test #xx - tee -x
cmd_act = `node ${teeJS} -x`;
cmd_exp = 'tee -x';
cmd_inp = '';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

/*
 * suite 3 - test normal operation
 */

// test #xx - tee
cmd_act = `node ${teeJS}`;
cmd_exp = 'tee';
cmd_inp = '';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

// test #xx - tee
cmd_act = `node ${teeJS}`;
cmd_exp = 'tee';
cmd_inp = '\x00\x01\x02\x03\x04';

cmd_desc = 'tee' + ' << \\x00\\x01\\x02\\x03\\x04';
makeTest(cmd_desc);

// test #xx - tee
cmd_act = `node ${teeJS}`;
cmd_exp = 'tee';
cmd_inp = 'test data\nline 1\nline 2\x04\nline 3';

cmd_desc = 'tee' + ' << test data\\nline 1\\nline 2\\x04\\nline 3';
makeTest(cmd_desc);

/*
 * suite 4 - test warn/error conditions of output files
 */

// test #xx - tee non-existent/file
cmd_act = `node ${teeJS} non-existent/file`;
cmd_exp = 'tee non-existent/file';
cmd_inp = 'test data';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

// test #xx - tee --output-error=warn non-existent/file
cmd_act = `node ${teeJS} --output-error=warn non-existent/file`;
cmd_exp = 'tee --output-error=warn non-existent/file';
cmd_inp = 'test data';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

// test #xx - tee --output-error=warn-nopipe non-existent/file
cmd_act = `node ${teeJS} --output-error=warn-nopipe non-existent/file`;
cmd_exp = 'tee --output-error=warn-nopipe non-existent/file';
cmd_inp = 'test data';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

// test #xx - tee --output-error=exit non-existent/file
cmd_act = `node ${teeJS} --output-error=exit non-existent/file`;
cmd_exp = 'tee --output-error=exit non-existent/file';
cmd_inp = 'test data';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

// test #xx - tee --output-error=exit-nopipe non-existent/file
cmd_act = `node ${teeJS} --output-error=exit-nopipe non-existent/file`;
cmd_exp = 'tee --output-error=exit-nopipe non-existent/file';
cmd_inp = 'test data';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

// test #xx - tee /dev/null non-existent/file /dev/null
cmd_act = `node ${teeJS} /dev/null non-existent/file /dev/null`;
cmd_exp = 'tee /dev/null non-existent/file /dev/null';
cmd_inp = 'test data';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

// test #xx - tee --output-error=warn /dev/null non-existent/file /dev/null
cmd_act = `node ${teeJS} --output-error=warn /dev/null non-existent/file /dev/null`;
cmd_exp = 'tee --output-error=warn /dev/null non-existent/file /dev/null';
cmd_inp = 'test data';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

// test #xx - tee --output-error=warn-nopipe /dev/null non-existent/file /dev/null
cmd_act = `node ${teeJS} --output-error=warn-nopipe /dev/null non-existent/file /dev/null`;
cmd_exp = 'tee --output-error=warn-nopipe /dev/null non-existent/file /dev/null';
cmd_inp = 'test data';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

// test #xx - tee --output-error=exit /dev/null non-existent/file /dev/null
cmd_act = `node ${teeJS} --output-error=exit /dev/null non-existent/file /dev/null`;
cmd_exp = 'tee --output-error=exit /dev/null non-existent/file /dev/null';
cmd_inp = 'test data';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

// test #xx - tee --output-error=exit-nopipe /dev/null non-existent/file /dev/null
cmd_act = `node ${teeJS} --output-error=exit-nopipe /dev/null non-existent/file /dev/null`;
cmd_exp = 'tee --output-error=exit-nopipe /dev/null non-existent/file /dev/null';
cmd_inp = 'test data';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

/*
 * suite 5 - test warn/error conditions of broken pipes
 */

// test #xx - tee | echo -n
cmd_act = `node ${teeJS} | echo -n`;
cmd_exp = 'tee | echo -n';
cmd_inp = 'test data';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

// test #xx - tee --output-error=warn | echo -n
cmd_act = `node ${teeJS} --output-error=warn | echo -n`;
cmd_exp = 'tee --output-error=warn | echo -n';
cmd_inp = 'test data';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

// test #xx - tee --output-error=warn-nopipe | echo -n
cmd_act = `node ${teeJS} --output-error=warn-nopipe | echo -n`;
cmd_exp = 'tee --output-error=warn-nopipe | echo -n';
cmd_inp = 'test data';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

// test #xx - tee --output-error=exit | echo -n
cmd_act = `node ${teeJS} --output-error=exit | echo -n`;
cmd_exp = 'tee --output-error=exit | echo -n';
cmd_inp = 'test data';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

// test #xx - tee --output-error=exit-nopipe | echo -n
cmd_act = `node ${teeJS} --output-error=exit-nopipe | echo -n`;
cmd_exp = 'tee --output-error=exit-nopipe | echo -n';
cmd_inp = 'test data';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

/*
 * suite 6 - test warn/error conditions of output files and broken pipes
 */

// test #xx - tee /dev/null non-existent/file /dev/null | echo -n
cmd_act = `node ${teeJS} /dev/null non-existent/file /dev/null | echo -n`;
cmd_exp = 'tee /dev/null non-existent/file /dev/null | echo -n';
cmd_inp = 'test data';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

// test #xx - tee --output-error=warn /dev/null non-existent/file /dev/null | echo -n
cmd_act = `node ${teeJS} --output-error=warn /dev/null non-existent/file /dev/null | echo -n`;
cmd_exp = 'tee --output-error=warn /dev/null non-existent/file /dev/null | echo -n';
cmd_inp = 'test data';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

// test #xx - tee --output-error=warn-nopipe /dev/null non-existent/file /dev/null | echo -n
cmd_act = `node ${teeJS} --output-error=warn-nopipe /dev/null non-existent/file /dev/null | echo -n`;
cmd_exp = 'tee --output-error=warn-nopipe /dev/null non-existent/file /dev/null | echo -n';
cmd_inp = 'test data';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

// test #xx - tee --output-error=exit /dev/null non-existent/file /dev/null | echo -n
cmd_act = `node ${teeJS} --output-error=exit /dev/null non-existent/file /dev/null | echo -n`;
cmd_exp = 'tee --output-error=exit /dev/null non-existent/file /dev/null | echo -n';
cmd_inp = 'test data';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

// test #xx - tee --output-error=exit-nopipe /dev/null non-existent/file /dev/null | echo -n
cmd_act = `node ${teeJS} --output-error=exit-nopipe /dev/null non-existent/file /dev/null | echo -n`;
cmd_exp = 'tee --output-error=exit-nopipe /dev/null non-existent/file /dev/null | echo -n';
cmd_inp = 'test data';

cmd_desc = cmd_exp;
makeTest(cmd_desc);

// Report on tests
verbose && console.log();
verbose && process.on('exit', () => {
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
 */
async function makeTest(cmd_desc = ''){

	let out_act, out_exp;
	let prc_act, prc_exp;
	let testID = testCount++;

	let preMsg = `Test#${(testID).toString().padStart(3, '0')} ... `;
	let postMsg = preMsg;

	preMsg += `Initiate ... ${cmd_desc}`;
	verbose && console.error(preMsg);

	[out_act, out_exp, prc_act, prc_exp] = await getCmdOutput(cmd_act, cmd_exp, cmd_inp);

	if(!verbose){
		assert.strictEqual(out_act, out_exp);
		assert.strictEqual(prc_act.exitCode, prc_exp.exitCode);

		return;
	}

	try{
		assert.strictEqual(out_act, out_exp);
		assert.strictEqual(prc_act.exitCode, prc_exp.exitCode);

		pass++;

		postMsg += `Success ... ${cmd_desc}`;
		verbose && console.error(postMsg);
	}
	catch(e){
		fail++;

		postMsg += `Failure ... ${cmd_desc}`;
		verbose && console.error(postMsg);
	}
}

/*
 * async function makeTest()
 *     function getCmdOutput()
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

	let p2 = new Promise((resolve, reject) => {
		proc_2 = exec(cmd_2, {encoding: 'UTF-8'}, (err, stdout, stderr) => {
			resolve(stdout + stderr);
		});
		proc_2.stdin.write(input);
		proc_2.stdin.end();
	});

	return Promise.all([p1, p2, proc_1, proc_2]);
}
