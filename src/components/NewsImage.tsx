import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";

/**
 * Image that always looks intentional: it shows a tinted panel with a large
 * glyph first, then overlays a remote photo on top. If the photo is slow or
 * offline the tinted panel remains, so cards never render as broken images.
 */
type Props = {
  uri?: string;
  glyph?: string;
  tint?: string;
  radius?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
};

export default function NewsImage({
  uri,
  glyph = "💊",
  tint = "#eef0ff",
  radius = 0,
  height,
  style,
}: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: tint, borderRadius: radius, height },
        style,
      ]}
    >
      <Text style={styles.glyph}>{glyph}</Text>
      {!!uri && !failed && (
        <Image
          source={{ uri }}
          onError={() => setFailed(true)}
          style={[StyleSheet.absoluteFillObject, { borderRadius: radius }]}
          resizeMode="cover"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  glyph: { fontSize: 40, opacity: 0.55 },
});
