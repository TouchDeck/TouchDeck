# TouchDeck

[![Build and release agent](https://github.com/TouchDeck/TouchDeck/workflows/Build%20and%20release%20agent/badge.svg)](https://github.com/TouchDeck/TouchDeck/actions?query=workflow%3A%22Build+and+release+agent%22)

An alternative, open-source stream deck.

## Agent

The agent runs on the host pc.

### Configuration

The agent can be configured through environment variables.

| Variable                | Default                          | Description |
|-------------------------|----------------------------------|-------------|
| `LOG_LEVEL`             | `INFO`                           | The log level (`DEBUG`, `INFO`, `WARN`, `ERROR` or `OFF`).
| `PORT`                  | `0`                              | The port the server listens on.
| `CONFIG_DIR`            | `~/.touchdeck`                   | The directory to store configuration files in. This directory contains a `config.json` file containing the full agent configuration.
| `DISCOVERY_SERVER`      | `https://discovery.scorpiac.com` | The discovery server URL to register the agent on.
| `DISCOVERY_REPORT_TIME` | `600`                            | How often to report the agent to the discovery server (in seconds).

## Web

The web interface is deployed on https://touchdeck-app.netlify.app.
