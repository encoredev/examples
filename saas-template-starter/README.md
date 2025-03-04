# Encore SaaS Starter Template

Welcome to the Encore SaaS Starter Template – a comprehensive launchpad for building modern SaaS applications with ease. This project was designed to help teams rapidly set up a robust and scalable SaaS stack by integrating key components like backend services, frontend frameworks, UI styling, authentication, and payment processing.

## Overview

This template leverages the power of Encore for the backend and Next.js for the frontend, complemented by Tailwind CSS and shadcn for UI components. The goal is to simplify common challenges such as integrating authentication systems and payment gateways, thereby accelerating your startup's development process.

Key technologies used:

-   **Backend:** Encore (.ts)
-   **Frontend:** Next.js
-   **UI Components:** Tailwind CSS with shadcn
-   **Authentication:** Clerk
-   **Payments:** Stripe
-   **Database:** Drizzle

The project meets the high quality standards required to serve as a reliable foundation for any SaaS application.

You will find 3 microservices beside the frontend consisting of.

-   **auth:** The authentication service, which ensures every request when needed is validated by authorization through Clerk.
-   **users:** The users service, is where your users backend logic is being managed. Simply add in Clerk webhook url to have clerk send User information for your own db storage on new user creation.
-   **payments:** The payments service is integrated with Stripe, and includes schema setup for subscription and product price tags. Simply change success/cancel urls and env variables **StripeSecretKey** and **StripePublishableKey** to have a fully working stripe implementation and session checkout.

The frontend is clean and its up to you how to forward, the endpoints for user management, stripe subscription/cancel management is done, full authentication for both backend/frontend is implemented and just needs your prefered setup. You will find relevant links on root page, to the different technologies so you can setup your prefered flow of execution.

## Clerk Integration

Authentication is a critical part of any SaaS application. In this template, we use **Clerk** to handle user authentication and management. Clerk offers:

-   **Out-of-the-box User Management:** Seamless registration, login, and profile management.
-   **Robust Security:** Secure authentication flows to protect user data.
-   **Customizable UI Components:** Easily adaptable components that integrate with your application’s design for a consistent user experience.

The integration with Clerk simplifies the complexities of user authentication, enabling you to focus on building core features of your application.

## Stripe Integration

To handle all payment-related functionality, this template integrates **Stripe**, a leading payment processing platform. Key aspects of the Stripe implementation include:

-   **Payment Processing:** Support for one-time payments and subscription-based billing.
-   **Scalability:** Built to handle the growing demands of your SaaS business.
-   **Seamless Frontend Integration:** Integrated smoothly with the Next.js frontend to provide users with a fluid payment experience.

With Stripe, you can manage transactions efficiently and securely, ensuring that your payment workflows are reliable and easy to maintain.

## Getting Started

To get started with the Encore SaaS Starter Template:

1. **Clone the Repository:** Follow the instructions in the README to clone the project.
2. **Install Dependencies:** Set up the necessary dependencies for both the backend (Encore) and the frontend (Next.js).
3. **Configure Integrations:** Follow the provided guides to configure Clerk for authentication and Stripe for payments.
4. **Deploy:** Use the detailed deployment instructions to launch your application.

---

This starter template is designed to jumpstart your SaaS application development by seamlessly integrating essential services with high-quality code and comprehensive documentation. Happy coding!

---

## Understanding the Backend Design Basics

The backend of this application is built on a modular and layered architecture that emphasizes consistency, performance, and maintainability. Below is an abstract overview of the key components and design patterns used:

### Repository Pattern and Base Repository

-   **Unified CRUD Operations:**
    The core of the data access layer is an abstract **BaseRepository** that implements a standard CRUD interface (via the `IBaseCRUD` interface). This design enforces consistent naming conventions and operations across all repositories.

-   **Prepared Statement Integration:**
    Each repository extends the BaseRepository and injects a prepared statements class. These classes leverage Drizzle's binary SQL compilation, which pre-compiles SQL queries. This results in faster query execution and more efficient database interactions, as the heavy lifting of query parsing is done beforehand.

-   **Streamlined Data Access:**
    By using the BaseRepository as the foundation, developers can quickly implement entity-specific repositories that inherit common CRUD functionality, reducing boilerplate and the likelihood of inconsistencies.

### Service Layer and Base Service

-   **Decoupling Business Logic:**
    The **BaseService** class extends the core functionality provided by the BaseRepository. It serves as an intermediary layer that encapsulates business logic, ensuring that the service layer interacts with data through a well-defined contract provided by the `IBaseCRUD` interface.

-   **Dependency Injection:**
    Services are designed to inject their corresponding repositories, which allows for a clear separation of concerns. This means that any changes in data access logic (e.g., modifying how prepared statements are executed) remain isolated within the repository layer, without affecting business logic.

-   **Consistent Naming and Functionality:**
    The adherence to the `IBaseCRUD` interface across both repositories and services offers a strict, predictable coding experience. This consistency simplifies maintenance and extension of the codebase.

### Singleton Pattern for Memory Efficiency

-   **Ensuring Single Instances:**
    Both repositories and services extend a base **Singleton** class. This design pattern ensures that only one instance of each class exists throughout the application's lifecycle, avoiding unnecessary instantiation overhead.

-   **Memory and Performance Benefits:**
    By reusing a single instance, the application conserves memory and ensures that shared resources (such as database connections or cached configurations) are managed efficiently. The Singleton pattern works seamlessly with Node.js's single-threaded event loop, ensuring safe concurrent access without creating multiple redundant instances.

### Minimal Example

For instance, obtaining a repository instance is as simple as:

```typescript
const myRepository = MyRepository.getInstance<INSTANCE_TYPE>();
```

This call guarantees that the same instance is reused across the application, promoting both memory efficiency and consistency.
Overall, this backend design provides a robust framework where:

    - Repositories manage data access with efficient, pre-compiled queries.
    - Services encapsulate business logic while adhering to a consistent CRUD interface.
    - The Singleton pattern improves performance and memory utilization by ensuring a single, shared instance per class.

This layered approach not only streamlines development but also enhances the application's scalability and maintainability.

## Setting Up Clerk for Both Development and Production

Before you can inject your Clerk secrets, you need to create an account on Clerk and bind your application. Follow these steps to ensure a smooth setup in both development and production environments.

### 1. Create Your Clerk Account

-   **Sign Up / Log In:**
    Visit [Clerk](https://clerk.dev) and sign up or log in if you already have an account.

-   **Bind Your Application:**
    Once logged in, create a new application in the Clerk dashboard. This process binds your app to Clerk and generates the API keys you'll need for authentication.

### 2. Development Setup

For development, you should set your Clerk keys as secrets using the `--dev` flag:

-   **`--dev` Flag:**
    This flag specifies that the secrets are for your development environment.

-   **ClerkSecretKey & ClerkPublishableKey:**
    These environment variables store your Clerk secret and publishable keys, allowing you to safely test authentication features.

Run the following commands to inject your Clerk secrets into your development environment:

```bash
encore secret set --dev ClerkSecretKey
encore secret set --dev ClerkPublishableKey
```

Next add the secret values to your .env.development and .env.production for production, - You can find the variables names in the .env.sample

### 3. Production Setup

When moving to production, you need to replace the development secrets with your production keys:

-   **Retrieve Production Keys:**
    In the Clerk dashboard, locate your production Secret Key and Publishable Key in your application's settings.

-   **Inject Production Secrets:**
    Update your production environment configuration with these keys to ensure secure communication with Clerk in your live application.
