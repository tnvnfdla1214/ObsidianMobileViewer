import { Octokit } from '@octokit/rest';
import * as SecureStore from 'expo-secure-store';

const GITHUB_CLIENT_ID = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID || '';

// Base64 디코딩 (React Native 환경용)
const decodeBase64 = (base64: string): string => {
  // base64 문자열에서 줄바꿈 제거
  const cleanBase64 = base64.replace(/\n/g, '');
  // atob로 디코딩 후 UTF-8 처리
  const binaryString = atob(cleanBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new TextDecoder('utf-8').decode(bytes);
};

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

export interface GitHubContent {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size: number;
  sha: string;
  download_url: string | null;
}

// 레포지토리의 파일/폴더 목록 가져오기
export const getRepositoryContents = async (
  token: string,
  owner: string,
  repo: string,
  path: string = ''
): Promise<GitHubContent[]> => {
  try {
    const octokit = new Octokit({ auth: token });
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    // 단일 파일인 경우 배열로 감싸서 반환
    if (!Array.isArray(data)) {
      return [data as GitHubContent];
    }

    // 폴더가 먼저 오도록 정렬
    return (data as GitHubContent[]).sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'dir' ? -1 : 1;
    });
  } catch (error) {
    console.error('Failed to get repository contents:', error);
    throw error;
  }
};

// 파일 내용 가져오기
export const getFileContent = async (
  token: string,
  owner: string,
  repo: string,
  path: string
): Promise<string> => {
  try {
    const octokit = new Octokit({ auth: token });
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if (Array.isArray(data) || data.type !== 'file') {
      throw new Error('Path is not a file');
    }

    // Base64 디코딩 (React Native 환경)
    const content = decodeBase64(data.content);
    return content;
  } catch (error) {
    console.error('Failed to get file content:', error);
    throw error;
  }
};