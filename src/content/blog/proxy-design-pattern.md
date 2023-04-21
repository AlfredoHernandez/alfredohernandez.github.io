---
title: The Proxy Design Pattern
description: In this post we talk about the Proxy design pattern and a simple example how to use it, in this case, in iOS applications to prevent retain cycles in an effective and clean way.
pubDatetime: 2021-02-23T12:00:00.000Z
author: Jesús Alfredo Hernández Alarcón
postSlug: proxy-design-pattern
featured: false
draft: false
tags:
  - swift
  - design-patterns
ogImage: ""
---

### What is the Proxy design pattern?

As defined in the book [Design Patterns](https://www.goodreads.com/book/show/85009.Design_Patterns) by Gamma, Johnson, Vlissides, Helm and collaborators, the proxy design pattern is defined:

> Provide a surrogate or placeholder for another object to control access to it. It makes consumers believe they’re talking to the real implementation.

And its diagram looks like this:

![Diagram](/assets/posts/virtual-proxy/Proxy_pattern_diagram.png)

_Diagram from [Wikipedia](https://en.wikipedia.org/wiki/Proxy_pattern#/media/File:Proxy_pattern_diagram.svg)_

If this is the first time that you hear about this design pattern, it can be a little confused, and their propourse can be not clear at all. But let me give you an example to try to explain where can use this design pattern.

### Using a proxy in the MVP UI design pattern

When we are working with a UI design pattern like MVP in iOS applications, we notice that a retain cycle can be created if we don't **weakify** the view controller due a two-way communication channel between `View` and `Presenter`. Let's see the diagram:

![MVP Diagram](/assets/posts/virtual-proxy/mvp.png)

For example:

```swift
// MARK: - UI

class ViewController: UIViewController, View {
    var presenter: Presenter?

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemBackground
        presenter?.didRequestMessage()
    }

    func display(_ viewModel: ViewModel) {
        print(viewModel.message)
    }
}

// MARK: - Presenter

struct ViewModel {
    let message: String
}

protocol View {
    func display(_ viewModel: ViewModel)
}

class Presenter {
    private let fetcher: FetchMessage
    private let view: View

    init(fetcher: FetchMessage, view: View) {
        self.fetcher = fetcher
        self.view = view
    }

    func didRequestMessage() {
        fetcher.get { [weak self] message in
            self?.view.display(ViewModel(message: message))
        }
    }
}

// MARK: - Business logic

class FetchMessage {
    func get(completion: @escaping (String) -> Void) {
        completion("Hello, World!")
    }
}
```

As we can see, we need to be careful with the connection between the `Presenter` and the `Controller` due the two-way communication. One way that solves the problem is making `weak` the reference between the presenter and the controller.

```swift
private weak var view: View?
```

But doing this, generates the following compiler error:

> 'weak' must not be applied to non-class-bound 'View'; consider adding a protocol conformance that has a class bound

We can easily solve this compilation error is making the protocol only for classes (using the `class` keyword to make the protocol Class-Only). This constraint is defined as `The protocol to which all classes implicitly conform.` like this:

```swift
protocol View: class {
    func display(_ viewModel: ViewModel)
}
```

This solves our problem, but doing this we expose memory management in the presenter. Ideally we need to deal with it in the composition root. Until now, our composition root looks like this:

```swift
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo _: UISceneSession, options _: UIScene.ConnectionOptions) {
        guard let scene = (scene as? UIWindowScene) else { return }
        window = UIWindow(windowScene: scene)
        window?.rootViewController = Composer.composeWith(fetcher: FetchMessage())
        window?.makeKeyAndVisible()
    }
}

class Composer {
    static func composeWith(fetcher: FetchMessage) -> ViewController {
        let controller = ViewController()
        let presenter = Presenter(fetcher: fetcher, view: controller)
        controller.presenter = presenter
        return controller
    }
}
```

To move the memory management from the `Presenter` into `CompositionRoot` we can create a proxy, where we can _make consumers believe they’re talking to the real implementation_. So, How does look like the proxy implementation?

```swift
class WeakRefProxy: View {
    weak var view: (View & AnyObject)?

    init(_ view: View & AnyObject) {
        self.view = view
    }

    func display(_ viewModel: ViewModel) {
        view?.display(viewModel)
    }
}
```

Also remove the class only constraint in the `View` protocol and make our `view: View` variable let again:

```swift
protocol View { // Remove class constraint
    func display(_ viewModel: ViewModel)
}

class Presenter {
    private let fetcher: FetchMessage
    private let view: View // Restore to a let

    init(fetcher: FetchMessage, view: View) {
        self.fetcher = fetcher
        self.view = view
    }

    func didRequestMessage() {
        fetcher.get { [weak self] message in
            self?.view.display(ViewModel(message: message))
        }
    }
}
```

In the _Proxy design pattern_ we have a <<Subject Interface>> that in this case is our `View` protocol. Also we require a `RealSubject` and the `Proxy`, that in this case our _RealSubject_ is the `ViewController` class and our _Proxy_ is of course the `WeakRefProxy` class.

![Diagram](/assets/posts/virtual-proxy/WeakRefDiagram.png)

In the `WeakRefProxy` we surrogate the real implementation with a `weak` reference to it, that's all we want to avoid retain cycles. And now our `Composition Root` looks like this:

```swift
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo _: UISceneSession, options _: UIScene.ConnectionOptions) {
        guard let scene = (scene as? UIWindowScene) else { return }
        window = UIWindow(windowScene: scene)
        window?.rootViewController = Composer.composeWith(fetcher: FetchMessage())
        window?.makeKeyAndVisible()
    }
}

class Composer {
    static func composeWith(fetcher: FetchMessage) -> ViewController {
        let controller = ViewController()
        let presenter = Presenter(fetcher: fetcher, view: WeakRefProxy(controller))
        controller.presenter = presenter
        return controller
    }
}
```

We moved the memory management from the `Presenter` into the `CompositionRoot`, by doing so, we don't need to cover the requirement to constrain all view protocols to be classes in MVP and don't leak composition details in the presenter implementation.

### Making generic our WeakRef Proxy

Of course, creating a `WeakRefProxy` can be very tedious, so we ca create a generic one and implement the `View` methods into a extension, like so:

```swift
class WeakRefProxy<T: AnyObject> {
    weak var object: T?

    init(_ object: T) {
        self.object = object
    }
}
```

```swift
extension WeakRefProxy: View where T: View {
    func display(_ viewModel: ViewModel) {
        object?.display(viewModel)
    }
}
```

You can find the example source code on github: [https://github.com/alfredohdzdev/WeakRef](https://github.com/alfredohdzdev/WeakRef)
