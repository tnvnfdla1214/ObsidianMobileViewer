import useStore from '@/src/context/store';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function RepositoriesScreen() {
  const router = useRouter();
  const { repositories, user, setCurrentRepo } = useStore();

  const handleSelectRepository = (repo: any) => {
    setCurrentRepo(repo);
    router.push('/(main)/files');
  };

  const renderRepository = ({ item }: any) => (
    <Pressable
      onPress={() => handleSelectRepository(item)}
      style={styles.repositoryItem}
    >
      <Text style={styles.repoName}>{item.name}</Text>
      <Text style={styles.repoDescription}>
        {item.description || 'No description'}
      </Text>
      {item.private && <Text style={styles.privateTag}>Private</Text>}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.userName}>안녕하세요, {user?.login}!</Text>
      </View>

      {repositories.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Repository가 없습니다.</Text>
        </View>
      ) : (
        <FlatList
          data={repositories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRepository}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 10,
  },
  repositoryItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0066cc',
  },
  repoName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  repoDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  privateTag: {
    fontSize: 11,
    color: '#fff',
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});