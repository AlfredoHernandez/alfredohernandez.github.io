---
title: Simulate poor internet connection on iOS device or simulator
description: Sometimes we need to simulate a poor connection or no connection in our iOS simulator. One way to do this is disabling our WiFi from our Mac or device, but what about simulating a 3G, LTE, DSL, edge, etc connection? In this post, I want to share with you some options to do this in both an iOS simulator and a real device.
pubDatetime: 2021-03-13T12:00:00.000Z
author: Jesús Alfredo Hernández Alarcón
postSlug: simulate-poor-internet-connection
featured: false
draft: false
tags:
  - iOS
  - xcode
ogImage: ""
---

In today's fast-paced world, internet connectivity is crucial for almost all mobile applications. However, not all users have access to fast and reliable internet connections. As developers, it's essential to ensure that our applications perform well under poor network conditions. In this post, we'll explore how to simulate poor internet connectivity on iOS devices or simulators using built-in tools provided by Xcode.

So, let's dive in and learn how to simulate poor internet connectivity on iOS devices and simulators.

## iOS Simulator

To simulate different kind of networks as LTE, 3G, DSL, etc, we need to download the [Network Link Conditioner](https://idmsa.apple.com/IDMSWebAuth/signin.html?path=%2Fdownload%2Fall%2F&appIdKey=891bd3417a7776362562d2197f89480a8547b108fd934911bcbea0110d07f757&rv=0) tool. Look for your Xcode version and install it.

![https://miro.medium.com/v2/resize:fit:720/format:webp/1*K2Z2-3FG2WJV-fO34AScaA.png](https://miro.medium.com/v2/resize:fit:720/format:webp/1*K2Z2-3FG2WJV-fO34AScaA.png)

After download the .dmg file, you’ll see all available tools.

![https://miro.medium.com/v2/resize:fit:720/format:webp/1*ayvD67IMIrHjeCtXaLMzew.png](https://miro.medium.com/v2/resize:fit:720/format:webp/1*ayvD67IMIrHjeCtXaLMzew.png)

Go to `Hardware` and select `Network Link Conditioner.prefPane` After doing this, we are going to see it in our system preferences.

![https://miro.medium.com/v2/resize:fit:720/format:webp/1*P6XcfqApt9emJGEHSD6h7A.png](https://miro.medium.com/v2/resize:fit:720/format:webp/1*P6XcfqApt9emJGEHSD6h7A.png)

Now you can select any profile you need to simulate the scenario you want.

## iPhone Device

Go to your `Settings` and go to **Developer menu**.

![https://miro.medium.com/v2/resize:fit:720/format:webp/1*F_hDA6gH6p1Cv96ujENGew.png](https://miro.medium.com/v2/resize:fit:720/format:webp/1*F_hDA6gH6p1Cv96ujENGew.png)

Then select `Network Link Conditioner` and tick `Enable`

![https://miro.medium.com/v2/resize:fit:720/format:webp/1*IoDmMlEYKvT_nyI31hmd3A.png](https://miro.medium.com/v2/resize:fit:720/format:webp/1*IoDmMlEYKvT_nyI31hmd3A.png)

Like the Network Link Conditioner in macOS, you can choose a desired profile to simulate for example a poor connection (100% Loss), or a 3G connection and so on.

![https://miro.medium.com/v2/resize:fit:720/format:webp/1*rK2WfUz5n43cjo_fzrT7DA.png](https://miro.medium.com/v2/resize:fit:720/format:webp/1*rK2WfUz5n43cjo_fzrT7DA.png)

## Using Xcode

We can enable this tool from Xcode. Just go to your devices and select your iPhone or iPad. You will see the Link Conditioner at the bottom to select any profile you want.

Click on start and you’ll see on your iPhone an indicator that remembers us, and we are using the tool.

![https://miro.medium.com/v2/resize:fit:720/format:webp/1*1sufWM9yS6gHU9-0t-5Nnw.png](https://miro.medium.com/v2/resize:fit:720/format:webp/1*1sufWM9yS6gHU9-0t-5Nnw.png)

If you want to stop the Network Conditioner, select the indicator and stop it.

![https://miro.medium.com/v2/resize:fit:720/format:webp/1*bRBPxzCHFdjipHghIx5XHQ.png](https://miro.medium.com/v2/resize:fit:720/format:webp/1*bRBPxzCHFdjipHghIx5XHQ.png)

Don’t forget to disable the **Network Link Conditioner** after using it for both Mac and iPhone, otherwise your connection will be affected for your daily use.
