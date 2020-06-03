import Foundation
import KeychainAccess
import UserNotifications

private let keychain = Keychain(service: "Tempomat Keychain")

@objc(TempomatNative)
class TempomatNative: NSObject {
  let notificationCenter = UNUserNotificationCenter.current()

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
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
    notificationCenter.getNotificationSettings { (settings) in
      if settings.authorizationStatus == .authorized {
        let content = UNMutableNotificationContent()
        content.title = "Broken build"
        content.body = payload as String
        content.sound = UNNotificationSound.default

        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 10, repeats: false)

        let request = UNNotificationRequest(identifier: payload as String, content: content, trigger: trigger)

        self.notificationCenter.add(request) { (error) in
          if let error = error {
            print("Could not schedule notification", error)
          }
        }
      }
    }
    
  }

}
