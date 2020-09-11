# Agent Discovery

This module serves as a very simple API which can be used to discover agents in a local network.

## API

All endpoints only expose agents in the same network as the request origin, based on the remote client IP address.

### `GET /api/agents`

Lists all known agents. This will return a JSON list of agents with their local address and platform, for example:

```json
[
  {
    "address": "192.168.0.110:4000",
    "platform": "windows"
  }
]
```

### `POST /api/agents`

Register a new agent. Send the agent address and platform as a JSON object in the request body, for example:

```json
{
  "address": "192.168.0.110:4000",
  "platform": "windows"
}
```

## Configuration

| Variable        | Default | Description |
|-----------------|---------|-------------|
| PORT            | 5000    | The port the server listens on.
| KEEP_AGENT_TIME | 600     | The time (in seconds) to keep agents in the registry. 
