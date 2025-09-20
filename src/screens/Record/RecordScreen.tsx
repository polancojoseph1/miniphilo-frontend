// // RecordScreen.tsx - With Fixed Camera Device Selection
// import React, {useState, useRef, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   useColorScheme,
// } from 'react-native';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import {
//   Camera,
//   useCameraDevice,
//   useCameraPermission,
//   useMicrophonePermission,
// } from 'react-native-vision-camera';

// export default function RecordScreen() {
//   const [isRecording, setIsRecording] = useState(false);
//   const [hasRecording, setHasRecording] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [videoPath, setVideoPath] = useState<string | null>(null);
//   const [showCamera, setShowCamera] = useState(false);


//   console.log('HELLO MUNDITO!!! <-----------------------------------------')
  
//   const isDarkMode = useColorScheme() === 'dark';
//   const camera = useRef<Camera>(null);
//   const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   // Camera permissions and devices
//   const {hasPermission: cameraPermission, requestPermission: requestCameraPermission} = useCameraPermission();
//   const {hasPermission: microphonePermission, requestPermission: requestMicrophonePermission} = useMicrophonePermission();
  
//   // Use useCameraDevice hook instead of useCameraDevices
//   // 'front' for selfie camera, 'back' for rear camera
//   const device = useCameraDevice('front'); // You can change this to 'back' if you prefer rear camera

//   useEffect(() => {
//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
//     };
//   }, []);

//   const requestPermissions = async () => {
//     const cameraStatus = await requestCameraPermission();
//     const microphoneStatus = await requestMicrophonePermission();
    
//     if (cameraStatus && microphoneStatus) {
//       setShowCamera(true);
//     } else {
//       Alert.alert(
//         'Permissions Required',
//         'Camera and microphone permissions are needed to record your heartfelt message.',
//         [
//           {text: 'Cancel', style: 'cancel'},
//           {text: 'Try Again', onPress: requestPermissions}
//         ]
//       );
//     }
//   };

//   const handleStartRecording = async () => {
//     if (!camera.current || !device) {
//       Alert.alert('Error', 'Camera not available');
//       return;
//     }

//     try {
//       setIsRecording(true);
//       setRecordingTime(0);
      
//       // Start timer
//       timerRef.current = setInterval(() => {
//         setRecordingTime(prev => {
//           if (prev >= 60) { // Auto-stop at 60 seconds
//             handleStopRecording();
//             return 60;
//           }
//           return prev + 1;
//         });
//       }, 1000);

//       // Start recording
//       await camera.current.startRecording({
//         onRecordingFinished: (recordedVideo) => {
//           setVideoPath(recordedVideo.path);
//           setHasRecording(true);
//           console.log('Video recorded:', recordedVideo.path);
//         },
//         onRecordingError: (error) => {
//           console.error('Recording error:', error);
//           Alert.alert('Recording Error', 'Failed to record video');
//           setIsRecording(false);
//           if (timerRef.current) {
//             clearInterval(timerRef.current);
//           }
//         },
//       });

//     } catch (error) {
//       console.error('Start recording error:', error);
//       Alert.alert('Error', 'Failed to start recording');
//       setIsRecording(false);
//     }
//   };

//   const handleStopRecording = async () => {
//     if (!camera.current) return;

//     try {
//       await camera.current.stopRecording();
//       setIsRecording(false);
      
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }

//       Alert.alert(
//         'Recording Complete!',
//         'Your heartfelt message has been recorded successfully.'
//       );
//     } catch (error) {
//       console.error('Stop recording error:', error);
//       Alert.alert('Error', 'Failed to stop recording');
//     }
//   };

//   const handleRetake = () => {
//     Alert.alert(
//       'Retake Recording?',
//       'This will delete your current recording. Are you sure?',
//       [
//         {text: 'Cancel', style: 'cancel'},
//         {
//           text: 'Retake',
//           onPress: () => {
//             setHasRecording(false);
//             setIsRecording(false);
//             setRecordingTime(0);
//             setVideoPath(null);
//           },
//         },
//       ]
//     );
//   };

//   const handleContinue = () => {
//     if (!hasRecording || !videoPath) {
//       Alert.alert('No Recording', 'Please record a message first.');
//       return;
//     }
//     Alert.alert(
//       'Recording Ready!',
//       `Your heartfelt message is ready to inspire others!\nVideo saved at: ${videoPath}\n\nPayment processing coming next!`
//     );
//   };

