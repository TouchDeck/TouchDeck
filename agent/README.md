# Agent

The agent running on the host computer, which accepts and executes commands.

## API

### `GET /api`

Ping the agent. This returns some agent info:

```json
{
  "name": "pideck-agent",
  "version": "0.1.0"
}
```

### `POST /api/actions/:action`

Invoke an action by its id.

### `GET /api/actions/options`

List all available action options that can be used in the configuration.

```json
[
  {
    "id": "ObsSetSceneAction",
    "category": "OBS",
    "name": "Set Scene"
  },
  {
    "id": "DebugAction",
    "category": "",
    "name": "Debug"
  }
]
```

### `GET /api/config`

Get the agent configuration.

### `PUT /api/config`

Set the agent configuration.

## Configuration

| Variable              | Default                        | Description |
|-----------------------|--------------------------------|-------------|
| LOG_LEVEL             | INFO                           | The log level (DEBUG, INFO, WARN, ERROR or OFF).
| HTTP_PORT             | 4000                           | The port the HTTP server listens on.
| WS_PORT               | 4001                           | The port the websocket server listens on.
| CONFIG_DIR            | ~/.pideck                      | The directory to store configuration files in. This directory contains a `config.json` file containing the full agent configuration.
| DISCOVERY_SERVER      | https://discovery.scorpiac.com | The discovery server URL to register the agent on.
| DISCOVERY_REPORT_TIME | 600                            | How often to report the agent to the discovery server (in seconds).
