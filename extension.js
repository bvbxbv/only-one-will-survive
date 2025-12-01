const { Meta } = imports.gi;

let signal = null;
let lastActive = null;

const DEBUG = false;

function log(message, ignoreDebug = false) {
	if (DEBUG || ignoreDebug) global.log("[OnlyOneWillSurvive] " + message);
}

function minimizeAll(except) {
	let allWindows = global.get_window_actors().map((a) => a.get_meta_window());

	allWindows.forEach((win) => {
		if (win !== except) win.minimize();
	});
}

function enable() {
	signal = global.display.connect("notify::focus-window", () => {
		let active = global.display.focus_window;
		if (!active || active.window_type !== Meta.WindowType.NORMAL || active === lastActive) return;

		lastActive = active;
		minimizeAll(lastActive);
		log(`Current active window "${active.get_title()}" minimized other windows`);
	});

	log("ENABLED!", true);
}

function disable() {
	if (signal) {
		global.display.disconnect(signal);
		signal = null;
	}
	lastActive = null;
	log("DISABLED", true);
}

function init() {
	return { enable, disable };
}