//   const handleSkip = () => {
//     Alert.alert(
//       'Skip Recording?',
//       'You can always add a video message later. Continue to donation?',
//       [
//         {text: 'Yes, Skip', onPress: () => console.log('Skip to donation')},
//         {text: 'Stay Here', style: 'cancel'},
//       ]
//     );
//   };

//   const handleRequestCamera = () => {
//     requestPermissions();
//   };

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   // Show permissions request if camera not available
//   if (!cameraPermission || !microphonePermission || !showCamera) {
//     return (
//       <SafeAreaView style={[styles.container, {backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff'}]}>
//         <View style={styles.permissionContainer}>
//           <Text style={[styles.permissionTitle, {color: isDarkMode ? '#ffffff' : '#2E7D32'}]}>
//             Camera Access Needed
//           </Text>
//           <Text style={[styles.permissionText, {color: isDarkMode ? '#cccccc' : '#666666'}]}>
//             To record your heartfelt donation message, we need access to your camera and microphone.
//           </Text>
//           <TouchableOpacity
//             style={styles.permissionButton}
//             onPress={handleRequestCamera}
//             activeOpacity={0.8}
//           >
//             <Text style={styles.permissionButtonText}>Enable Camera</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // Show error if no camera device
//   if (!device) {
//     return (
//       <SafeAreaView style={[styles.container, {backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff'}]}>
//         <View style={styles.errorContainer}>
//           <Text style={[styles.errorText, {color: isDarkMode ? '#ffffff' : '#333333'}]}>
//             Camera not available
//           </Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={[styles.container, {backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff'}]}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Header Section */}
//         <View style={styles.header}>
//           <Text style={[styles.title, {color: isDarkMode ? '#ffffff' : '#2E7D32'}]}>
//             Share Your Story
//           </Text>
//           <Text style={[styles.subtitle, {color: isDarkMode ? '#cccccc' : '#666666'}]}>
//             Record a personal message about why you're giving.{'\n'}
//             Inspire others to become mini philanthropists too!
//           </Text>
//         </View>

//         {/* Camera/Recording Area */}
//         <View style={styles.recordingSection}>
//           <View style={styles.cameraContainer}>
//             {!hasRecording ? (
//               <View style={styles.cameraWrapper}>
//                 <Camera
//                   ref={camera}
//                   style={styles.camera}
//                   device={device}
//                   isActive={showCamera && !hasRecording}
//                   video={true}
//                   audio={true}
//                 />
                
//                 {/* Recording overlay */}
//                 {isRecording && (
//                   <View style={styles.recordingOverlay}>
//                     <View style={styles.recordingIndicator}>
//                       <View style={styles.redDot} />
//                       <Text style={styles.recordingText}>RECORDING</Text>
//                     </View>
//                     <Text style={styles.timer}>{formatTime(recordingTime)}</Text>
//                     <Text style={styles.recordingTip}>
//                       Share why this cause matters to you
//                     </Text>
//                   </View>
//                 )}
//               </View>
//             ) : (
//               <View style={styles.recordingComplete}>
//                 <Text style={styles.successIcon}>✅</Text>
//                 <Text style={[styles.successText, {color: isDarkMode ? '#4CAF50' : '#4CAF50'}]}>
//                   Recording Complete!
//                 </Text>
//                 <Text style={[styles.successSubtext, {color: isDarkMode ? '#cccccc' : '#666666'}]}>
//                   {formatTime(recordingTime)} - Ready to inspire others
//                 </Text>
//               </View>
//             )}
//           </View>

//           {/* Recording Controls */}
//           <View style={styles.controlsSection}>
//             {!hasRecording && !isRecording && (
//               <TouchableOpacity
//                 style={styles.recordButton}
//                 onPress={handleStartRecording}
//                 activeOpacity={0.8}
//               >
//                 <View style={styles.recordButtonInner} />
//               </TouchableOpacity>
//             )}

//             {isRecording && (
//               <TouchableOpacity
//                 style={styles.stopButton}
//                 onPress={handleStopRecording}
//                 activeOpacity={0.8}
//               >
//                 <View style={styles.stopButtonInner} />
//               </TouchableOpacity>
//             )}

//             {hasRecording && !isRecording && (
//               <View style={styles.recordingActions}>
//                 <TouchableOpacity
//                   style={[styles.actionButton, styles.retakeButton]}
//                   onPress={handleRetake}
//                   activeOpacity={0.8}
//                 >
//                   <Text style={styles.retakeButtonText}>🔄 Retake</Text>
//                 </TouchableOpacity>
                
