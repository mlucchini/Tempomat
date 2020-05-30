//
//  main.swift
//  TempomatLauncher
//
//  Created by Oscar Franco on 01.05.20.
//  Copyright © 2020 ospfranco. All rights reserved.
//

import Foundation
import AppKit

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate

_ = NSApplicationMain(CommandLine.argc, CommandLine.unsafeArgv)
