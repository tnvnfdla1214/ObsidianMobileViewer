import { StyleSheet, Text, View } from 'react-native';

export default function EditorScreen() {
  return (
    <View style={styles.container}>
      <Text>파일 편집</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});