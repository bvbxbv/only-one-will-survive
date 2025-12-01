# Only one will survive

![License](https://img.shields.io/badge/license-MIT-green)
![GNOME 42](https://img.shields.io/badge/GNOME-42.9-orange)
![Pop!_OS](https://img.shields.io/badge/Pop!_OS-22.04-purple)

<p>
Ever been lost in a sea of windows on your screen? No? Well, I have.
</p>

<p>
This extension is the solution to that problem — it keeps only the active window visible and minimizes all the rest.
</p>

## Installation

1. Clone this repo

```bash
git clone https://github.com/bvbxbv/only-one-will-survive.git \
~/.local/share/gnome-shell/extensions/only-one-will-survive@bvbxbv
```

2. Compile GSettings Schema

```bash
glib-compile-schemas ~/.local/share/gnome-shell/extensions/only-one-will-survive@bvbxbv/schemas
```

3. Enable extension

```bash
gnome-extensions enable only-one-will-survive@bvbxbv
```

4. Press `ALT+F2` -> type `R` -> press `Enter` (or log out, or power off your pc. Whatever)

## Usage

After you enable this extension, you will see only active window. All inactive window will be minimized.

## Settings

-   ignore list (gnome extensions -> only one will survive -> options) - put here title of window which you don't want to be minimized.

## Compatibility

-   For sure working on pop os 22.04 with GNOME 42.9.
-   Still have problems with glava. I don't know what to do with that

## License

MIT. Do whatever you want. I don't mind
