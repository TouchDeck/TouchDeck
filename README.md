# TouchDeck

[![GitHub release](https://img.shields.io/github/v/release/TouchDeck/TouchDeck?include_prereleases)](https://github.com/TouchDeck/TouchDeck/releases)
[![Build and release agent](https://github.com/TouchDeck/TouchDeck/workflows/Build%20and%20release%20agent/badge.svg)](https://github.com/TouchDeck/TouchDeck/actions?query=workflow%3A%22Build+and+release+agent%22)

An alternative, open-source stream deck.

## Agent

The agent runs on the host pc.

### Configuration

The agent can be configured through environment variables.

| Variable          | Default                          | Description |
|-------------------|----------------------------------|-------------|
| `LOG_LEVEL`       | `INFO`                           | The log level (`DEBUG`, `INFO`, `WARN`, `ERROR` or `OFF`).
| `CONFIG_DIR`      | `~/.touchdeck`                   | The directory to store configuration files in. This directory contains a `config.json` file containing the full agent configuration.
| `WS_PROXY_SERVER` | `wss://wsproxy.touchdeck.app` | The websocket proxy server to connect to.

## Web

The web interface is deployed on https://deck.touchdeck.app.
