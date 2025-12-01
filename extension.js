const { Meta, GLib, Gio } = imports.gi;

let signal = null;
let lastActive = null;

const SETTINGS = new Gio.Settings({ schema_id: "org.gnome.shell.extensions.only-one-will-survive" });

function shouldMinimize(win) {
	if (!win) return false;
	if (win.minimized) return false;
	if (!win.get_compositor_private()) return false;

	const appId = win.get_wm_class_instance()?.toLowerCase();
	const ignore = SETTINGS.get_strv("ignore-list").map((s) => s.toLowerCase());

	return !ignore.includes(appId);
}

function minimizeAll(except) {
	const windows = global.get_window_actors().map((a) => a.get_meta_window());

	windows.forEach((win) => {
		if (win === except) return;
		if (!shouldMinimize(win)) return;
		if (!win.showing_on_its_workspace()) return;
		if (win.override_redirect) return;

		GLib.idle_add(GLib.PRIORITY_LOW, () => {
			if (win.get_compositor_private()) win.minimize();
			return GLib.SOURCE_REMOVE;
		});
	});
}

function enable() {
	signal = global.display.connect("notify::focus-window", () => {
		const active = global.display.focus_window;

		if (!active) return;
		if (active === lastActive) return;
		if (active.window_type !== Meta.WindowType.NORMAL) return;

		lastActive = active;
		minimizeAll(active);
	});

	global.log("[OnlyOneWillSurvive] ENABLED");
}

function disable() {
	if (signal) {
		global.display.disconnect(signal);
		signal = null;
	}
	lastActive = null;
	global.log("[OnlyOneWillSurvive] DISABLED");
}

function init() {}