//                 <TouchableOpacity
//                   style={[styles.actionButton, styles.continueButton]}
//                   onPress={handleContinue}
//                   activeOpacity={0.8}
//                 >
//                   <Text style={styles.continueButtonText}>✨ Continue</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>
//         </View>

//         {/* Recording Tips */}
//         <View style={[
//           styles.tipsSection,
//           {backgroundColor: isDarkMode ? '#2a2a2a' : '#f0f8ff'}
//         ]}>
//           <Text style={[styles.tipsTitle, {color: isDarkMode ? '#4CAF50' : '#2E7D32'}]}>
//             💡 Recording Tips
//           </Text>
//           <Text style={[styles.tipsText, {color: isDarkMode ? '#cccccc' : '#666666'}]}>
//             • Share why this cause matters to you{'\n'}
//             • Keep it authentic and from the heart{'\n'}
//             • Encourage others to join the movement{'\n'}
//             • Aim for 15-60 seconds for best engagement
//           </Text>
//         </View>

//         {/* Bottom Actions */}
//         <View style={styles.bottomActions}>
//           <TouchableOpacity
//             style={[
//               styles.skipButton,
//               {borderColor: isDarkMode ? '#666666' : '#4CAF50'}
//             ]}
//             onPress={handleSkip}
//             activeOpacity={0.8}
//           >
//             <Text style={[styles.skipButtonText, {color: isDarkMode ? '#cccccc' : '#4CAF50'}]}>
//               Skip Recording
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   permissionContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 40,
//   },
//   permissionTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   permissionText: {
//     fontSize: 16,
//     textAlign: 'center',
//     lineHeight: 24,
//     marginBottom: 32,
//   },
//   permissionButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 16,
//     paddingHorizontal: 32,
//     borderRadius: 8,
//   },
//   permissionButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   header: {
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 30,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 12,
//   },
//   subtitle: {
//     fontSize: 16,
//     textAlign: 'center',
//     lineHeight: 24,
//   },
//   recordingSection: {
//     paddingHorizontal: 20,
//     marginBottom: 30,
//   },
//   cameraContainer: {
//     height: 280,
//     borderRadius: 16,
//     overflow: 'hidden',
//     marginBottom: 20,
//   },
//   cameraWrapper: {
//     flex: 1,
//     position: 'relative',
//   },
//   camera: {
//     flex: 1,
//     borderRadius: 16,
//   },
//   recordingOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 16,
//   },
//   recordingIndicator: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   redDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: '#d32f2f',
//     marginRight: 8,
//   },
//   recordingText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#ffffff',
//   },
//   timer: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#ffffff',
//     marginBottom: 12,
//   },
//   recordingTip: {
//     fontSize: 14,
//     textAlign: 'center',
//     color: '#ffffff',
//   },
//   recordingComplete: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//     borderRadius: 16,
//   },
//   successIcon: {
//     fontSize: 48,
//     marginBottom: 12,
//   },
//   successText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   successSubtext: {
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   controlsSection: {
//     alignItems: 'center',
//   },
//   recordButton: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#d32f2f',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#d32f2f',
//     shadowOffset: {width: 0, height: 4},
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   recordButtonInner: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#ffffff',
//   },
//   stopButton: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#666666',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   stopButtonInner: {
//     width: 30,
//     height: 30,
//     backgroundColor: '#ffffff',
//     borderRadius: 4,
//   },
//   recordingActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     paddingHorizontal: 20,
//   },
//   actionButton: {
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     flex: 0.45,
//   },
//   retakeButton: {
//     backgroundColor: '#FF9800',
//   },
//   retakeButtonText: {
//     color: '#ffffff',
//     fontSize: 14,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   continueButton: {
//     backgroundColor: '#4CAF50',
//   },
//   continueButtonText: {
//     color: '#ffffff',
//     fontSize: 14,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   tipsSection: {
//     marginHorizontal: 20,
//     padding: 20,
//     borderRadius: 12,
//     marginBottom: 20,
//   },
//   tipsTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   tipsText: {
//     fontSize: 14,
//     lineHeight: 22,
//   },
//   bottomActions: {
//     paddingHorizontal: 20,
//     paddingBottom: 40,
//   },
//   skipButton: {
//     backgroundColor: 'transparent',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     borderWidth: 1,
//     alignItems: 'center',
//   },
//   skipButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });