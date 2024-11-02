import assert            from 'node:assert/strict';
import { exec }          from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const teeJS = join(__dirname, '..', 'lib/tee.js');

// child_process.exec(command[, options][, callback])
//
// Spawns a shell then executes the command within that shell, buffering any generated output.
// The command string passed to the exec function is processed directly by the shell and special characters (vary based on shell) need to be dealt with accordingly.

let cmd_act, cmd_exp;
let out_act, out_exp;
let prc_act, prc_exp;

// test #1 - tee --version

cmd_act = `node ${teeJS} --version`;
cmd_exp = 'tee --version';

[out_act, out_exp, prc_act, prc_exp] = await getOutput(cmd_act, cmd_exp);
assert.strictEqual(out_act, out_exp);
assert.strictEqual(prc_act.exitCode, prc_exp.exitCode);

// test #2 - tee --help

cmd_act = `node ${teeJS} --help`;
cmd_exp = 'tee --help';

[out_act, out_exp, prc_act, prc_exp] = await getOutput(cmd_act, cmd_exp);
assert.strictEqual(out_act, out_exp);
assert.strictEqual(prc_act.exitCode, prc_exp.exitCode);

// test #3 - tee --xxx

cmd_act = `node ${teeJS} --xxx`;
cmd_exp = 'tee --xxx';

[out_act, out_exp, prc_act, prc_exp] = await getOutput(cmd_act, cmd_exp);
assert.strictEqual(out_act, out_exp);
assert.strictEqual(prc_act.exitCode, prc_exp.exitCode);

// test #4 - tee --output-error=

cmd_act = `node ${teeJS} --output-error=`;
cmd_exp = 'tee --output-error=';

[out_act, out_exp, prc_act, prc_exp] = await getOutput(cmd_act, cmd_exp);
assert.strictEqual(out_act, out_exp);
assert.strictEqual(prc_act.exitCode, prc_exp.exitCode);

// test #5 - tee --output-error=xxx

cmd_act = `node ${teeJS} --output-error=xxx`;
cmd_exp = 'tee --output-error=xxx';

[out_act, out_exp, prc_act, prc_exp] = await getOutput(cmd_act, cmd_exp);
assert.strictEqual(out_act, out_exp);
assert.strictEqual(prc_act.exitCode, prc_exp.exitCode);

// test #6 - tee -x

cmd_act = `node ${teeJS} -x`;
cmd_exp = 'tee -x';

[out_act, out_exp, prc_act, prc_exp] = await getOutput(cmd_act, cmd_exp);
assert.strictEqual(out_act, out_exp);
assert.strictEqual(prc_act.exitCode, prc_exp.exitCode);

// test #7 - tee

cmd_act = `node ${teeJS} <<-HERE
		My Name is Essam
		I am an Engineer
HERE`;

cmd_exp = `tee <<-HERE
		My Name is Essam
		I am an Engineer
HERE`;

[out_act, out_exp, prc_act, prc_exp] = await getOutput(cmd_act, cmd_exp);
assert.strictEqual(out_act, out_exp);
assert.strictEqual(prc_act.exitCode, prc_exp.exitCode);

// test #8 - tee /root/tmp/a . <<-HERE
//		My Name is Essam
//		I am an Engineer
// HERE

cmd_act = `node ${teeJS} /root/tmp/a . <<-HERE
		My Name is Essam
		I am an Engineer
HERE`;

cmd_exp = `tee /root/tmp/a . <<-HERE
		My Name is Essam
		I am an Engineer
HERE`;

[out_act, out_exp, prc_act, prc_exp] = await getOutput(cmd_act, cmd_exp);
assert.strictEqual(out_act, out_exp);
assert.strictEqual(prc_act.exitCode, prc_exp.exitCode);

// helper functions

function getOutput(cmd_1, cmd_2){

	let proc_1, proc_2;

	let p1 = new Promise((resolve, reject) => {
		proc_1 = exec(cmd_1, {encoding: 'utf8'}, (err, stdout, stderr) => {
		    if(err)
				resolve(stderr + stdout);
			else
    			resolve(stdout);
		});
	});

	let p2 = new Promise((resolve, reject) => {
		proc_2 = exec(cmd_2, {encoding: 'utf8'}, (err, stdout, stderr) => {
	    	if(err)
    	    	resolve(stderr + stdout);
			else
    			resolve(stdout);
		});
	});

	return Promise.all([p1, p2, proc_1, proc_2]);
}
