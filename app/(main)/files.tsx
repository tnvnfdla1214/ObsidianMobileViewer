import { StyleSheet, Text, View } from 'react-native';

export default function FilesScreen() {
  return (
    <View style={styles.container}>
      <Text>파일 목록</Text>
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