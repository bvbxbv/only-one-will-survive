const { Gio, Gtk } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;

GtkCssProvider = new Gtk.CssProvider();
GtkCssProvider.load_from_path(`${ExtensionUtils.getCurrentExtension().path}/prefs.css`);

function init() {}

function buildPrefsWidget() {
	const settings = new Gio.Settings({ schema_id: "org.gnome.shell.extensions.only-one-will-survive" });

	const vbox = new Gtk.Box({
		orientation: Gtk.Orientation.VERTICAL,
		spacing: 10,
		margin_top: 10,
		margin_bottom: 10,
		margin_start: 10,
		margin_end: 10,
	});

	const entry = new Gtk.Entry({ text: "" });
	entry.get_style_context().add_class("flat-entry");
	entry.get_style_context().add_provider(GtkCssProvider, Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION);
	entry.hexpand = true; // растягиваем поле ввода

	const addButton = new Gtk.Button({ label: "Add" });
	addButton.get_style_context().add_class("flat-button");
	addButton.get_style_context().add_provider(GtkCssProvider, Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION);

	const inputBox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 5 });
	inputBox.append(entry);
	inputBox.append(addButton);

	const listBox = new Gtk.ListBox();
	let rows = [];

	function refreshList() {
		rows.forEach((r) => listBox.remove(r));
		rows = [];

		const list = settings.get_strv("ignore-list");
		list.forEach((item) => {
			const row = new Gtk.ListBoxRow();

			const hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 10 });
			hbox.hexpand = true; // растягиваем горизонтально весь HBox

			const label = new Gtk.Label({ label: item, xalign: 0 });
			label.hexpand = true;

			const removeButton = new Gtk.Button({ label: "Remove" });
			removeButton.get_style_context().add_class("flat-button");
			removeButton.get_style_context().add_provider(GtkCssProvider, Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION);

			removeButton.connect("clicked", () => {
				const updatedList = settings.get_strv("ignore-list").filter((i) => i !== item);
				settings.set_strv("ignore-list", updatedList);
				refreshList();
			});

			hbox.append(label);
			hbox.append(removeButton);

			row.set_child(hbox);
			listBox.append(row);
			rows.push(row);
		});
	}

	addButton.connect("clicked", () => {
		const text = entry.text.trim();
		if (!text) return;
		const list = settings.get_strv("ignore-list");
		list.push(text);
		settings.set_strv("ignore-list", list);
		entry.text = "";
		refreshList();
	});

	vbox.append(inputBox);
	vbox.append(listBox);

	refreshList();

	return vbox;
}
