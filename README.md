# [better.game](https://better.game) launcher
## by [p3pr.co](https://p3pr.co)

> [!WARNING]
> This is currently in development. Check frequently for updates.

### Installation

1. download the latest version from the [releases](https://github.com/benjamint08/bettergame-launcher/releases) page.
2. run the file of choice (rpm, deb, appimage).
3. success

### Troubleshooting

arch linux users may get a gray screen when launching the appimage. this is due something weird. to fix this, run the following command:

```bash
WEBKIT_DISABLE_DMABUF_RENDERER=1 ./bettergame-launcher.AppImage
```