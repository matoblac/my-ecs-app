# Allen.ai Backend (ECS + Bedrock + Aurora)

This is the backend for the Allen.ai application. It's containerized and deployed to ECS.

## Core Architecture

Utilizes the concept of Domain Driven Design (DDD) to organize the code.

## Core Components

* Domain Layer:
    * User
    * Chat
    * AI
    * Team
    * Notification
    * Settings

Each domain is a self-contained module that encapsulates the logic for a specific feature or business capability.