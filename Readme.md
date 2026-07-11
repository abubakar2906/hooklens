# 🪝 HookLens

<p align="center">
  <em>A lightweight, self-hosted webhook gateway for African Fintech developers.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-%F0%9F%9A%A7%20In%20Development-yellow?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
</p>

---

## 📖 Overview

**HookLens** is a dedicated webhook infrastructure designed to receive, verify, and reliably process webhook events from major payment providers. 

The goal of this project is to provide a unified, consistent interface for handling incoming webhooks while keeping provider-specific logic completely isolated. This makes it effortless to support additional providers in the future without muddying your core application logic.

### Supported Providers:
- 🇳🇬 **Paystack**
- 🌍 **Flutterwave**
- 🇳🇬 **Monnify**
- *(More coming soon)*

---

## ✨ Features & Roadmap

### ✅ Phase 1: Webhook Endpoint
- [x] Receive incoming webhook requests
- [x] Parse request payloads securely
- [x] Basic request validation
- [x] Structured, modular project architecture

### ✅ Phase 2: Event Processing
- [x] Advanced event parsing
- [x] Automatic provider detection
- [x] Intelligent event routing
- [x] Modular service architecture

### ✅ Phase 3: Signature Verification
- [x] Provider-specific HMAC signature verification
- [x] Shared verification interface
- [x] Extensible verifier architecture
- [x] Constant-time signature comparison to mitigate timing attacks
- [x] Unit tests for verification logic

### 🚧 Phase 4: Delivery & Retry System *(In Progress)*
- [ ] Webhook delivery management (BullMQ)
- [ ] Automatic exponential backoff retry mechanism
- [ ] Configurable retry policies
- [ ] Failed event handling & dead-letter queues
- [ ] Delivery status tracking

### 🚧 Phase 5: Dashboard & UI *(In Progress)*
- [x] Beautiful dark-mode Landing page
- [x] Built-in Waitlist collection
- [ ] Webhook monitoring dashboard
- [ ] Delivery history & payload inspection
- [ ] Provider management interface
- [ ] Project statistics and AI failure diagnostics

---

## 🏗️ Architecture

HookLens follows a highly modular architecture where each responsibility is isolated into its own pipeline component

Each payment provider implements its own verification logic while conforming to a shared TypeScript interface. This allows new providers to be added effortlessly with minimal changes to the core codebase.

---

## 🛡️ Security First

Processing webhooks involves sensitive financial data. HookLens is built with security as a primary focus:

- **Strict Signature Verification:** All payloads are validated using the provider's official signing secrets.
- **Timing Attack Mitigation:** Constant-time signature comparison (`crypto.timingSafeEqual`) is used exclusively.
- **Provider Isolation:** Verification logic is strictly isolated per provider.
- **Pre-validation:** Malformed or unsigned events are dropped before they ever reach the event processing queue.

---

## 🛠️ Tech Stack

- **Language:** TypeScript
- **Backend:** Node.js, Express
- **Frontend / Dashboard:** Next.js (App Router), React 19, Tailwind CSS
- **Testing:** Jest
- **Security:** Node Native Crypto (HMAC Signature Verification)

---

## 🤔 Why build this?

Webhook systems power the modern internet, especially in fintech (payment processing, recurring billing, ledger updates). 

This project is an exploration of the engineering challenges involved in building a production-oriented webhook platform, including:
- Guaranteeing reliable event delivery in distributed systems.
- Handling downstream server outages with smart retry mechanisms.
- Normalizing disparate API shapes from multiple third-party providers.
- Providing operational visibility through a clean, native dashboard.

---

## 📄 License

This project is available under the **MIT License**. Free to use, self-host, and modify forever.