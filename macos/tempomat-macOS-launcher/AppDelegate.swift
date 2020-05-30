//
//  AppDelegate.swift
//  TempomatLauncher
//
//  Created by Oscar Franco on 21.04.20.
//  Copyright © 2020 ospfranco. All rights reserved.
//

import Cocoa

extension Notification.Name {
    static let killLauncher = Notification.Name("killLauncher")
}

class AppDelegate: NSObject, NSApplicationDelegate {

    var window: NSWindow!

    func applicationDidFinishLaunching(_ aNotification: Notification) {
        let mainAppIdentifier = "com.ospfranco.tempomat"
        let runningApps = NSWorkspace.shared.runningApplications
        let mainIsRunning = runningApps.contains { $0.bundleIdentifier == mainAppIdentifier }

        if !mainIsRunning {
            DistributedNotificationCenter.default().addObserver(
                self,
                selector: #selector(self.terminate),
                name: .killLauncher,
                object: mainAppIdentifier
            )

            let path = Bundle.main.bundlePath as NSString
            var components = path.pathComponents

            // I don't know why is it removing stuff check path components later
            components.removeLast()
            components.removeLast()
            components.removeLast()
            components.append("MacOS")
            components.append("Tempomat") //main app name

            let newPath = NSString.path(withComponents: components)

            NSWorkspace.shared.launchApplication(newPath)
        } else {
            self.terminate()
        }
    }

    func applicationWillTerminate(_ aNotification: Notification) {
        // Insert code here to tear down your application
    }

    @objc func terminate() {
        NSApp.terminate(nil)
    }
}
