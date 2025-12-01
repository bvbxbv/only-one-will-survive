# Only one will survive

Extension for GNOME which minimizes all inactive windows.

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

4. Press ALT+F2 -> type "R" -> press Enter

## Usage

After you enable this extension, you will see only active window. All inactive window will be minimized.

## To do

-   [x] settings
-   [x] ignore list (apps that should not be minimized)
-   [ ] fix minimizing of children windows
