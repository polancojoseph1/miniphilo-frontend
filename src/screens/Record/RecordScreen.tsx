import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {launchCamera, MediaType} from 'react-native-image-picker';
import Video from 'react-native-video';

const {width, height} = Dimensions.get('window');

export default function RecordScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [videoPath, setVideoPath] = useState<string>('');
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [videoSize, setVideoSize] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (isRecording) {
      // Pulsing animation for recording state
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  React.useEffect(() => {
    if (videoPath) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [videoPath]);

  // Start video recording
  const startRecording = async () => {
    const options = {
      mediaType: 'video' as MediaType,
      videoQuality: 'high' as const,
      durationLimit: 60, // 60 seconds max
      cameraType: 'front' as const, // Use front camera
      includeBase64: false,
      saveToPhotos: true, // Save to device gallery
    };

    try {
      setIsRecording(true);
      
      launchCamera(options, (response) => {
        setIsRecording(false);
        
        if (response.didCancel) {
          Alert.alert('Cancelled', 'Video recording was cancelled');
          return;
        }

        if (response.errorMessage) {
          console.error('Camera error:', response.errorMessage);
          Alert.alert('Error', response.errorMessage);
          return;
        }

        if (response.assets && response.assets[0]) {
          const video = response.assets[0];
          console.log('Video recorded:', video);
          
          if (video.uri) {
            setVideoPath(video.uri);
            setVideoDuration(video.duration || 0);
            setVideoSize(video.fileSize || 0);
            Alert.alert(
              '🎉 Success!', 
              `Video recorded successfully!\nDuration: ${Math.round((video.duration || 0) / 1000)}s\nSize: ${Math.round((video.fileSize || 0) / 1024)}KB`
            );
          }
        }
      });
    } catch (error) {
      console.error('Start recording error:', error);
      setIsRecording(false);
      Alert.alert('Error', 'Could not start recording');
    }
  };

  // Clear video and record new one
  const recordNewVideo = () => {
    setVideoPath('');
    setVideoDuration(0);
    setVideoSize(0);
    setIsPlaying(false);
  };

  // Toggle video playback
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>✨ Create Your Message</Text>
            <Text style={styles.subtitle}>Record a beautiful video message</Text>
          </View>
          
          {/* Camera/Video Display */}
          <View style={styles.mediaSection}>
            <View style={[styles.cameraContainer, videoPath && styles.videoActive]}>
              {videoPath ? (
                // Show recorded video
                <Animated.View style={[styles.videoContainer, {opacity: fadeAnim}]}>
                  <Video
                    source={{uri: videoPath}}
                    style={styles.video}
                    controls={true}
                    resizeMode="contain"
                    paused={!isPlaying}
                    onLoad={(data) => console.log('Video loaded:', data)}
                    onError={(error) => console.error('Video error:', error)}
                  />
                  <View style={styles.videoInfoContainer}>
                    <View style={styles.videoInfo}>
                      <Text style={styles.videoInfoText}>
                        ⏱️ {Math.round(videoDuration / 1000)}s
                      </Text>
                      <Text style={styles.videoInfoText}>
                        💾 {Math.round(videoSize / 1024)}KB
                      </Text>
                    </View>
                  </View>
                </Animated.View>
              ) : (
                // Show placeholder when no video
                <View style={styles.cameraPlaceholder}>
                  <Animated.View 
                    style={[
                      styles.placeholderContent, 
                      isRecording && {transform: [{scale: pulseAnim}]}
                    ]}
                  >
                    <View style={styles.cameraIcon}>
                      <Text style={styles.cameraEmoji}>📹</Text>
                    </View>
                    <Text style={styles.placeholderText}>
                      {isRecording ? 'Recording Magic...' : 'Ready to Capture'}
                    </Text>
                    <Text style={styles.placeholderSubtext}>
                      {isRecording ? 'Creating your video story' : 'Tap the button below to start'}
                    </Text>
                  </Animated.View>
                </View>
              )}
              
              {isRecording && (
                <View style={styles.recordingOverlay}>
                  <Animated.View style={[styles.recordingIndicator, {transform: [{scale: pulseAnim}]}]}>
                    <View style={styles.recordingDot} />
                    <Text style={styles.recordingText}>LIVE</Text>
                  </Animated.View>
                </View>
              )}
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controlsSection}>
            {!videoPath ? (
              // Show record button when no video
              !isRecording ? (
                <TouchableOpacity 
                  style={[styles.primaryButton, styles.recordButton]} 
                  onPress={startRecording}
                  activeOpacity={0.8}
                >
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonIcon}>🎬</Text>
                    <Text style={styles.primaryButtonText}>Start Recording</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={[styles.primaryButton, styles.cancelButton]} 
                  onPress={() => setIsRecording(false)}
                  activeOpacity={0.8}
                >
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonIcon}>✋</Text>
                    <Text style={styles.primaryButtonText}>Cancel</Text>
                  </View>
                </TouchableOpacity>
              )
            ) : (
              // Show video controls when video exists
              <View style={styles.videoControls}>
                <TouchableOpacity 
                  style={[styles.secondaryButton, styles.playButton]} 
                  onPress={togglePlayback}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonIcon}>
                    {isPlaying ? '⏸️' : '▶️'}
                  </Text>
                  <Text style={styles.secondaryButtonText}>
                    {isPlaying ? 'Pause' : 'Play'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.secondaryButton, styles.newRecordButton]} 
                  onPress={recordNewVideo}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonIcon}>🔄</Text>
                  <Text style={styles.secondaryButtonText}>Record New</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Video Path Info */}
          {videoPath && (
            <Animated.View style={[styles.pathContainer, {opacity: fadeAnim}]}>
              <Text style={styles.pathLabel}>📁 Saved Location:</Text>
              <Text style={styles.pathText} numberOfLines={2}>
                {videoPath}
              </Text>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '500',
  },
  mediaSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  cameraContainer: {
    height: height * 0.4,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f8f9fa',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  videoActive: {
    backgroundColor: '#000000',
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  placeholderContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  cameraIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  cameraEmoji: {
    fontSize: 36,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 1,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  video: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoInfoContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  videoInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  videoInfoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  recordingOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#FF0000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 6,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  recordingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  controlsSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  primaryButton: {
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 32,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recordButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#cccccc',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  videoControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  playButton: {
    backgroundColor: '#4CAF50',
  },
  newRecordButton: {
    backgroundColor: '#2196F3',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  pathContainer: {
    marginHorizontal: 24,
    padding: 20,
    backgroundColor: '#f0f8f0',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  pathLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  pathText: {
    fontSize: 12,
    color: '#333333',
    lineHeight: 18,
    fontFamily: 'monospace',
  },
});