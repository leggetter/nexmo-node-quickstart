# Nexmo Node Quickstart

A quickstart example application for Nexmo using Node.

The example currently shows how to:

* Send an SMS
* Receive and incoming SMS as a WebHook callback

## Setup

Install the dependencies:

```bash
npm install
```

Create a `.env` file and add value for the following:

```bash
NEXMO_API_KEY={YOUR NEXMO API KEY}
NEXMO_API_SECRET={YOUR NEXMO API SECRET}
NEXMO_OUTBOUND_NUMBER={YOUR NEXMO NUMBER}
```

For `NEXMO_OUTBOUND_NUMBER` you'll need to register a number via [dashboard.nexmo.com/private/numbers](https://dashboard.nexmo.com/private/numbers).

## Running

```bash
node index.js
```

## License

MIT
