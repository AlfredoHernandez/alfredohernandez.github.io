---
title: The Singleton Design Pattern
description: The Singleton Design Pattern is one of the most widely used design patterns, and it is essential to understand its principles and applications. In this post, we'll explore the Singleton Design Pattern in detail, including its definition, advantages, and how to implement it in Swift programming language.
pubDatetime: 2023-01-06T12:00:00.000Z
author: Jesús Alfredo Hernández Alarcón
postSlug: singleton-design-pattern
featured: false
draft: false
tags:
  - swift
  - design-patterns
  - creational-design-patterns
ogImage: ""
---

The Singleton Design Pattern is one of the most widely used design patterns, and it is essential to understand its principles and applications. In this post, we'll explore the Singleton Design Pattern in detail, including its definition, advantages, and how to implement it in Swift programming language.

We'll also discuss real-world scenarios where the Singleton Design Pattern can be useful and how to avoid common pitfalls while using it. So, if you're a software developer looking to improve your understanding of design patterns, or you're just curious about the Singleton Design Pattern, keep reading!

## What is a Singleton?

The singleton design pattern is a design pattern that ensures that a class has only one instance and provides a single point of access to it. This is useful when exactly one object is needed to coordinate actions across the system. It can further ensure that no other instance can be created.

Here is a diagram that represents the singleton structure:

<div>
    <img src="/public/assets/posts/singleton-design-pattern/diagram.png" alt="singleton design pattern"/>
</div>

In `Swift`, the singleton design pattern can be implemented as follows:

```swift
class Singleton {
    static let shared = Singleton() // our unique instance

    private init() {} // private initializer

    public func operationA() {
        // TODO: Do something...
    }

    public func operationB() {
        // TODO: Do something...
    }
}
```

This class creates a constant called `shared` which is an instance of the `Singleton` class itself, that can be accessed from anywhere by using `Singleton.shared`.

> Notice that the initializer is **private** to prevent other parts of the app from creating additional instances of the class.

### A simple real life example

Imagine a `ViewController` class that needs to access to internet to download a posts list:

```swift
class NetworkManager {
    static let shared = NetworkManager()
    private init() {}

    func get(_ url: URL, completion: @escaping (Result<[Post], Error>)) {
        // TODO: Make real network request
    }
}

class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        NetworkManager.shared.get(URL(string: "https://alfredohdz.io/posts")!) { result in
            // TODO: Handle result
        }
    }
}
```

In this example, the `NetworkManager` is a singleton class that handles network requests for the app. The `get(_ url: URL)` function can be called from anywhere in the app by accessing the shared instance of `NetworkManager`.

There are several pros and cons to using the singleton design pattern:

### Pros:

- Ensures that a class has only one instance, which can be useful for resources that are limited or expensive to create (e.g. a database connection).

- Provides a global access point to the instance, which can make it easier to use the resource throughout the app.

- Can be used to enforce a particular behavior or state across the entire app.

### Cons:

- Can make it difficult to write unit tests, as the singleton instance can't be replaced with a mock or stub.

- Can make it harder to understand the relationships between classes, as the singleton instance can be accessed from anywhere in the app.

- Can make it harder to refactor or change the implementation of the singleton class, as it is tightly coupled to the rest of the app.

## Improving our design using the singleton

Property injection is a common technique used to inject dependencies into a class through properties. One of the most popular use cases for property injection is to use a Singleton instance as a dependency in a class. For example:

```swift
class ViewController: UIViewController {
    var networkClient: NetworkManager = NetworkManager.shared

    override func viewDidLoad() {
        super.viewDidLoad()
        networkClient.get(URL(string: "https://alfredohdz.io/posts")!) { _ in
            // Handle result
        }
    }
}
```

By doing so, we can replace in our tests the network client and use a mocked version of it. We can create a new class that inherits from our singleton, in this case `NetworkManager`.

```swift
class ViewController: UIViewController {
    var networkClient: NetworkManager = NetworkManager.shared

    override func viewDidLoad() {
        super.viewDidLoad()
        networkClient.get(URL(string: "https://alfredohdz.io/posts")!) { _ in
            // Handle result
        }
    }
}

class MockedNetworkManager: NetworkManager {
    override func get(_ url: URL, completion: @escaping (Result<[Post], Error>)) {
        // Make fake request
        completion(.success([]))
    }
}
```

TODO: Create example repo and test code...

---

In general, it's important to weigh the pros and cons of using the singleton design pattern and choose the pattern that is most appropriate for the specific needs of the app.
