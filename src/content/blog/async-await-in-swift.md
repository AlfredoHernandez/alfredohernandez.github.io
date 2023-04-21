---
title: Adding async await support to your current async code base APIs
description: Learn how to add async/await support to your current APIs
pubDatetime: 2021-06-17T12:00:00.000Z
author: Jesús Alfredo Hernández Alarcón
postSlug: async-await-in-swift
featured: true
draft: false
tags:
  - swift
ogImage: ""
---

In the latest WWDC 2021, Apple has introduced in Swift 5.5 in [SE-0296](https://github.com/apple/swift-evolution/blob/main/proposals/0296-async-await.md) the async / await pattern. This pattern allow to run async asynchronous code as it were synchronous. And of course this is a great feature for the language, because as developers we can take advantage of this and improve our code bases.

## Why to use async/await?

> Async programming with explicit callbacks (also called completion handlers) has many problems. We propose to address these problems by introducing async functions into the language. Async functions allow asynchronous code to be written as straight-line code. They also allow the implementation to directly reason about the execution pattern of the code, allowing callbacks to run far more efficiently.

Exctract from: [SE-0296](https://github.com/apple/swift-evolution/blob/main/proposals/0296-async-await.md)

I fully recommend to read this for more information.

### Let's do it!

To take advantage of this feature, we need the latest xcode beta version, that you can download from the official [apple developer website](https://developer.apple.com/download/).

![Apple Developer Website](/assets/posts/async-await/async-0.png)

Now, we can add support to our current async API's using the latest Xcode version and Swift 5.5. Let's image we have a web service api call, which is one of the most common case as developers we deal it.

Suppose that we have the next API definition in our code base:

```swift
protocol CatsLoader {
    func load(completion: @escaping (Result<[Cat], Error>) -> Void)
}
```

This is a common protocol which allow us create different loaders, for example to make api calls or read from a local data base like Core Data. In this case we could have a loader that makes a web service call, like so:

```swift
class RemoteCatsLoader: CatsLoader {
    func load(completion: @escaping (Result<[Cat], Error>) -> Void) {
        let cats = [
            Cat(id: "beng", name: "Bengal"),
            Cat(id: "aege", name: "Aegean"),
            Cat(id: "beng", name: "Bengal"),
            Cat(id: "aege", name: "Aegean"),
        ]
        DispatchQueue.global().asyncAfter(deadline: .now() + 2) {
            completion(.success(cats))
        }
    }
}
```

This class will simulate an API service call, usually you may have an implementation with [URLSession](https://developer.apple.com/documentation/foundation/urlsession) or [Alamorfire](https://github.com/Alamofire/Alamofire).

## Adding suppport for async/await

Let's work for adding support for the new `async/await` pattern. Of course one thing we can do is replace all the current implementation with the [new APIs](https://developer.apple.com/documentation/foundation/urlsession/3767353-data) that uses async/await pattern. But remeber, `async/await` is **only available in iOS 15.0**.

#### Adding the new async API to the `CatsLoader` protocol

With that in mind, we can add a new function inside our `CatsLoader` protocol, that only will be available for iOS 15.0

```swift
protocol CatsLoader {
    @available(iOS 15.0, *)
    func load() async throws -> [Cat]

    func load(completion: @escaping (Result<[Cat], Error>) -> Void)
}
```

Let's see how the new API function is built.

1. We have the `@available(iOS 15.0, *)` to warn developers that it will only available for iOS 15 and above.
2. Then we use `async` to run the code almost if it were synchronous, and we add `throws` because our code may throws with and error, we can see this in the other API inside the `Result<[Cat], Error>`, it may fail with an error, so we need to **throw** an error.
3. Finally we return the result, that in this case is `[Cat]`

And that's the transformation from using completions to using the new async pattern inside the protocol.

#### Adding the new async API to the `RemoteCatsLoader`

It's time to implement the async function. To achive so, we are going to use [`withCheckedThrowingContinuation`](https://developer.apple.com/documentation/swift/3814989-withcheckedthrowingcontinuation) that as the documentation says:

> Suspends the current task, then calls the given closure with a checked throwing continuation for the current task

Optionally we also have:

- [withCheckedContinuation](https://developer.apple.com/documentation/swift/3814988-withcheckedcontinuation): Suspends the current task, then calls the given closure with a checked continuation for the current task.
- [withUnsafeContinuation](https://developer.apple.com/documentation/swift/3815002-withunsafecontinuation): Suspends the current task, then calls the given closure with the an unsafe continuation for the current task.
- [withUnsafeThrowingContinuation](https://developer.apple.com/documentation/swift/3815004-withunsafethrowingcontinuation): Suspends the current task, then calls the given closure with the an unsafe throwing continuation for the current task.

A [continuation](https://github.com/apple/swift-evolution/blob/main/proposals/0300-continuation.md) is a kind of "bridge" between sync and async code, that Apple provide us to rapidly write an async version.

We are going to wrap our original implementation by using `withCheckedThrowingContinuation`.

```swift
@available(iOS 15.0, *)
func load() async throws -> [Cat] {
    try await withCheckedThrowingContinuation { continuation in
        self.load { result in
            continuation.resume(with: result)
        }
    }
}
```

We are calling the other implementation and when the completion is called, we use the `continuation` to pass foward the result. So the full `RemoteCatsLoader` implementation looks like this.

```swift
class RemoteCatsLoader: CatsLoader {
    func load(completion: @escaping (Result<[Cat], Error>) -> Void) {
        let cats = [
            Cat(id: "beng", name: "Bengal"),
            Cat(id: "aege", name: "Aegean"),
            Cat(id: "beng", name: "Bengal"),
            Cat(id: "aege", name: "Aegean"),
        ]
        DispatchQueue.global().asyncAfter(deadline: .now() + 2) {
            completion(.success(cats))
        }
    }

    @available(iOS 15.0, *)
    func load() async throws -> [Cat] {
        try await withCheckedThrowingContinuation { continuation in
            self.load { result in
                continuation.resume(with: result)
            }
        }
    }
}

```

#### Using the new API in our application

Now we can use the new implementation using the async/await pattern, for example in our application we can support both versions, before iOS 15 and iOS 15 and above.

For example in a `View` to display the results we could have both implementations, like so:

```swift
struct CatsView: View {
    @State var cats: [Cat] = []
    let loader = RemoteCatsLoader()

    var body: some View {
        NavigationView {
            if #available(iOS 15.0, *) {
                CatsListView(cats: cats).task(loadAsyncCats)
            } else {
                CatsListView(cats: cats).onAppear(perform: loadCats)
            }
        }
    }

    @available(iOS 15.0, *)
    private func loadAsyncCats() async {
        do {
            let result = try await loader.load()
            self.cats = result
        } catch {
            print("Error: \(error)")
        }
    }

    private func loadCats() {
        loader.load { result in
            if case let .success(cats) = result {
                self.cats = cats
            }
        }
    }
}
```

![CatsLoader](/assets/posts/async-await/async-7.png)

You can clone the sample code from the [github repository](https://github.com/AlfredoHernandez/async-await-support)
