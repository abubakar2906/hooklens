HookLens

A lightweight webhook infrastructure for receiving, verifying, and processing webhook events from multiple payment providers.

The goal of this project is to provide a consistent interface for handling incoming webhooks while keeping provider-specific logic isolated, making it easy to support additional providers in the future.

Project Status: 🚧 In Development

⸻

Features

✅ Phase 1 — Webhook Endpoint

* Receive incoming webhook requests
* Parse request payloads
* Basic request validation
* Structured project architecture

✅ Phase 2 — Event Processing

* Event parsing
* Provider detection
* Event routing
* Modular service architecture

✅ Phase 3 — Signature Verification

* Provider-specific signature verification
* Shared verification interface
* Extensible verifier architecture
* Constant-time signature comparison to mitigate timing attacks
* Unit tests for verification logic

⸻

Upcoming Features

🚧 Phase 4 — Delivery & Retry System

* Webhook delivery management
* Automatic retry mechanism
* Retry policies
* Failed event handling
* Delivery status tracking
* Error handling and resilience improvements

🚧 Phase 5 — Dashboard & UI

* Landing page
* Webhook dashboard
* Delivery history
* Event inspection
* Provider management
* Project statistics and monitoring

⸻

Architecture

The project follows a modular architecture where each responsibility is isolated into its own component.

Webhook Request
        │
        ▼
Webhook Endpoint
        │
        ▼
Signature Verification
        │
        ▼
Event Processing
        │
        ▼
Delivery Pipeline
        │
        ▼
Dashboard & Monitoring

Each payment provider implements its own verification logic while conforming to a shared interface, allowing new providers to be added with minimal changes to the rest of the codebase.

⸻

Security

Current security features include:

* Signature verification
* Constant-time signature comparison
* Provider-specific verification logic
* Separation of verification concerns
* Validation before event processing

Additional security improvements will be introduced as the project evolves.

⸻

Current Progress

Phase	Status
Phase 1 – Webhook Endpoint	✅ Complete
Phase 2 – Event Processing	✅ Complete
Phase 3 – Signature Verification	✅ Complete
Phase 4 – Delivery & Retry	🚧 In Progress
Phase 5 – Dashboard & UI	⏳ Planned

⸻

Tech Stack

* TypeScript
* Node.js
* Express
* Jest
* Crypto (HMAC Signature Verification)

⸻

Why This Project?

Webhook systems power many modern applications, from payment processing to third-party integrations.

This project is an exploration of the engineering challenges involved in building a production-oriented webhook platform, including:

* Secure request verification
* Extensible provider integrations
* Reliable event delivery
* Retry mechanisms
* Modular backend architecture
* Operational visibility through dashboards

⸻

Roadmap

* Receive webhook requests
* Process incoming events
* Verify webhook signatures
* Delivery pipeline
* Retry system
* Monitoring dashboard
* Landing page
* Provider management
* Additional payment providers
* API documentation

⸻

License

This project is available under the MIT License.