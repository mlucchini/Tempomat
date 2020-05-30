//Author: Oscar Franco, created on: 25.05.20

#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(TempomatNative, NSObject)

RCT_EXTERN_METHOD(securelyStore: (NSString)key payload:(NSString)payload resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(securelyRetrieve: (NSString)key resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(sendNotification: (NSString)payload)

@end
