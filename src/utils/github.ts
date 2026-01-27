import { Octokit } from '@octokit/rest';
import * as SecureStore from 'expo-secure-store';

const GITHUB_CLIENT_ID = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID || '';

export const getOctokitInstance = async () => {
  const token = await SecureStore.getItemAsync('github_token');
  if (!token) {
    throw new Error('No token found');
  }
  return new Octokit({ auth: token });
};

export const getUserInfo = async (token: string) => {
  try {
    const octokit = new Octokit({ auth: token });
    const { data } = await octokit.users.getAuthenticated();
    return {
      login: data.login,
      avatar_url: data.avatar_url,
      name: data.name,
    };
  } catch (error) {
    console.error('Failed to get user info:', error);
    throw error;
  }
};

export const getUserRepositories = async (token: string) => {
  try {
    const octokit = new Octokit({ auth: token });
    const { data } = await octokit.repos.listForAuthenticatedUser({
      per_page: 100,
      affiliation: 'owner',  // 내가 소유한 레포지토리만
    });
    return data;
  } catch (error) {
    console.error('Failed to get repositories:', error);
    throw error;
  }
};