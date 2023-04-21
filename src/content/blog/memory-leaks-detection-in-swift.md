---
title: Detecting memory leaks using Unit Tests in Swift
description: Memory management is a topic that every time we write code, it needs to be handled.
pubDatetime: 2021-02-27T12:00:00.000Z
author: Jesús Alfredo Hernández Alarcón
postSlug: memory-leaks-detection-in-swift
featured: true
draft: false
tags:
  - swift
  - memory-management
ogImage: ""
---

Memory management is a topic that every time we write code, it needs to be handled. Fortunately Swift helps us with the Automatic Reference Counting (ARC). But human errors are still there and as we saw in the last entry one common mistake we commit is Retain Cycles.

A retain cycle is generated when an Object A retains another Object B and Object B retains Object A. Let’s see an example:

Suppose we have two objects Parent and Child, and create two references to it.

![https://miro.medium.com/v2/resize:fit:402/format:webp/1*ALalyzonqp2-Rn9ZewVffg.png](https://miro.medium.com/v2/resize:fit:402/format:webp/1*ALalyzonqp2-Rn9ZewVffg.png)

```swift
class Child {
    var parent: Parent?
}

class Parent {
    var child: Child?
}

var john: Child? = Child()
var mom: Parent? = Parent()

john.parent = mom
mom.child = john
```

Notice that both variables are optional and then we assign their properties to the other object (A to B and B to A). After assign `john.parent` and `mom.child`, ARC looks like this:

ARC acting from A to B
![https://miro.medium.com/v2/resize:fit:402/format:webp/1*736oml1o4pP3-LvIi6jOUg.png](https://miro.medium.com/v2/resize:fit:402/format:webp/1*736oml1o4pP3-LvIi6jOUg.png)

ARC acting from B to A
![https://miro.medium.com/v2/resize:fit:402/format:webp/1*c5cicJGb2dMb9fDY3vNsPA.png](https://miro.medium.com/v2/resize:fit:402/format:webp/1*c5cicJGb2dMb9fDY3vNsPA.png)

But what happen if we lost references from `mom` and `john` variables? Answer is we generate a **retain cycle**. By making both variables as `nil` we lost references but they still retains each other.

![https://miro.medium.com/v2/resize:fit:402/format:webp/1*Fy7XAqgwpSV94qKIXRAqBA.png](https://miro.medium.com/v2/resize:fit:402/format:webp/1*Fy7XAqgwpSV94qKIXRAqBA.png)

### An archaic way to detect memory leaks:

An easy way to “detect” if we have memory leaks can be add in the deinitializer a simple `print` with a message to verify that `deinit` are never called.

```swift
class Child {
    var parent: Parent?

    deinit {
        print("Child deinit called")
    }
}

class Parent {
    var child: Child?

    deinit {
        print("Parent denit called")
    }
}
```

Run your code and you are going to see that `deinit` never is called.

![https://miro.medium.com/v2/resize:fit:546/format:webp/1*8L7gaLbUCdmKKiIolc8Q4w.png](https://miro.medium.com/v2/resize:fit:546/format:webp/1*8L7gaLbUCdmKKiIolc8Q4w.png)

### Detecting memory leaks with unit tests:

To detect a memory leak we can add in each test an assertion to verify if our object is different to `nil` after our test finish. But [XCTest framework](https://developer.apple.com/documentation/xctest) provide us a `tearDown` block to add behaviour after each test finish. So let’s take advantage from this feature.

Let’s add a function to `child` called `sayHello()` that only returns a “Hello!” string, and write a test like this:

```swift
final class ParentAndChildTests: XCTestCase {
    func test_sayHello_saysHello() {
        let parent = Parent()
        let child = Child()

        child.parent = parent
        parent.child = child

        XCTAssertEqual(child.sayHello(), "Hello!")

        addTeardownBlock { [weak parent, weak child] in
            XCTAssertNil(parent, "`parent` should have been deallocated. Potential memory leak!")
            XCTAssertNil(child, "`child` should have been deallocated. Potential memory leak!")
        }
    }
}
```

As you can see we add at the end of the test a `tearDown` block where we assert if `parent` and `child` are `nil`.

> Notice that we need to **“weakify”** `parent` and `child` inside tear down block

By running this test, we’ll see the following assertion errors:

![https://miro.medium.com/v2/resize:fit:640/format:webp/1*7yRVutRW5rARfsMd0BAQxA.png](https://miro.medium.com/v2/resize:fit:640/format:webp/1*7yRVutRW5rARfsMd0BAQxA.png)

And that’s it, we have detected memory leaks easily from unit tests!

### Improving memory leaks tracking:

Of course to track memory leaks, we need to add assertions in every test, but it can be better. You can create a XCTestCase helper.

```swift
    func trackForMemoryLeaks(_ instance: AnyObject, file: StaticString = #filePath, line: UInt = #line) {
        addTeardownBlock { [weak instance] in
            XCTAssertNil(instance, "Instance should have been deallocated. Potential memory leak!", file: file, line: line)
        }
    }
}
```

And then in our test class, we can create a makeSUT helper to create our [system under test](https://en.wikipedia.org/wiki/System_under_test) and add memory leaks tracking.

```swift
final class ParentAndChildTests: XCTestCase {
    func test_sayHello() {
        let (child, _ ) = makeSUT()

        XCTAssertEqual(child.sayHello(), "Hello!")
    }

    private func makeSUT(file: StaticString = #filePath, line: UInt = #line) -> (Child, Parent){
        let parent = Parent()
        let sut: Child = Child()
        sut.parent = parent
        parent.child = sut
        trackForMemoryLeaks(sut, file: file, line: line)
        trackForMemoryLeaks(parent, file: file, line: line)
        return (sut, parent)
    }
}
```

You can track memory leaks for each tests by using this makeSUT factory helper and avoid repeating code and code is more clean.

You can see more examples how to use this helper in my github repository: [https://github.com/AlfredoHernandez/HackrNews/tree/develop/HackrNewsTests](https://github.com/AlfredoHernandez/HackrNews/tree/develop/HackrNewsTests)

### How to solve the memory leak?

By default, references to classes in Swift are strong type(strong reference), so each child class will remain “alive” as long as the parent class is also alive. If the parent class dies, as a consequence the child class also dies.

Recall that when they “die”, the reference counters of the parent and child classes are decremented by one.

To break up retain cycle is simple as making weak eather `child.parent` or `parent.child` variables. It depends on our use case. In this case we make `weak` child’s parent.

![https://miro.medium.com/v2/resize:fit:640/format:webp/1*Voxfa3fRl7zClUrLjYjr5A.png](https://miro.medium.com/v2/resize:fit:640/format:webp/1*Voxfa3fRl7zClUrLjYjr5A.png)

```swift
weak var parent: Parent?
```

And run the test again and test will pass.

![https://miro.medium.com/v2/resize:fit:720/format:webp/1*Ec4Zde_w27mbam1SA2WCoQ.png](https://miro.medium.com/v2/resize:fit:720/format:webp/1*Ec4Zde_w27mbam1SA2WCoQ.png)

So what happen with the ARC now?

![https://miro.medium.com/v2/resize:fit:402/format:webp/1*OTEotWsKypCChGF0zUMaKA.png](https://miro.medium.com/v2/resize:fit:402/format:webp/1*OTEotWsKypCChGF0zUMaKA.png)

Remember: weak and unowned variables does not increment the ARC.

For more information how ARC handles weak and unowned reference, you can visit the official swift documentation: [https://docs.swift.org/swift-book/LanguageGuide/AutomaticReferenceCounting.html](https://docs.swift.org/swift-book/LanguageGuide/AutomaticReferenceCounting.html)

---

One more thing:

This technique has been applied and learned because of the great work from [essentialdeveloper.com](https://www.essentialdeveloper.com). Let’s get a look into their great and valuable content.
