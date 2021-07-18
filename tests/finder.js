const test = require("kuta").test;
const finder = require("../src/finder");
const assert = require("assert");
const _ = require("./utils");

test("it should find the electron.asar file", () => {
  assert.deepEqual(
    ["Hyper.app/Contents/Resources/electron.asar"],
    finder.asar(_.getEntries("Hyper-3.0.2-mac.zip"))
  );
});

test("it should find the correct binary file", () => {
  assert.deepEqual(
    "Hyper.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework",
    finder.binary(_.getEntries("Hyper-3.0.2-mac.zip"))
  );
  assert.deepEqual(
    "Notable.exe",
    finder.binary(_.getEntries("Notable-1.8.4-win.zip"))
  );
  assert.deepEqual(
    "rambox",
    finder.binary(_.getEntries("Rambox-0.7.7-linux-x64.zip"))
  );
});

test("it should find the version file", () => {
  assert.deepEqual(
    ["chronobreak-linux-x64/version"],
    finder.version(_.getEntries("chronobreak-linux-x64.zip"))
  );
  assert.deepEqual(
    ["release-builds/encrypt0r-darwin-x64/version"],
    finder.version(_.getEntries("encrypt0r-mac.zip"))
  );
  assert.deepEqual(
    [
      "Arizona v.1.0.0/resources/app/node_modules/electron/dist/version",
      "Arizona v.1.0.0/version",
    ],
    finder.version(_.getEntries("Arizona-v1.0.0-beta-Windows.zip"))
  );
});

