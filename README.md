# TouchDeck

An alternative, open-source stream deck made for any touchscreen device.

[![GitHub release](https://img.shields.io/github/v/release/TouchDeck/TouchDeck?include_prereleases)](https://github.com/TouchDeck/TouchDeck/releases)
[![Build and release agent](https://github.com/TouchDeck/TouchDeck/workflows/Build%20and%20release%20agent/badge.svg)](https://github.com/TouchDeck/TouchDeck/actions?query=workflow%3A%22Build+and+release+agent%22)

This readme contains developer documentation, for user documentation and guides visit https://touchdeck.app/documentation.

## Getting Started

Install all dependencies:

```shell
npm i --prefix agent
npm i --prefix model
npm i --prefix web
```

Start the agent:

```shell
npm start --prefix agent
```

Start the web interface:

```shell
npm start --prefix web
```

View the deck at: http://localhost:3000

Any changes made to the code will automatically cause the apps to reload. All modules have a `format` script to format (and optionally lint) the code. For example, to format the agent:

```shell
npm run format --prefix agent
```

## Modules

### Agent

The module contains the agent code, which runs on the host pc.

#### Configuration

The agent can be configured through environment variables.

| Variable          | Default                          | Description |
|-------------------|----------------------------------|-------------|
| `LOG_LEVEL`       | `INFO`                           | The log level (`DEBUG`, `INFO`, `WARN`, `ERROR` or `OFF`).
| `CONFIG_DIR`      | `~/.touchdeck`                   | The directory to store configuration files in. This directory contains a `config.json` file containing the full agent configuration.
| `WS_PROXY_SERVER` | `wss://wsproxy.touchdeck.app` | The websocket proxy server to connect to.

### Model

This module contains shared models, used by both the agent and web module.

### Web

This module contains the web code, which is deployed on https://deck.touchdeck.app.
