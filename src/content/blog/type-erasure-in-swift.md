---
title: Type erasure in Swift
description: In this article, we'll explore what type erasure is, how it works, and some common use cases for this technique in modern software development.
pubDatetime: 2023-03-17T16:57:00.000Z
author: Jesús Alfredo Hernández Alarcón
postSlug: type-erasure-in-swift
featured: true
draft: false
tags:
  - swift
ogImage: ""
---

# What is type erasure?

Type erasure is a powerful technique used in modern programming languages to abstract away the specific types of objects and to provide a more generic interface for working with related types. It allows programmers to write code that can be reused across multiple types, without the need to define separate implementations for each type.

This technique is commonly used in languages such as Swift and Kotlin, but the concept is applicable to many other programming languages as well. In this article, we'll explore what type erasure is, how it works, and some common use cases for this technique in modern software development.

We'll also look at some examples of how type erasure can be used to write more generic, reusable code, and some of the tradeoffs involved in using this technique. Whether _you're a beginner or an experienced programmer_, this article will provide valuable insights into the world of type erasure and how it can be used to write better software.

## Using type erasure to hide implementation details

In software development, it is often desirable to hide implementation details from other parts of the system, in order to reduce complexity, increase modularity, and maintain abstraction. This can be achieved using various techniques, one of which is type erasure.

Type erasure allows programmers to create a generic interface that hides the specific implementation details of an object or set of objects. By using a type-erased wrapper, the underlying type of an object can be hidden, while still providing a common interface that can be used to interact with the object.

One common use case for hiding implementation details with type erasure is in the implementation of generic data structures, such as lists or dictionaries. By using a type-erased wrapper, the specific type of the data elements can be hidden from the data structure implementation, allowing it to be more flexible and reusable across multiple types.

Another use case for hiding implementation details is in the implementation of APIs or libraries. By using type erasure to hide the specific implementation details of a library, developers can provide a more stable and predictable interface for other developers to use, while still allowing them to take advantage of the library's underlying implementation.

Overall, hiding implementation details with type erasure is a powerful technique that can help to reduce complexity and increase the modularity of software systems. By abstracting away the specific implementation details of objects or sets of objects, programmers can create more generic, reusable code that is easier to maintain and extend over time.

## Applying type erasure in Swift

In Swift, type erasure is a technique for creating a single, generic interface for a set of related types. It involves hiding the specific type of an object and only exposing a common, generic type that is used to interact with the object.

Type erasure is often used when you have a set of related types that share some common behavior or functionality, but that cannot all be expressed using a single protocol or superclass. For example, you might have a set of different types that can all be sorted, but that don't all conform to the same sorting protocol. To provide a single, generic interface for these types, you can create a type-erased wrapper that exposes a common interface for sorting, regardless of the specific type of the underlying object.

In Swift, type erasure is typically implemented using a combination of a generic protocol and a concrete type that conforms to that protocol. The generic protocol defines the common interface for the set of related types, and the concrete type provides the implementation for that interface.

Here is an example of how type erasure can be used in Swift to create a type-erased wrapper for a set of types that can all be sorted:

```swift
protocol Sortable {
    func sort() -> [Int]
}

struct BubbleSort<T: Comparable>: Sortable {
    var items: [T]

    func sort() -> [Int] {
        // Implementation of bubble sort
        return [1, 2, 3]
    }
}

struct QuickSort<T: Comparable>: Sortable {
    var items: [T]

    func sort() -> [Int] {
        // Implementation of quick sort
        return [1, 2, 3]
    }
}

struct AnySortable: Sortable {
    private let _sort: () -> [Int]

    init<T: Sortable>(_ sortable: T) {
        _sort = sortable.sort
    }

    func sort() -> [Int] {
        return _sort()
    }
}

let bubbleSort = BubbleSort(items: [3, 2, 1])
let quickSort = QuickSort(items: [3, 2, 1])
let anySortable1 = AnySortable(bubbleSort)
let anySortable2 = AnySortable(quickSort)

print(anySortable1.sort()) // [1, 2, 3]
print(anySortable2.sort()) // [1, 2, 3]
```

In this example, the `Sortable` protocol defines a common interface for the set of related types that can all be sorted. The `BubbleSort` and `QuickSort` structs implement this protocol with their own sorting implementations.

The `AnySortable` struct is a type-erased wrapper that provides a common interface for sorting, regardless of the specific type of the underlying object. It takes any object that conforms to the `Sortable` protocol and stores its `sort()` implementation as a closure. The `AnySortable` struct then provides its own implementation of the `sort()` method that simply calls the stored closure.

By using the `AnySortable` wrapper, we can create a single, generic interface for the set of related types that can all be sorted, regardless of their specific implementation. This allows us to write more generic and reusable code.
