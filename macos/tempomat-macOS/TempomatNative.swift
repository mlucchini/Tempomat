//Author: Oscar Franco, created on: 25.05.20

import Foundation
import KeychainAccess
import ServiceManagement

extension Notification.Name {
    static let killLauncher = Notification.Name("killLauncher")
}

private let keychain = Keychain(service: "Tempomat Keychain")

@objc(TempomatNative)
class TempomatNative: NSObject {
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc
  func setStatusButtonText(_ failed: NSInteger, running: NSInteger, passed: NSInteger) {
    DispatchQueue.main.async {
      let appDelegate = NSApp.delegate as? AppDelegate
      appDelegate?.setStatusText(failed: failed, running: running, passed: passed)
    }
  }

  @objc
  func securelyStore(_ key: NSString, payload: NSString, resolver: RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock) {
    keychain[key as String] = payload as String
    resolver(true)
  }

  @objc
  func securelyRetrieve(_ key: NSString, resolver resolve: RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock) {
    let value = keychain[key as String]
    return resolve(value)
  }

  @objc
  func sendNotification(_ payload: NSString) {
    let notification = NSUserNotification()
    notification.identifier = UUID().uuidString
    notification.subtitle = payload as String
    notification.title = "Tempomat"

    NSUserNotificationCenter.default.deliver(notification)
  }

  @objc
  func applyAutoLauncher(_ startAtLogin: Bool) {
    let launcherAppId = "com.ospfranco.tempomat-launcher"
    let runningApps = NSWorkspace.shared.runningApplications
    let launcherIsRunning = runningApps.contains {
       $0.bundleIdentifier == launcherAppId
    }
    SMLoginItemSetEnabled(launcherAppId as CFString, startAtLogin)

    if launcherIsRunning {
      DistributedNotificationCenter.default().post(name: .killLauncher, object: Bundle.main.bundleIdentifier)
    }
  }

  @objc
  func closeApp() {
    DispatchQueue.main.async {
      let appDelegate = NSApp.delegate as? AppDelegate
      appDelegate?.closeApp()
    }
  }

}