test("it should find fingerprinteable files", () => {
  assert.deepEqual(
    [
      "Arizona v.1.0.0/Arizona.exe",
      "Arizona v.1.0.0/d3dcompiler_47.dll",
      "Arizona v.1.0.0/ffmpeg.dll",
      "Arizona v.1.0.0/libEGL.dll",
      "Arizona v.1.0.0/libGLESv2.dll",
      "Arizona v.1.0.0/resources/app/node_modules/.bin/electron",
      "Arizona v.1.0.0/resources/app/node_modules/electron/dist/d3dcompiler_47.dll",
      "Arizona v.1.0.0/resources/app/node_modules/electron/dist/electron.exe",
      "Arizona v.1.0.0/resources/app/node_modules/electron/dist/ffmpeg.dll",
      "Arizona v.1.0.0/resources/app/node_modules/electron/dist/libEGL.dll",
      "Arizona v.1.0.0/resources/app/node_modules/electron/dist/libGLESv2.dll",
      "Arizona v.1.0.0/resources/app/node_modules/electron/dist/resources/default_app.asar",
      "Arizona v.1.0.0/resources/app/node_modules/electron/dist/snapshot_blob.bin",
      "Arizona v.1.0.0/resources/app/node_modules/electron/dist/swiftshader/libEGL.dll",
      "Arizona v.1.0.0/resources/app/node_modules/electron/dist/swiftshader/libGLESv2.dll",
      "Arizona v.1.0.0/resources/app/node_modules/electron/dist/v8_context_snapshot.bin",
      "Arizona v.1.0.0/resources/app/node_modules/electron/dist/vk_swiftshader.dll",
      "Arizona v.1.0.0/resources/app/node_modules/electron/dist/vulkan-1.dll",
      "Arizona v.1.0.0/resources/app/node_modules/rcedit/bin/rcedit.exe",
      "Arizona v.1.0.0/resources/app/node_modules/rcedit/bin/rcedit-x64.exe",
      "Arizona v.1.0.0/resources/default_app.asar",
      "Arizona v.1.0.0/snapshot_blob.bin",
      "Arizona v.1.0.0/swiftshader/libEGL.dll",
      "Arizona v.1.0.0/swiftshader/libGLESv2.dll",
      "Arizona v.1.0.0/v8_context_snapshot.bin",
      "Arizona v.1.0.0/vk_swiftshader.dll",
      "Arizona v.1.0.0/vulkan-1.dll",
    ],
    finder.fingerprintable(_.getEntries("Arizona-v1.0.0-beta-Windows.zip"))
  );
  assert.deepEqual(
    [
      "Lax-win32-x64/v8_context_snapshot.bin",
      "Lax-win32-x64/d3dcompiler_47.dll",
      "Lax-win32-x64/vk_swiftshader.dll",
      "Lax-win32-x64/ffmpeg.dll",
      "Lax-win32-x64/Lax.exe",
      "Lax-win32-x64/snapshot_blob.bin",
      "Lax-win32-x64/libEGL.dll",
      "Lax-win32-x64/libGLESv2.dll",
      "Lax-win32-x64/swiftshader/libEGL.dll",
      "Lax-win32-x64/swiftshader/libGLESv2.dll",
    ],
    finder.fingerprintable(_.getEntries("Lax-win32-x64.zip"))
  );

  assert.deepEqual(
    [
      "resources/app.asar",
      "swiftshader/libvk_swiftshader.so",
      "libGLESv2.so",
      "swiftshader/libGLESv2.so",
      "libffmpeg.so",
      "v8_context_snapshot.bin",
      "snapshot_blob.bin",
      "swiftshader/libEGL.so",
      "libEGL.so",
      "natives_blob.bin",
    ],
    finder.fingerprintable(_.getEntries("Rambox-0.7.7-linux-x64.zip"))
  );

  assert.deepEqual(
    [
      "chronobreak-linux-x64/libEGL.so",
      "chronobreak-linux-x64/libffmpeg.so",
      "chronobreak-linux-x64/libGLESv2.so",
      "chronobreak-linux-x64/libvk_swiftshader.so",
      "chronobreak-linux-x64/libvulkan.so",
      "chronobreak-linux-x64/resources/app.asar",
      "chronobreak-linux-x64/snapshot_blob.bin",
      "chronobreak-linux-x64/swiftshader/libEGL.so",
      "chronobreak-linux-x64/swiftshader/libGLESv2.so",
      "chronobreak-linux-x64/v8_context_snapshot.bin",
    ],
    finder.fingerprintable(_.getEntries("chronobreak-linux-x64.zip"))
  );

  assert.deepEqual(
    [
      "Hyper.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/libnode.dylib",
      "Hyper.app/Contents/Resources/app.asar",
      "Hyper.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/libffmpeg.dylib",
      "Hyper.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Resources/v8_context_snapshot.bin",
      "Hyper.app/Contents/Resources/electron.asar",
      "Hyper.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Resources/natives_blob.bin",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACSignal+Operations.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/metamacros.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACStream.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACSignal.h",
      "Hyper.app/Contents/Frameworks/Mantle.framework/Versions/A/Headers/MTLManagedObjectAdapter.h",
      "Hyper.app/Contents/Frameworks/Squirrel.framework/Versions/A/Headers/SQRLUpdater.h",
      "Hyper.app/Contents/Frameworks/Mantle.framework/Versions/A/Headers/MTLJSONAdapter.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACScheduler.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACSequence.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACTuple.h",
      "Hyper.app/Contents/Frameworks/Mantle.framework/Versions/A/Headers/MTLModel.h",
      "Hyper.app/Contents/Frameworks/Mantle.framework/Versions/A/Headers/MTLModel+NSCoding.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACCommand.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/NSObject+RACPropertySubscribing.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACKVOChannel.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/EXTScope.h",
      "Hyper.app/Contents/Frameworks/Mantle.framework/Versions/A/Headers/NSValueTransformer+MTLPredefinedTransformerAdditions.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/ReactiveCocoa.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/NSObject+RACSelectorSignal.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACBacktrace.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACChannel.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/NSObject+RACLifting.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/EXTKeyPathCoding.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACSubscriptingAssignmentTrampoline.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACMulticastConnection.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/NSObject+RACAppKitBindings.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACCompoundDisposable.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACSubscriber.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACSerialDisposable.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACEvent.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACTestScheduler.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACQueueScheduler+Subclass.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/NSDictionary+RACSequenceAdditions.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/NSObject+RACDeallocating.h",
      "Hyper.app/Contents/Frameworks/Mantle.framework/Versions/A/Headers/MTLValueTransformer.h",
      "Hyper.app/Contents/Frameworks/Squirrel.framework/Versions/A/Headers/SQRLUpdate.h",
      "Hyper.app/Contents/Frameworks/Squirrel.framework/Versions/A/Headers/SQRLDownloadedUpdate.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACDisposable.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACScheduler+Subclass.h",
      "Hyper.app/Contents/Frameworks/Mantle.framework/Versions/A/Headers/NSArray+MTLManipulationAdditions.h",
      "Hyper.app/Contents/Frameworks/Mantle.framework/Versions/A/Headers/Mantle.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/NSUserDefaults+RACSupport.h",
      "Hyper.app/Contents/Frameworks/Mantle.framework/Versions/A/Headers/NSDictionary+MTLManipulationAdditions.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/NSURLConnection+RACSupport.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACTargetQueueScheduler.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACReplaySubject.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/NSString+RACSupport.h",
      "Hyper.app/Contents/Frameworks/Squirrel.framework/Versions/A/Headers/Squirrel.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/NSControl+RACTextSignalSupport.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/NSControl+RACCommandSupport.h",
      "Hyper.app/Contents/Frameworks/Squirrel.framework/Versions/A/Headers/NSBundle+SQRLVersionExtensions.h",
      "Hyper.app/Contents/Frameworks/Mantle.framework/Versions/A/Headers/NSValueTransformer+MTLInversionAdditions.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACSubject.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/NSString+RACSequenceAdditions.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/NSData+RACSupport.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/NSIndexSet+RACSequenceAdditions.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACQueueScheduler.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACBehaviorSubject.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/NSOrderedSet+RACSequenceAdditions.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/NSArray+RACSequenceAdditions.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACScopedDisposable.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/NSSet+RACSequenceAdditions.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/NSEnumerator+RACSequenceAdditions.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACGroupedSignal.h",
      "Hyper.app/Contents/Frameworks/Squirrel.framework/Versions/A/Headers/NSProcessInfo+SQRLVersionExtensions.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/NSNotificationCenter+RACSupport.h",
      "Hyper.app/Contents/Frameworks/Mantle.framework/Versions/A/Headers/NSObject+MTLComparisonAdditions.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/NSText+RACSignalSupport.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/RACUnit.h",
      "Hyper.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A/Headers/NSFileHandle+RACSupport.h",
    ],
    finder.fingerprintable(_.getEntries("Hyper-3.0.2-mac.zip"))
  );

  assert.deepEqual(
    [
      "Notable.exe",
      "libGLESv2.dll",
      "resources/app.asar",
      "d3dcompiler_47.dll",
      "swiftshader/libGLESv2.dll",
      "ffmpeg.dll",
      "v8_context_snapshot.bin",
      "swiftshader/libEGL.dll",
      "snapshot_blob.bin",
      "libEGL.dll",
      "natives_blob.bin",
    ],
    finder.fingerprintable(_.getEntries("Notable-1.8.4-win.zip"))
  );

  assert.deepEqual(
    [
      "release-builds/encrypt0r-darwin-x64/encrypt0r.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/libGLESv2.dylib",
      "release-builds/encrypt0r-darwin-x64/encrypt0r.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/libswiftshader_libGLESv2.dylib",
      "release-builds/encrypt0r-darwin-x64/encrypt0r.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/libffmpeg.dylib",
      "release-builds/encrypt0r-darwin-x64/encrypt0r.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/libEGL.dylib",
      "release-builds/encrypt0r-darwin-x64/encrypt0r.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/libvk_swiftshader.dylib",
      "release-builds/encrypt0r-darwin-x64/encrypt0r.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/libswiftshader_libEGL.dylib",
      "release-builds/encrypt0r-darwin-x64/encrypt0r.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Resources/v8_context_snapshot.x86_64.bin",
      "release-builds/encrypt0r-darwin-x64/encrypt0r.app/Contents/Frameworks/Electron Framework.framework/Versions/Current/Libraries/libGLESv2.dylib",
      "release-builds/encrypt0r-darwin-x64/encrypt0r.app/Contents/Frameworks/Electron Framework.framework/Versions/Current/Libraries/libswiftshader_libGLESv2.dylib",
      "release-builds/encrypt0r-darwin-x64/encrypt0r.app/Contents/Frameworks/Electron Framework.framework/Versions/Current/Libraries/libffmpeg.dylib",
      "release-builds/encrypt0r-darwin-x64/encrypt0r.app/Contents/Frameworks/Electron Framework.framework/Versions/Current/Libraries/libEGL.dylib",
      "release-builds/encrypt0r-darwin-x64/encrypt0r.app/Contents/Frameworks/Electron Framework.framework/Versions/Current/Libraries/libvk_swiftshader.dylib",
      "release-builds/encrypt0r-darwin-x64/encrypt0r.app/Contents/Frameworks/Electron Framework.framework/Versions/Current/Libraries/libswiftshader_libEGL.dylib",
      "release-builds/encrypt0r-darwin-x64/encrypt0r.app/Contents/Frameworks/Electron Framework.framework/Versions/Current/Resources/v8_context_snapshot.x86_64.bin",
      "release-builds/encrypt0r-darwin-x64/encrypt0r.app/Contents/Frameworks/Electron Framework.framework/Libraries/libGLESv2.dylib",
      "release-builds/encrypt0r-darwin-x64/encrypt0r.app/Contents/Frameworks/Electron Framework.framework/Libraries/libswiftshader_libGLESv2.dylib",
      "release-builds/encrypt0r-darwin-x64/encrypt0r.app/Contents/Frameworks/Electron Framework.framework/Libraries/libffmpeg.dylib",
      "release-builds/encrypt0r-darwin-x64/encrypt0r.app/Contents/Frameworks/Electron Framework.framework/Libraries/libEGL.dylib",
      "release-builds/encrypt0r-darwin-x64/encrypt0r.app/Contents/Frameworks/Electron Framework.framework/Libraries/libvk_swiftshader.dylib",
      "release-builds/encrypt0r-darwin-x64/encrypt0r.app/Contents/Frameworks/Electron Framework.framework/Libraries/libswiftshader_libEGL.dylib",
      "release-builds/encrypt0r-darwin-x64/encrypt0r.app/Contents/Frameworks/Electron Framework.framework/Resources/v8_context_snapshot.x86_64.bin",
    ],
    finder.fingerprintable(_.getEntries("encrypt0r-mac.zip"))
  );
});
