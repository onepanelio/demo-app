
# Onepanel Demo Application
This app showcases a full pipeline, right from Data Captute using remote devices and uploading to Onepanel Datasets using API's hosted at Onepanel Workspaces, Using these data to annotate using CVAT at Onepanel at training model , deploying these models using API's and hopw to consume them using remote / Mobile devices. 

This application is targeted to run on android and ios devices.

Currently, the application host the following features,
1. On-device object detection using SSD models trained on Onepanel.
2. On-device object classification using models trained on Onepanel.
3. Record & Upload video dataset  to train model running in upstream server hosted on Onepanel Workspaces.
4. Configurable API endpoints to classify, detect and upload dataset. These API endpoints are hosted in Onepanel Workspaces.
5. Supports multiple model types  to run inference realtime on device. (currently not configurable) 

## App Structure
![App Flow Diagram](/assets/mobile_app_flow.png)


## Getting Started

This application is a React Native Project and the base of the application is built from the `create-react-native-app` cli tool.

### Prerequisites

The application expects the following tools installed to build the application.

**#1.  NodeJS** \
You can download the binaries for NodeJs from [here](https://nodejs.org/en/download/).

For more comprehesive guide on installation for your OS refer the link
[Windows](https://nodesource.com/blog/installing-nodejs-tutorial-windows/) / [Mac](https://nodesource.com/blog/installing-nodejs-tutorial-mac-os-x/)

**#2.  Yarn** \
*The project uses yarn for node package management over npm.* \
You can download the binaries for yarn from [here](https://yarnpkg.com/lang/en/)

Select the *Operating System* and *Version* to find the comprehensive instruction on how to setup yarn for your system. 

**#2.  CocoaPods** (only required for building iOS app) \
[CocoaPods](https://cocoapods.org/)  is a dependency manager for Swift and Objective-C Cocoa projects, its required for IOS deployment.

Refer [here](https://cocoapods.org/)  on how to install *CocoaPods*

**#4. React Native CLI** \
	You need to have the react native environment setup for running or building this project.
	
For more information on how to setup you environment for react-native head over [here](https://facebook.github.io/react-native/docs/getting-started.html) \
Make sure to see instruction for  **React Native CLI Quickstart** and not for ~~Expo CLI Quickstart~~

*NOTE: \
For compiling apps for android and ios react native requires you to have Android Studio (or Android SDK) and Xcode installed on your system* 




### Installing

*Now that we have our environment ready, we need to install our application dependencies.*

Firstly, 
Change your directory to the root of the cloned repository, 
and run

```
yarn install
```
to install all the node dependencies for this application.

Wait until the dependencies are finished installing.

Thats it !


## Deployment
Now, Its time for deployment.

### **Android**

***Deploying to a simulator***

 1. Open Android Studio to  [create and run an android
    simulator](https://developer.android.com/studio/run/managing-avds) 
 2. Run this command `react-native run-android` 

***Deploying to an android physical device,***
 1. Connect the physical android device via USB cable and make sure USB debugging is enabled  *(You can find more information here on how to enable USB debugging [here](https://developer.android.com/studio/debug/dev-options))*
 
 2. Run this command `react-native run-android`
> Don't diconnect the USB cable while the app is getting installed,
> and wait for the build files to be download to your after installation.
> 
Now, you should see the application running on your android device.

### **IOS** ( currently builds failing )

***Deploying to a simulator*** \
Follow the guide [here](https://facebook.github.io/react-native/docs/running-on-simulator-ios) to run deploy it on a simulator.

***Deploying to an IOS physical device,*** \
 Follow the guide [here](https://facebook.github.io/react-native/docs/running-on-device) to run the ios application on your device.

## Built With

* [React Native](https://facebook.github.io/react-native/) - A framework for building native apps using React
* [NativeBase](https://nativebase.io/) Native Environment to build Native Apps
* [Yarn](https://yarnpkg.com/lang/en/) - Dependency Management NodeJs
* [Gradle](https://gradle.org/) - Dependency Management Android
* [CocoaPods](https://cocoapods.org/)  Dependency Management for IOS

## Contributing

## Versioning

## Authors

See also the list of [contributors](https://github.com/onepanelio/demo-app/contributors) who participated in this project.

## License

## Acknowledgments

*  [shaqian](https://github.com/shaqian)/**[tflite-react-native](https://github.com/shaqian/tflite-react-native/tree/master/example)**  cross platform  react native plugin to run model on images.
* [react-native-camera](https://react-native-community.github.io/react-native-camera/) The comprehensive camera module for React Native
* [Others](https://github.com/onepanelio/demo-app/blob/master/package.json)
