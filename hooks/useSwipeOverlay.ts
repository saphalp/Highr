import { SWIPE_OVERLAYS } from "@/constants/discover";
import { useRef, useState } from "react";
import { Animated } from "react-native";

export function useSwipeOverlay() {
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const overlayScale = useRef(new Animated.Value(0.5)).current;
  const [overlayType, setOverlayType] = useState<keyof typeof SWIPE_OVERLAYS | null>(null);
  const buttonSwipePending = useRef(false);

  const flashSwipeOverlay = (type: keyof typeof SWIPE_OVERLAYS) => {
    if (buttonSwipePending.current) {
      buttonSwipePending.current = false;
      return;
    }
    setOverlayType(type);
    overlayOpacity.setValue(0);
    overlayScale.setValue(0.8);
    Animated.sequence([
      Animated.parallel([
        Animated.spring(overlayScale, {
          toValue: 1,
          friction: 6,
          tension: 200,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(300),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setOverlayType(null));
  };

  const triggerSwipe = (type: keyof typeof SWIPE_OVERLAYS, doSwipe: () => void) => {
    buttonSwipePending.current = true;
    setOverlayType(type);
    overlayOpacity.setValue(0);
    overlayScale.setValue(0.5);
    Animated.parallel([
      Animated.spring(overlayScale, {
        toValue: 1,
        friction: 5,
        tension: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      doSwipe();
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(() => setOverlayType(null));
    });
  };

  return { overlayOpacity, overlayScale, overlayType, flashSwipeOverlay, triggerSwipe };
}
