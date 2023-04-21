---
title: The Singleton Design Pattern.
description: Learn more about the Singleton Design Pattern
pubDatetime: 2023-01-06T12:00:00.000Z
author: Jesús Alfredo Hernández Alarcón
postSlug: singleton-design-pattern
featured: false
draft: false
tags:
  - swift
  - design-patterns
ogImage: ""
---

### What is a Singleton?

The singleton design pattern is a design pattern that ensures that a class has only one instance and provides a single point of access to it. This is useful when exactly one object is needed to coordinate actions across the system. It can further ensure that no other instance can be created.

In Swift, the singleton design pattern can be implemented as follows:

```swift
class Singleton {
    static let shared = Singleton()
    private init() {}
}
```

This class creates a constant called `shared` which is an instance of `Singleton`, it can be accessed from anywhere by using `Singleton.shared`.

Notice that the initializer is **private** to prevent other parts of the app from creating additional instances of the class. Here's an example of how the singleton can be used:

```swift
class NetworkManager {
    static let shared = NetworkManager()
    private init() {}

    func get(_ url: URL, completion: @escaping (Result<[Post], Error>)) {
        // Make network request
    }
}

class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        NetworkManager.shared.get(URL(string: "https://alfredohdz.io/posts")!) { _ in
            // Handle result
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

---

## In general, it's important to weigh the pros and cons of using the singleton design pattern and choose the pattern that is most appropriate for the specific needs of the app.
