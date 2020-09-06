---
title: Memory Leaks en iOS
tags: [ios, swift, xcode]
style: fill
color: primary
description: Un primer vistazo a los Memory Leaks en iOS, explicado de una manera muy simple y fácil de entender.
---

En la entrada de hoy hablaremos:

- ¿Qué son los **Memory Leaks**?
- ¿Cómo se generan los memory leaks en una aplicacion de iOS? 
- ¿Cómo detectarlos?

## ¿Qué son los Memory Leaks?

Este término seguramente ya lo has escuchado antes, y es que no está limitado solo a cuando estamos desarrollando aplicaciones en iOS. Un *Memory Leak* (o en español un "Fuga de memoria") sucede cuando un espacio en memoria no se pudo liberar.

Sin embargo, aún cuando sabemos que se deben evitar, nos hemos econtrado en algunos casos en que la aplicación empieza a consumir mas memoria de lo que debería, a veces algunos *crashes* en las applicaciones, etc.

Evidentemente debemos corregir estos issues. Y es aquí cuando a veces se empieza a complicar un poco la situación, porque dependiendo del tamaño de la aplicación y cómo esté el *codebase* puede ser tan simple o complejo el detectarlos.

*Swift* utiliza el *Automatic Reference Counting ([ARC](https://docs.swift.org/swift-book/LanguageGuide/AutomaticReferenceCounting.html))* que se encarga de la administracion de memoria y así no delegarnos la responsabilidad a nosotros. El ARC (de una manera simple) lo podemos ver tal cual, como un contado de referencias, que automaticamente libera la memoria usada por instancias una vez que este contador llega a cero. 

>  ARC will not deallocate an instance as long as at least one active reference to that instance still exists.

Para comprenderlo mejor, analicemos el siguiente caso: 

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

Tenemos dos variables, las cuales hacen referencia a dos objetos `Child` y `Parent`. En este momento el *ARC* tiene una referencia para el objeto `Child` y otra para el objeto `Parent`.

![Memory Leaks 1](./../assets/images/memory-leaks-1.png)

Cuando a `john` se le asigna a su variable `parent` la referencia de `mom`, el ARC incrementa en 1 el contador de referencia de `Parent`. El estado quedaria de la siguiente manera:

![Memory Leaks 2](./../assets/images/memory-leaks-2.png)

Lo mismo sucede cuando a `mom` se le asigna a su variable `child` la referencia de `john`, el contador de referencias de `Child` incrementa en 1. En este momento el estado quedaria de la siguiente manera:

![Memory Leaks 3](./../assets/images/memory-leaks-3.png)

Como podemos notar en el diagrama, existen dos referencias para ambos objetos. Dos de estas referencias son de los objectos `john` y `mom`, que son asignadas **en la creación de dichos objetos**. Las otras dos son referencias que se hacen por medio de las variables de los objetos `john` y `mom`.

Pero... ¿Qué sucedería si ahora la referencia de `john` y `mom` las hacemos `nil`? ¿Què pasa con el *ARC*? 

```swift
john = nil
mom = nil
```

En este momento el estado del ARC quedaria de la siguiente manera:

![Memory Leaks 4](./../assets/images/memory-leaks-4.png)

Como podemos notar aún existen referencias hacia `Parent` y `Child`, pero una vez que perdimos las referencias de `john` y `mom`, no podemos "hace nil" las referencias de `jhon.parent` ni `mom.child` porque perdimos el acceso a dichas instancias. Como resultado tenemos un Memory Leak.

Este caso es conocido como Ciclo de Retencion (Retain Cycle). **Ciclo** porque ambas referencias apuntan entre si, generando un circulo de referencias de memoria. **Retención** porque las referencias a dichos objetos siguen en memoria.

### ¿Comó comprobamos que realmente siguen dichas instancias en memoria? 

Una manera fácil de comprobar esto es agregar a cada clase, dentro del desinicializador (deinitializer) una simple línea **print** para observar en el log que realmente dichos desinicializadores nuca son llamados. Podemos correr nuestra aplicación  iOS y observar en el log que nunca se muestran los mensajes de **print**.

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
![Memory Leaks 5](./../assets/images/memory-leaks-5.png)

## Detectando Memory Leaks con Instruments