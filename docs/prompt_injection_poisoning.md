# Prompt Injection Poisoning

TL;DR

Embedding malicious or unreviewed content into AllenAI’s knowledge base introduces prompt injection risks, potentially leading to data poisoning, trust erosion, and reputational damage. Although vectors can be removed, caution is critical—**you have been warned**

## Problem 

The AllenAI system uses Amazon Bedrock and Aurora pgvector to store and retrieve semantically similar content to enhance responses. While this enables contextual intelligence, it also introduces an attack vector:

* If untrusted content is embedded and stored, it may be surfaced later—impacting answers, trust, and decision-making.

## Threat Vector: Prompt Injection via Embedded Data

* Users may embed harmful or misleading instructions.
* Aurora pgvector will retrieve the closest matches—even if they’re toxic or misleading.
* These may bypass Bedrock’s safety guardrails during context construction.
* If this poisoned data is later used to train a downstream model, the damage becomes permanent 

A FULL AND THOROUGH AUDIT SHOULD BE DONE ON THE EMBEDDINGS BEFORE TRAINING A DOWNSTREAM MODEL. **-You have been warned.**

## Threat Vector: Over-Trust

* AllenAI may appear to “get smarter” when taught. This can lead to unquestioned trust.
* Like Tesla Autopilot: “It works well 99% of the time, until it didn’t.”
* Users may skip human review and allow mistakes into production workflows.

## Mitigation Strategy

### Adapt Usage Principles

* Trust is our North Star
    * AllenAI must never become an unchallengeable authority. Developers should assume the user will over-trust the model over time unless clear safeguards are in place. Maybe a warning will suffice?

* Embeddings are temporary, not eternal
    * Vectors must be tagged, traceable, and deletable. Therefore why training a downstream model can be a problem without attempting to mitigate the risk with a full audit.

* Empower humans to override AI
    * Admins must be able to review, filter, and remove vector entries without deep technical steps, we this architecure meant to allow the system admins to have full control over the application.

### Technical Mitigation

| Area                   | Mitigation                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| **Input Handling**     | Sanitize all user-submitted content.             |
| **Embedding Metadata** | Store `user_id`, `timestamp`, `origin`, and `trust_level` with each vector.                   |
| **Query Filtering**    | Filter vectors during retrieval based on trust level or TTL expiration.                       |
| **Admin Deletion**     | Build admin tooling for rapid removal of malicious or incorrect vectors.                      |
| **Audit Logging**      | Track every embedding and retrieval event for forensic analysis.                              |
| **Vector Expiry**      | Automatically expire low-trust vectors after X days.                                          |
| **Training Checks**    | Create a “clean embeddings export” pipeline—**audited and sanitized**—before use in training. |
