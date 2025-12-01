const { Meta, GLib, Gio } = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();

let signalId = null;
let lastActiveId = null;

const SETTINGS = new Gio.Settings({ schema_id: "org.gnome.shell.extensions.only-one-will-survive" });
const DEBUG = false;

function logDebug(...args) {
	if (DEBUG) {
		try {
			global.log(`[OnlyOneWillSurvive][DEBUG] ${args.join(" ")}`);
		} catch (_) {}
	}
}

function log(...args) {
	try {
		global.log(`[OnlyOneWillSurvive] ${args.join(" ")}`);
	} catch (_) {}
}

function getTransientRoot(win) {
	try {
		if (!win) return null;
		let cur = win,
			last = cur;
		while (cur?.get_transient_for?.()) {
			last = cur.get_transient_for();
			cur = cur.get_transient_for();
		}
		return last || win;
	} catch (e) {
		logDebug("getTransientRoot error:", e.toString());
		return win;
	}
}

function isTransientChildOf(win, root) {
	if (!win || !root) return false;
	try {
		let cur = win;
		while (cur) {
			if (cur === root) return true;
			cur = cur.get_transient_for?.();
		}
	} catch (_) {}
	return false;
}

function getAppId(win) {
	try {
		return win?.get_wm_class_instance?.() || "";
	} catch (_) {
		return "";
	}
}

function getTitle(win) {
	try {
		return win?.get_title?.() || "";
	} catch (_) {
		return "";
	}
}

function shouldMinimize(win, activeRoot) {
	if (
		!win ||
		win.minimized ||
		!win.get_compositor_private?.() ||
		win.get_transient_for?.() ||
		win.window_type !== Meta.WindowType.NORMAL
	)
		return false;

	const appId = getAppId(win).toLowerCase();
	const title = getTitle(win).toLowerCase();

	if (["gnome-shell", "gnome-shell-extension-prefs"].includes(appId) || title.includes("only one will survive"))
		return false;

	try {
		const ignore = SETTINGS.get_strv("ignore-list").map((s) => s.toLowerCase());
		if (ignore.includes(appId)) return false;
	} catch (_) {}

	if (isTransientChildOf(activeRoot, win)) return false;

	logDebug("will minimize:", appId, `"${title}"`);
	return true;
}

function minimizeAll(exceptRoot) {
	try {
		const windows = global
			.get_window_actors()
			.map((a) => a.get_meta_window())
			.filter(Boolean);

		windows.forEach((win) => {
			if (win === exceptRoot || isTransientChildOf(win, exceptRoot) || !shouldMinimize(win, exceptRoot)) return;
			GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
				try {
					win.get_compositor_private() && win.minimize();
				} catch (_) {}
				return GLib.SOURCE_REMOVE;
			});
		});
	} catch (e) {
		logDebug("minimizeAll error:", e.toString());
	}
}

function onFocusChanged() {
	try {
		const active = global.display.focus_window;
		if (!active) return;

		const activeRoot = getTransientRoot(active);
		const activeRootId = activeRoot?.get_id?.() || null;

		if (activeRootId && lastActiveId === activeRootId) return;
		lastActiveId = activeRootId;

		minimizeAll(activeRoot);
	} catch (e) {
		logDebug("onFocusChanged error:", e.toString());
	}
}

function enable() {
	if (signalId) return;
	log("ENABLED");
	signalId = global.display.connect("notify::focus-window", onFocusChanged);
	onFocusChanged();
}

function disable() {
	if (signalId) global.display.disconnect(signalId);
	signalId = null;
	lastActiveId = null;
	log("DISABLED");
}

function init() {}
