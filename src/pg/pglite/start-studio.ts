import chokidar from "chokidar";
import { exec } from "child_process";

const pid: {
	studio: number | undefined;
	server: number | undefined;
} = {
	studio: undefined,
	server: undefined,
};

// init on start
pid.studio = startPGLiteStudio();
pid.server = startPGLiteServer();

chokidar
	.watch("src/pg/pglite/data.db/base", { ignoreInitial: true })
	.on("change", (path) => {
		console.clear();
		console.info("Database changed, restarting server...", path);

		if (pid.studio) {
			process.kill(pid.studio);
			pid.studio = undefined;
		}
		if (pid.server) {
			process.kill(pid.server);
			pid.server = undefined;
		}

		// restart servers
		pid.server = startPGLiteServer();
		pid.studio = startPGLiteStudio();
	});

function startPGLiteServer() {
	return exec("npm run pglite:start:server", (error, stdout, stderr) => {
		if (stdout) {
			console.log(`pglite-server: ${stdout}`);
		}
	}).pid;
}

function startPGLiteStudio() {
	return exec("npm run pglite:start:studio", (error, stdout, stderr) => {
		if (stdout) {
			console.log(`drizzle-studio: ${stdout}`);
		}
	}).pid;
}
